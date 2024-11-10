import json
import logging
import pickle
import re
import string

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from sklearn.metrics.pairwise import linear_kernel
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)
app.logger.setLevel(logging.INFO)
app.logger.info('Optimized Server Loading...')

# ---------------------------------------------------------------------------------------------------------------- #
# Load data
# ---------------------------------------------------------------------------------------------------------------- #
app.logger.info('Loading data')
books_df = pd.read_csv('books_enriched.csv')
user_ratings_df = pd.read_csv('ratings.csv')

# ---------------------------------------------------------------------------------------------------------------- #
# Load models using pickle
# ---------------------------------------------------------------------------------------------------------------- #
with open('tfidf_vectorizer.pkl', 'rb') as file:
    tfidf_vectorizer = pickle.load(file)
with open('tfidf_matrix_titles.pkl', 'rb') as file:
    tfidf_matrix_titles = pickle.load(file)
with open('user_item_matrix_sparse_T.pkl', 'rb') as file:
    user_item_matrix_sparse_T = pickle.load(file)
with open('model_knn.pkl', 'rb') as file:
    model_knn = pickle.load(file)

# ---------------------------------------------------------------------------------------------------------------- #
# Preprocessing
# ---------------------------------------------------------------------------------------------------------------- #
def format_author_names(authors_str):
    try:
        authors_str = re.sub(r"[\[\]']", "", authors_str)
        authors_list = re.split(r",\s*(?![^()]*\))", authors_str)
        authors_list = [author.strip().strip("'\"") for author in authors_list]
        return ', '.join(authors_list)
    except Exception as e:
        return authors_str

app.logger.info('Preprocessing data')
books_df.drop(columns=['Unnamed: 0', 'index'], inplace=True)
books_df['description'] = books_df['description'].fillna('')
books_df['isbn'] = books_df['isbn'].fillna('Unknown')
books_df['isbn13'] = books_df['isbn13'].fillna(0).astype(int)
books_df['original_publication_year'] = books_df['original_publication_year'].fillna(0).astype(int)
books_df['original_title'] = books_df['original_title'].fillna('')
books_df['pages'] = books_df['pages'].fillna(0).astype(int)
books_df['authors'] = books_df['authors'].apply(format_author_names)
books_df['title'] = books_df['title'].str.replace(r"\s+", " ", regex=True)

# ---------------------------------------------------------------------------------------------------------------- #
# Normalize text
# ---------------------------------------------------------------------------------------------------------------- #
app.logger.info('Normalizing book titles')
def normalize_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text

books_df['normalized_title'] = books_df['title'].apply(normalize_text)

# ---------------------------------------------------------------------------------------------------------------- #
# Search Function
# ---------------------------------------------------------------------------------------------------------------- #
def search_similar_books_by_title(query, top_n=12, similarity_threshold=0.1):
    processed = re.sub("[^a-zA-Z0-9 ]", "", query.lower())
    query_vec = tfidf_vectorizer.transform([processed])
    cosine_similarities = linear_kernel(query_vec, tfidf_matrix_titles).flatten()
    similar_indices = cosine_similarities.argsort()[::-1]
    filtered_indices = [idx for idx in similar_indices if cosine_similarities[idx] >= similarity_threshold]
    top_indices = filtered_indices[:top_n]
    if not top_indices:
        return pd.DataFrame()
    result_df = books_df.iloc[top_indices]
    result_df = result_df[['book_id', 'title', 'authors', 'average_rating', 'ratings_count', 'image_url']]
    return result_df

# ---------------------------------------------------------------------------------------------------------------- #
# Collaborative Filtering Recommendations
# ---------------------------------------------------------------------------------------------------------------- #
def collaborative_recommendations(book_id, top_n=10):
    model_knn.fit(user_item_matrix_sparse_T)
    book_id_to_idx = {book_id: idx for idx, book_id in enumerate(user_ratings_df['book_id'].unique())}
    if book_id not in book_id_to_idx:
        return pd.DataFrame()
    book_idx = book_id_to_idx[book_id]
    _, indices = model_knn.kneighbors(user_item_matrix_sparse_T[book_idx].reshape(1, -1), n_neighbors=top_n+1)
    book_indices = [user_ratings_df['book_id'].unique()[i] for i in indices.flatten()[1:]]
    return books_df[books_df['book_id'].isin(book_indices)]

# ---------------------------------------------------------------------------------------------------------------- #
# Content-Based Recommendations
# ---------------------------------------------------------------------------------------------------------------- #
app.logger.info('Initializing content-based filtering recommendation method')
books_df['content'] = (pd.Series(books_df[['authors', 'title', 'genres', 'description']].fillna('').values.tolist()).str.join(' '))

def content_based_recommendations(book_id, top_n=50, df=books_df):
    try:
        with open('tfidf_matrix_content.pkl', 'rb') as file:
            tfidf_matrix = pickle.load(file)
    except Exception as e:
        app.logger.error('Error loading TF-IDF matrix for content: {}'.format(e))
        return pd.DataFrame()
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    if book_id not in df['book_id'].values:
        return pd.DataFrame()
    book_id_to_index = pd.Series(df.index, index=df['book_id'])
    idx = book_id_to_index[book_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_n = min(top_n, len(sim_scores) - 1)
    sim_scores = sim_scores[1:top_n+1]
    book_indices = [i[0] for i in sim_scores]
    books_subset = df.iloc[book_indices][['book_id', 'title', 'authors', 'average_rating', 'ratings_count']]
    v = books_subset['ratings_count']
    m = books_subset['ratings_count'].quantile(0.75)
    R = books_subset['average_rating']
    C = books_subset['average_rating'].median()
    books_subset['new_score'] = (v / (v + m) * R) + (m / (m + v) * C)
    high_rating = books_subset[books_subset['ratings_count'] >= m]
    high_rating = high_rating.sort_values('new_score', ascending=False)
    return df.loc[high_rating.index]

# ---------------------------------------------------------------------------------------------------------------- #
# Hybrid Method
# ---------------------------------------------------------------------------------------------------------------- #
app.logger.info('Combining collaborative and content-based recommendation methods into hybrid method')
def hybrid_recommendations(book_id, top_n=10):
    content_recommendations = content_based_recommendations(book_id)
    collab_recommendations = collaborative_recommendations(book_id, top_n=top_n)
    hybrid_recommendations_df = pd.concat([content_recommendations, collab_recommendations]).drop_duplicates().head(top_n)
    return hybrid_recommendations_df

# ---------------------------------------------------------------------------------------------------------------- #
# Flask Routes
# ---------------------------------------------------------------------------------------------------------------- #
app.logger.info('Server ready for use!')
@app.route('/search', methods=['GET']) # /search?query=... (query is a string) returns a list of books
def search():
    app.logger.info('Search endpoint called')
    query = request.args.get('query', None)
    processed_query = re.sub("[^a-zA-Z0-9 ]", "", query.lower())
    app.logger.info(f'Query: {processed_query}')
    if not query:
        return jsonify({"error": "No query parameter provided"}), 400
    try:
        search_results = search_similar_books_by_title(query)
        if search_results.empty:
            return jsonify({"message": "No results found"}), 404
        else:
            return jsonify(search_results.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/recommend', methods=['GET'])
def recommend():
    app.logger.info('Generating book recommendations')
    book_id = request.args.get('book_id', type=int)
    method = request.args.get('method', default='content-based')
    top_n = request.args.get('top_n', default=10, type=int)

    if not book_id:
        return jsonify({"error": "No book_id parameter provided"}), 400

    try:
        recommendations = pd.DataFrame()
        if method == 'Content-Based':
            recommendations = content_based_recommendations(book_id)
        elif method == 'Collaborative':
            recommendations = collaborative_recommendations(book_id, top_n=top_n)
        elif method == 'Hybrid':
            recommendations = hybrid_recommendations(book_id, top_n=top_n)
        else:
            return jsonify({"error": "Invalid recommendation method"}), 400

        if recommendations.empty:
            return jsonify({"message": "No recommendations found"}), 404

        recommendations = recommendations[['book_id', 'title', 'authors', 'average_rating', 'ratings_count', 'image_url', 'genres']]
        recommendations['genres'] = recommendations['genres'].apply(lambda x: json.loads(x.replace("'", "\"")) if isinstance(x, str) else x)
        recommendations['image_url'] = recommendations['image_url'].apply(lambda url: re.sub(r'books/(\d+)m/', r'books/\1l/', url))

        recommendations_json = recommendations.to_dict(orient='records')

        return jsonify(recommendations_json), 200
    except Exception as e:
        app.logger.error(f'An error occurred while generating recommendations: {e}')
        return jsonify({"error": str(e)}), 500

@app.route('/book/<int:book_id>', methods=['GET'])
def book_details(book_id):
    app.logger.info(f'Retrieving details for book ID: {book_id}')

    book_detail = books_df[books_df['book_id'] == book_id]

    if book_detail.empty:
        app.logger.info(f'Book ID {book_id} not found in the DataFrame')
        return jsonify({'message': 'Book not found'}), 404
    
    book_detail_series = book_detail.iloc[0]
    genres = json.loads(book_detail_series['genres'].replace("'", "\"")) if isinstance(book_detail_series['genres'], str) else book_detail_series['genres']
    
    image_url = book_detail_series['image_url']
    image_url = re.sub(r'books/(\d+)m/', r'books/\1l/', image_url)

    book_detail_json = {
        'book_id': str(book_detail_series['book_id']),
        'title': book_detail_series['title'],
        'authors': book_detail_series['authors'],
        'average_rating': float(book_detail_series['average_rating']),
        'ratings_count': int(book_detail_series['ratings_count']),
        'image_url': image_url,
        'pages': int(book_detail_series['pages']),
        'description': book_detail_series['description'],
        'genres': genres
    }

    return jsonify(book_detail_json), 200

@app.route("/")
def hello() -> str:
    return "Hello World!"

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)