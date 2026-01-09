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
                            <Link href="/">
                                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                                }
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Logo className="mr-2 h-6 w-6"/>
                                    INDENBOM
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/people">
                                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                                }
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Все люди
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className='self-stretch'>
                            <Separator orientation="vertical"/>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/people/1/tree">
                                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                                }
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Л. А. Инденбом
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/people/31/tree">
                                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                                }
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    С. С. Яровой
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    );
}
