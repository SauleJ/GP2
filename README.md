# BookMaven - Where Books Find You! 📚✨

## About the Magic Behind the Curtain

BookMaven isn't your average bookworm's tool. It's a brainchild of some seriously smart cookies (a.k.a. you guys) built as part of "Natural Language Processing" course at Vilnius University. Think of it as a personal librarian with a techy twist. It uses fancy NLP stuff to recommend books in three ways - Content-Based (it knows what you like), Collaborative (it knows what others like), and Hybrid (best of both worlds). Kudos to the dream team - Saulė, Atėnė, and Airidas - for brewing up this concoction!

## The Wizards Behind the Curtain

- **Saulė Jonynaitė**: The Optimization Wizard. Made sure the recommendations don't throw curveballs.
- **Atėnė Kasperavičiūtė**: The Mastermind. Led the charge and made sure it all looked pretty and made sense.
- **Airidas Žaliauskas**: The Tech Alchemist. Turned complex codes into a slick website.

## See It Live

Curious to see it in action? Check out BookMaven [here](https://bookmaven.vercel.app/) - it's up and running on Google Cloud Platform and Vercel.

## Get Your Hands Dirty

Want to tinker with it yourself? Here's how you can get it running locally:

### For the Backstage (Backend)

1. Dive into the Backend:

```
cd Backend
```

2. Wake up the Flask genie:

```
python -m flask run
```

### For the Shiny Front (Frontend)

1. Open a new magic portal (terminal) and go to Frontend:

```
cd Frontend
```

2. Summon necessary spells (packages):

```
npm install
```

3. Create a magic scroll (`.env` file) with:

```
REACT_APP_BACKEND_DOMAIN=http://127.0.0.1:5000
```

4. Start the show:

```
npm run dev
```

## Peek Under the Hood

### Backend - The Engine Room

- It's all Flask, baby! Handles the brainy stuff - data crunching, recommendations, and chatty APIs.
- Data's loaded, cleaned, and jazzed up for the recommendation engines.

### Frontend - The Show Floor

- Built with React, it's where the magic meets the audience.
- Simple yet classy UI, easier to use than a library card.

## The Grand Finale

BookMaven is more than a project; it's a showcase of NLP in action. It's a testament to the power of collaboration, ingenuity, and a whole lot of coding. It's not just a system; it's an experience. Ready for the next chapter?
