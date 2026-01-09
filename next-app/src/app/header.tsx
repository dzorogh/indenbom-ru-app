'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/icons/logo";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator";

export default function Header() {
    const path = usePathname();

    return (
        <div className="z-30 bg-white shadow-lg">
            <div className="container mx-auto h-12 flex items-center md:justify-center overflow-auto">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                                <Logo className="mr-2 h-6 w-6" />
                                INDENBOM
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/people" className={navigationMenuTriggerStyle()}>
                                Все люди
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className='self-stretch'>
                            <Separator orientation="vertical" />
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/people/1/tree" className={navigationMenuTriggerStyle()}>
                                Л. А. Инденбом
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/people/31/tree" className={navigationMenuTriggerStyle()}>
                                С. С. Яровой
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
}
