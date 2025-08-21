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
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { renderMenuItem, renderMobileMenuItem } from "../ui/NavComponents";

const Navbar = ( ) =>
{
  const { data } = useUserDataQuery();
  const [ logout ] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  console.log( data )
  
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
    <section className="p-4 w-full">
      <div className="">
        {/* Desktop Menu */}
        <nav className="hidden justify-between md:flex  w-full">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <a href={navItemLinks.logo.url} className="flex items-center gap-2">
              <img
                src={navItemLinks.logo.src}
                className="max-h-8 dark:invert"
                alt={navItemLinks.logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {navItemLinks.logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {roleBasedMenu.map( ( item ) => renderMenuItem( item ) )}
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
                  <Button asChild variant="outline" size="sm">
                    <Link to={auth?.login?.url}>{auth?.login?.title}</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-chart-5 text-sky-900 hover:text-white">
                    <Link to={auth?.signup?.url}>{auth?.signup?.title}</Link>
                  </Button>
                </>
              )
            }
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block md:hidden">
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
                    {menu.map( ( item ) => renderMobileMenuItem( item ) )}
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
                          <Button asChild variant="outline" size="sm">
                            <Link to={auth?.login?.url}>{auth?.login?.title}</Link>
                          </Button>
                          <Button asChild size="sm" className="bg-chart-5 text-sky-900 hover:text-white">
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
