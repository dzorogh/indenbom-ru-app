'use client'

import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/components/icons/logo";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import {HomeIcon} from "lucide-react";



export default function Header() {
    const pathname = usePathname()

    return (
        <div className="z-30 bg-white shadow-lg">
            <div className="container mx-auto h-12 flex items-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Logo className="mr-2 h-6 w-6" />
                                    INDENBOM
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/tree" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Дерево
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}
