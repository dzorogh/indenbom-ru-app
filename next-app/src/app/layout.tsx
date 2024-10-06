import type {Metadata} from 'next'

import './globals.css'
import React from "react";
import {GeistSans} from 'geist/font/sans';
import Header from "@/app/header";
import Footer from "@/app/footer";
import NextTopLoader from "nextjs-toploader";

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
        <NextTopLoader color="hsl(var(--primary))" />

        <div className="h-full flex flex-col">
            <Header/>
            <div className="flex-grow">
                {children}
            </div>
            <Footer/>
        </div>
        </body>
        </html>
    )
}
