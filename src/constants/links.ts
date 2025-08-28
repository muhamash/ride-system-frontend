/* eslint-disable @typescript-eslint/no-unused-vars */
import { lazy } from "react";

const RequestRidePage = lazy( () => import( "@/components/pages/ride/requestRide/page" ) );
const RideInfoPage = lazy( () => import( "@/components/pages/ride/rideInfo/page" ) );
const CheckRideRequestPage = lazy( () => import( "@/components/pages/ride/checkRideRequest/page" ) );
const CheckRideStatus = lazy( () => import( "@/components/pages/ride/checkRides/page" ) );
const VehicleInfoPage = lazy( () => import( "@/components/pages/user/vehicleInfo/page" ) );
const UserInfo = lazy( () => import( "@/components/pages/user/userInfo/page" ) );
const UpdateUserPage = lazy( () => import( "@/components/pages/user/updateUser/page" ) );
const ControlUserPage = lazy( () => import( "@/components/pages/user/manageAccessUser/page.tsx" ) ); 
const SeeRidesPage = lazy( () => import( "@/components/pages/ride/checkRides/page" ) );


export const navItemLinks = {
  logo: {
    url: "/",
    src: "/ride.ico",
    alt: "logo",
    title: "Let's Ride",
  },
  menu: [
    {
      title: "Ride",
      url: "/ride",
      roles: ["RIDER", "ADMIN", "DRIVER"],
      items: [
        {
          title: "Go for a ride",
          description: "Request a new ride",
          url: "/ride/request-ride",
          roles: [ "RIDER", "ADMIN" ],
          Component: RequestRidePage
        },
        // {
        //   title: "See ride info",
        //   description: "Check your ride info",
        //   url: "/ride/ride-info/:id",
        //   roles: [ "RIDER", "DRIVER", "ADMIN" ],
        //   Component: RideInfoPage
        // },
        {
          title: "See rides",
          description: "Check your ride info",
          url: "/ride/ride-info",
          roles: [ "RIDER", "DRIVER", "ADMIN" ],
          Component: SeeRidesPage
        },
        {
          title: "Check requested ride",
          description: "Check your requested ride status",
          url: "/ride/check-ride-request",
          roles: [ "DRIVER" ],
          Component: CheckRideRequestPage
        },
        // {
        //   title: "See ride status",
        //   description: "Check your ride status",
        //   url: "/ride/ride-status",
        //   roles: [ "ADMIN" ],
        //   Component: CheckRideStatus
        // },
      ],
    },
    {
      title: "User panel",
      url: "/user",
      roles: ["RIDER", "ADMIN", "DRIVER"],
      items: [
        {
          title: "User info",
          description: "Profile and settings",
          url: "/user/info",
          roles: [ "RIDER", "ADMIN", "DRIVER" ],
          Component: UserInfo
          
        },
        {
          title: "Driver stats",
          description: "Driver stats and details",
          url: "/user/driver-stats",
          roles: [ "DRIVER" ],
          Component: VehicleInfoPage
        },
        // {
        //   title: "Update user",
        //   description: "Manage user accounts",
        //   url: "/user/update",
        //   roles: [ "ADMIN" ],
        //   Component: UpdateUserPage
        // },
        {
          title: "Control user",
          description: "Manage user access",
          url: "/user/manage-access",
          roles: [ "ADMIN" ],
          Component: ControlUserPage
        },
      ],
    },
    {
      title: "About",
      url: "/about",
      roles: ["PUBLIC", "RIDER", "DRIVER", "ADMIN"],
    },
    {
      title: "FAQ",
      url: "/faq",
      roles: [ "PUBLIC", "RIDER", "DRIVER", "ADMIN" ],
    },
    {
      title: "Features",
      url: "/test-features",
      roles: [ "PUBLIC", "RIDER", "DRIVER", "ADMIN" ],
    },
    {
      title: "Contact",
      url: "/wrong-contact-information",
      roles: [ "PUBLIC", "RIDER", "DRIVER", "ADMIN" ],
    },
  ],
  auth: {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/registration" },
  },
};
