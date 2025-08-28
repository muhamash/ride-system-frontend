import AboutPage from "@/components/pages/About";
import AccountStatusPage from "@/components/pages/AcoountStatPage";
import LoginPage from "@/components/pages/auth/login/page";
import RegistrationPage from "@/components/pages/auth/registration/page";
import ContactPage from "@/components/pages/ContactPage";
import FAQPage from "@/components/pages/FaqPage";
import FeaturesPage from "@/components/pages/FeaturesPage";
import Home from "@/components/pages/home/page";
import NotFoundPage from "@/components/pages/NotFound";
import RideInfoPage from "@/components/pages/ride/rideInfo/page";
import UnAuthPage from "@/components/pages/UnAuthPage";
import { navItemLinks } from "@/constants/links";
import { UserRole } from "@/constants/userRole";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const App = lazy( () => import( "@/App" ) );

const dynamicRoutes =  generateRoutes( navItemLinks );

export const appRouter = createBrowserRouter( [
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
        
      },
      ...dynamicRoutes,
      {
        path: "/ride/ride-info/:id",
        Component: withAuth(RideInfoPage, [UserRole.DRIVER, UserRole.ADMIN, UserRole.RIDER]),
      },
      {
        path: '/about',
        Component: AboutPage
      },
      {
        path: '/faq',
        Component: FAQPage
      },
      {
        path: '/test-features',
        Component: FeaturesPage
      },
      {
        path: '/wrong-contact-information',
        Component: ContactPage
      },
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
  },
  {
    path: "/account-status-page/:id",
    Component: AccountStatusPage
  },
  {
    path: "/unauthorized",
    Component: UnAuthPage,
  }
] );
