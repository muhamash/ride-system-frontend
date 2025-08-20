import App from "@/App";
import NotFoundPage from "@/components/pages/NotFound";
import { createBrowserRouter } from "react-router";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    Component: App, 
  },
  {
    path: "*",
    Component: NotFoundPage
  }
]);
