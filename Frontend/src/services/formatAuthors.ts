export function formatAuthors(authors: string, MAX_AUTHORS_DISPLAY = 3) {
  const authorsList = authors.split(", ");
  if (authorsList.length > MAX_AUTHORS_DISPLAY) {
    return `${authorsList
      .slice(0, MAX_AUTHORS_DISPLAY)
      .join(", ")} and others...`;
  }
  return authors;
}
