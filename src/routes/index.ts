import App from "@/App";
import LoginPage from "@/components/pages/auth/login/page";
import RegistrationPage from "@/components/pages/auth/registration/page";
import NotFoundPage from "@/components/pages/NotFound";
import { createBrowserRouter } from "react-router";

export const appRouter = createBrowserRouter( [
  {
    path: "/",
    Component: App,
  },
  {
    path: "*",
    Component: NotFoundPage
  },
  {
    path: "/login",
    Component: LoginPage
  },
  {
    path: "/registration",
    Component: RegistrationPage
  }
] );
