/* eslint-disable react-refresh/only-export-components */
import
  {
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  } from "@/components/ui/accordion";
import
  {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuTrigger
  } from "@/components/ui/navigation-menu";
import type { MenuItem } from "@/types/layout.types";
import { Link } from "react-router";

const SubMenuLink = ( { item, pathName }: { item: MenuItem, pathName: string } ) =>
{
  // console.log(pathName, item)
  return (
    <Link
      className={`hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors ${pathName === item.url ? " bg-sky-300" : "bg-yellow-200"} w-full my-1`}
      to={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

const renderMobileMenuItem = (item: MenuItem, pathName: string) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0 my-2">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} pathName={pathName} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} to={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const renderMenuItem = ( item: MenuItem, pathName?: string ) =>
{ 
    // console.log(pathName)
    if ( item.items )
    {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="text-popover-foreground">
                    <div className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {item.items.map( ( subItem ) => (
                            <NavigationMenuLink asChild key={subItem.title} className="w-80">
                            <SubMenuLink pathName={ pathName } item={subItem} />
                            </NavigationMenuLink>
                        ) )}
                      
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
                href={item.url}
                className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
                {item.title}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

export { renderMenuItem, renderMobileMenuItem, SubMenuLink };
