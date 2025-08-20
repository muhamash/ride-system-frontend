import App from "@/App";
import { createBrowserRouter } from "react-router";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    Component: App, 
  },
]);
