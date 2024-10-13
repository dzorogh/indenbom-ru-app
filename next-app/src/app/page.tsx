import React from 'react';
import {Family} from "@/types";
import {Article} from "@/components/article";
import {Metadata, ResolvingMetadata} from "next";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import TreeImage from "@/app/tree.png";
import Image from "next/image";
import {Structure03Icon} from "hugeicons-react";

function truncateString(yourString: string, maxLength: number) {
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

export const revalidate = 15


async function getData() {
    const familyResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/family/families/' + process.env.FAMILY_SLUG)

    const familyData = await familyResponse.json();

    return familyData.data as Family;
}

export default async function Page() {
    const family = await getData()

    return (
        <>
            <div className="container mx-auto px-4 py-6 lg:py-12 flex items-center flex-col">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">История фамилии Инденбом</h1>
                <Article content={family.description} />
            </div>

            <div className="bg-white justify-center h-[40svh] relative">
                <div className="h-full w-full blur-sm">
                    <Image src={TreeImage} fill={true} alt="Background illustraion of tree" className="object-cover" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-2 ">
                    <Link href="/people/1/tree" className={buttonVariants({ variant: "default", size: '2xl' }) + ' gap-2'}>
                        Лев Инденбом
                    </Link>
                    <Link href="/people/1/tree" className={buttonVariants({ variant: "default", size: '2xl' }) + ' gap-2'}>
                        Станислав Яровой
                    </Link>
                </div>
            </div>
        </>
    );
};
