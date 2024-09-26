import type {Metadata} from 'next'

import './globals.css'
import React from "react";
import {IBM_Plex_Sans} from "next/font/google";

export const metadata: Metadata = {
    title: 'Семейное дерево фамилии Инденбом',
    description: 'Родословная фамилий Инденбом, Инденбаум. Годы жизни, фотографии, место рождения, жены, родители, дети.'
}

const font = IBM_Plex_Sans({ subsets: ['cyrillic', 'latin'], weight: "400" })


export default function RootLayout(
    {
        children
    }: {
        children: React.ReactNode,
        modals: React.ReactNode
    }) {
    return (
        <html lang="en">
        <body className={`${font.className}  bg-blue-50/50`}>
        {children}
        </body>
        </html>
    )
}
