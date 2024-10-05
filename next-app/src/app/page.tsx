import React from 'react';
import {Family} from "@/types";
import {Article} from "@/components/article";
import {Metadata, ResolvingMetadata} from "next";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/icons/logo";
import Tree from "@/app/tree/page"

function truncateString(yourString, maxLength) {
    // get the index of space after maxLength
    const index = yourString.indexOf(" ", maxLength);
    return index === -1 ? yourString : yourString.substring(0, index)
}

export async function generateMetadata(): Promise<Metadata> {
    const family = await getData()

    return {
        title: 'История фамилии Инденбом',
        description: truncateString(family.description, 148)
    }
}

async function getData() {
    const familyResponse = await fetch('https://admin.indenbom.ru/api/v1/family/families/' + process.env.FAMILY_SLUG)

    const familyData = await familyResponse.json();

    return familyData.data as Family;
}

export default async function Page() {
    const family = await getData()

    return (
        <>
            <div className="container mx-auto px-4 py-6 lg:py-12 flex items-center flex-col">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">История фамилии Инденбом</h1>
                <Article content={family.description}/>
            </div>

            <div className="bg-white justify-center md:h-[40svh] relative">
                <div className="h-full w-full blur-sm">
                    <Tree/>
                </div>
                <Link href="/tree" className="flex items-center justify-center absolute inset-0">
                    <Button variant="default" size="2xl">
                        <>
                            Интерактивное семейное дерево
                        </>
                    </Button>
                </Link>
            </div>
        </>
    );
};
