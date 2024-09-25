import type {Metadata} from 'next'

import './globals.css'
import React from "react";
import {Inter} from "next/font/google";

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

const inter = Inter({ subsets: ['cyrillic', 'latin'] })


export default function RootLayout(
    {
        children,
        modals
    }: {
        children: React.ReactNode,
        modals: React.ReactNode
    }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        {modals}
        </body>
        </html>
    )
}
