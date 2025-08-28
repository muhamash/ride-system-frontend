// import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import
  {
    Accordion
  } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import
  {
    NavigationMenu,
    NavigationMenuList
  } from "@/components/ui/navigation-menu";
import
  {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { navItemLinks } from "@/constants/links";
import { authApi, useLogoutMutation, useUserDataQuery } from "@/redux/features/api/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { CarTaxiFront, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { renderMenuItem, renderMobileMenuItem } from "../ui/NavComponents";

const Navbar = ( ) =>
{
  const { data } = useUserDataQuery();
  const [ logout ] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log( location );

  // console.log( data )
  
  const userRole = data?.data?.role || "PUBLIC";

  const filterMenuByRole = ( menu, role ) =>
    menu.filter( ( item ) => item.roles?.includes( role ) )
      .map( ( item ) => ( {
        ...item,
        items: item.items
          ? item.items.filter( ( sub ) => sub.roles?.includes( role ) )
          : undefined,
      } ) );

  const { auth, menu, logo } = navItemLinks;
  const roleBasedMenu = filterMenuByRole( menu, userRole );
  // console.log(auth?.login?.url)

  const handleLogout = async() =>
  {
    const res = await logout(undefined);
    console.log( "logout", res );
    
    dispatch( authApi.util.resetApiState() );
    navigate("/login")
  }

  return (
    <section className="fixed top-0 left-0 w-full p-4 bg-gradient-to-r from-gray-100/90 to-gray-100/30 backdrop-blur-md border border-gray-500/20 shadow-lg z-50">
      <div className="">
        {/* Desktop Menu */}
        <nav className="hidden md:hidden justify-between lg:flex w-full">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to={navItemLinks.logo.url} className="flex items-center gap-2">
              <CarTaxiFront className="h-10 w-10 text-teal-600" />
              <span className="text-lg font-semibold tracking-tighter">
                {navItemLinks.logo.title}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {roleBasedMenu.map( ( item ) => renderMenuItem( item, location?.pathname ) )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            {
              data?.data ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-yellow-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <Button>
                    {data?.data?.name} || {data?.data?.role}
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline bg-yellow-50 text-black" size="sm">
                    <Link to={auth?.login?.url}>{auth?.login?.title}</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-yellow-500 text-white">
                    <Link to={auth?.signup?.url}>{auth?.signup?.title}</Link>
                  </Button>
                </>
              )
            }
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {roleBasedMenu.map( ( item ) => renderMobileMenuItem( item, location?.pathname ) )}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {
                      data?.data ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm text-muted-foreground"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                          <Button>
                            {data?.data?.name} || {data?.data?.role}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="text-black bg-yellow-50" asChild variant="outline" size="sm">
                            <Link to={auth?.login?.url}>{auth?.login?.title}</Link>
                          </Button>
                          <Button asChild size="sm" className="text-white bg-yellow-500">
                            <Link to={auth?.signup?.url}>{auth?.signup?.title}</Link>
                          </Button>
                        </>
                      )
                    }
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
