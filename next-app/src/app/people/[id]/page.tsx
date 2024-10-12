import {Person} from "@/types";
import {notFound} from "next/navigation";
import FamilyPersonDates from "@/components/family-person-dates";
import React from "react";
import {FamilyPersonGallery} from "@/components/family-person-gallery";
import {Metadata, ResolvingMetadata} from "next";
import {Article} from "@/components/article";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {PersonHeading} from "@/app/people/[id]/person-heading";
import {PersonLinks} from "@/app/people/[id]/person-links";
import {PersonRelatives} from "@/app/people/[id]/person-relatives";
import {buttonVariants} from "@/components/ui/button";
import {Structure03Icon} from "hugeicons-react";
import Link from "next/link";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id

    // fetch data
    const person = await getData(id)

    // optionally access and extend (rather than replace) parent metadata
    //const previousImages = (await parent).openGraph?.images || []

    return {
        title: person.full_name + " - " + (await parent).title.absolute,
        description: `${person.full_name} — биография, годы жизни, родственники, фотографии, контакты, ссылки`
    }
}

async function getData(id: string) {
    try {
        const personResponse = await fetch(process.env.API_URL + '/family/people/' + id);

        if (!personResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        return (await personResponse.json())['data'];
    } catch (error) {
        return notFound()
    }
}

export const revalidate = 15

export async function generateStaticParams() {
    const peopleResponse = await fetch(process.env.API_URL + '/family/people/');
    const people = (await peopleResponse.json())['data'];

    return people.map(({id}) => ({
        id: String(id)
    }))
}

export default async function Page({params}: { params: { id: number } }) {
    const person = await getData(String(params.id)) as Person;

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="py-6 md:py-12 flex flex-col gap-6 md:gap-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/people">Список</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{person.full_name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="shadow-lg rounded-md overflow-hidden bg-white pb-12">
                        <PersonHeading person={person}/>

                        <div className="z-20 relative md:ml-80 mx-6 md:mt-10 mt-40 min-h-48 flex flex-col gap-8">
                            <h1 className="text-3xl md:text-5xl text-center md:text-left font-bold">
                                {person.full_name}
                            </h1>

                            <div className="flex gap-x-16 gap-y-6">
                                <div>
                                    <h3 className="scroll-m-20 font-semibold tracking-tight">Место рождения</h3>
                                    <div>
                                        {person.place_of_birth ?? "Неизвестно"}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="scroll-m-20 font-semibold tracking-tight">Годы</h3>
                                    <div>
                                        <FamilyPersonDates person={person}/>
                                    </div>
                                </div>
                            </div>

                            <PersonLinks person={person}/>

                            <PersonRelatives person={person}/>

                            <div>
                                <Link href={`/people/${person.id}/tree`} className={buttonVariants({ variant: "default", size: 'lg' }) + ' gap-2'}>
                                    <Structure03Icon />
                                    Семейное дерево
                                </Link>
                            </div>

                            {person.article ?
                                <div className="border-t border-slate-200 pt-8">
                                    <Article content={person.article}/>
                                </div>
                                : <div className="text-muted-foreground">Биографии нет</div>
                            }
                        </div>
                    </div>

                    <div>
                        <h2 className="scroll-m-20 mb-3 text-xl font-semibold tracking-tight first:mt-0">
                            Фотографии
                        </h2>

                        {person.photos && person.photos.length ?
                            <FamilyPersonGallery photos={person.photos}/>
                            : <div className="text-muted-foreground">Фотографий нет</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
