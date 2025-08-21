import LoginPage from "@/components/pages/auth/login/page";
import RegistrationPage from "@/components/pages/auth/registration/page";
import Home from "@/components/pages/home/page";
import NotFoundPage from "@/components/pages/NotFound";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const App = lazy( () => import( "@/App" ) );

export const appRouter = createBrowserRouter( [
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
        
      }
    ]
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
