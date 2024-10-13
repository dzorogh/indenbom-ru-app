'use client'

import Link from "next/link";
import {usePathname} from "next/navigation";
import Logo from "@/components/icons/logo";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {navigationMenuTriggerStyle} from "@/components/ui/navigation-menu"
import {Separator} from "@/components/ui/separator";

export default function Header() {
    const path = usePathname();

    return (
        <div className="z-30 bg-white shadow-lg">
            <div className="container mx-auto h-12 flex items-center md:justify-center overflow-auto">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Logo className="mr-2 h-6 w-6"/>
                                    INDENBOM
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/people" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Все люди
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className='self-stretch'>
                            <Separator orientation="vertical"/>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/people/1/tree" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Л. А. Инденбом
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/people/31/tree" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    С. С. Яровой
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}
