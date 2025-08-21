export const navItemLinks = {
  logo: {
    url: "/",
    src: "/ride.ico",
    alt: "logo",
    title: "Let's Ride",
  },
  menu: [
    { title: "Home", url: "/", roles: ["PUBLIC", "RIDER", "DRIVER", "ADMIN"] },
    {
      title: "Ride",
      url: "/ride",
      roles: ["RIDER", "ADMIN"],
      items: [
        {
          title: "Go for a ride",
          description: "Request a new ride",
          url: "/ride/request-ride",
          roles: ["RIDER"],
        },
        {
          title: "See ride info",
          description: "Check your ride status",
          url: "/ride/ride-info",
          roles: ["RIDER", "DRIVER"],
        },
      ],
    },
    {
      title: "User panel",
      url: "/user",
      roles: ["RIDER", "ADMIN"],
      items: [
        {
          title: "User info",
          description: "Profile and settings",
          url: "/user/info",
          roles: ["RIDER"],
        },
        {
          title: "Update user",
          description: "Manage user accounts",
          url: "/user/update",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      title: "About",
      url: "/about",
      roles: ["PUBLIC", "RIDER", "DRIVER", "ADMIN"],
    },
  ],
  auth: {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/registration" },
  },
};
