import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import SearchResults from "./pages/SearchResults";
import BookDetailsPage from "./pages/BookDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/search", element: <SearchResults /> },
      { path: "/book/:id", element: <BookDetailsPage /> },
    ],
  },
]);

export default router;
