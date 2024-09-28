import type {Metadata} from 'next'

import './globals.css'
import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Tree01Icon} from "hugeicons-react";
import { GeistSans } from 'geist/font/sans';


export const metadata: Metadata = {
    title: 'Семейное дерево фамилии Инденбом',
    description: 'Родословная фамилий Инденбом, Инденбаум, Lindenbaum. Годы жизни, фотографии, место рождения, жены, родители, дети.'
}

export default function RootLayout(
    {
        children
    }: {
        children: React.ReactNode,
    }) {
    return (
        <html lang="en">
        <body className={`${GeistSans.className}  bg-blue-50/50`}>
        <div className="h-full flex flex-col">
            <div className="z-30 bg-white shadow-lg">
                <div className="container mx-auto px-4 h-12 flex items-center">
                    <nav className="flex items-center space-x-4 lg:space-x-6">
                        {/*<Link href="/" className="text-sm font-bold transition-colors hover:text-primary flex">*/}
                        {/*    Дерево*/}
                        {/*</Link>*/}
                        <Button variant="secondary" asChild>
                            <Link href="/"><Tree01Icon className="mr-2 h-4 w-4"/> Дерево </Link>
                        </Button>
                    </nav>
                </div>
            </div>
            <div className="flex-grow">
                {children}
            </div>
            <div className="bg-slate-800 text-slate-400">
                <div className="container mx-auto px-4 py-2 md:py-6 text-center">
                    Сергей Инденбом © {new Date().getFullYear()}
                </div>
            </div>
        </div>
        </body>
        </html>
    )
}
