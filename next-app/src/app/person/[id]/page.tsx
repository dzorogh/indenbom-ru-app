import {Person} from "@/types";
import {notFound} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FamilyPersonDates from "@/components/family-person-dates";
import React from "react";
import FamilyPersonContactIcon from "@/components/family-person-contact-icon";
import {FamilyPersonGallery} from "@/components/family-person-gallery";
import {Metadata, ResolvingMetadata} from "next";
import {Article} from "@/components/article";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {SmileIcon} from "hugeicons-react";
import {FamilyPersonHeadingBadge} from "@/components/family-person-heading-badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
        title: person.full_name,
    }
}

async function getData(id: string) {
    try {
        const personResponse = await fetch('https://admin.indenbom.ru/api/v1/family/people/' + id);

        if (!personResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        return (await personResponse.json())['data'];
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export default async function Page({params}: { params: { id: number } }) {
    const person = await getData(String(params.id)) as Person;

    if (!person) {
        return notFound()
    }

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="py-6 md:py-12 flex flex-col gap-6 md:gap-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Дерево</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{person.full_name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="shadow-lg rounded-md overflow-hidden bg-white pb-12">
                        <div className="relative h-48 bg-gradient-to-r rounded-t-sm from-stone-100 to-stone-200 m-0.5">
                            <Image
                                src="https://live.staticflickr.com/65535/53590278329_9620f94c83_k.jpg"
                                fill={true}
                                priority={true}
                                sizes="(max-width: 768px) 100vw, (max-width: 1600px) 2000px, 100vw"
                                className="object-cover rounded-t-sm"
                                alt="Фон с липой">
                            </Image>

                            <div
                                className="flex flex-col md:flex-row justify-center items-center md:justify-start absolute -bottom-[125px] px-8 w-full">
                                {person.avatar_url ?
                                    <Image
                                        priority={true}
                                        src={person.avatar_url}
                                        width={250}
                                        height={250}
                                        className="rounded-full border-[10px] border-white"
                                        alt={person.full_name}
                                    />
                                    :
                                    <div
                                        className="w-[250px] h-[250px] rounded-full bg-slate-50 flex items-center justify-center">
                                        <SmileIcon size={50} className="opacity-20"/>
                                    </div>
                                }

                                <div className="flex flex-wrap justify-center items-center md:ml-10 gap-2 md:gap-4">
                                    {person.contacts?.length ?
                                        <FamilyPersonHeadingBadge>Контакты и ссылки</FamilyPersonHeadingBadge>
                                        : ""
                                    }
                                    {person.article ?
                                        <FamilyPersonHeadingBadge>Биография</FamilyPersonHeadingBadge>
                                        : ""
                                    }
                                    {person.photos?.length ?
                                        <FamilyPersonHeadingBadge>Фотографии</FamilyPersonHeadingBadge>
                                        : ""
                                    }
                                </div>
                            </div>

                        </div>

                        <div className="z-20 relative md:ml-80 mx-6 md:mt-8 mt-40  min-h-48 flex flex-col gap-8">
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

                            <div className="flex gap-4">
                                {person.contacts?.map(contact => {
                                    return (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link key={contact.id} target="_blank" href={contact.value}
                                                          className="text-3xl text-slate-600 transition-colors hover:text-primary">
                                                        <FamilyPersonContactIcon type={contact.type} size={40}/>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{new URL(contact.value).host}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                    )
                                })}
                            </div>

                            <div>
                                <Article content={person.article}/>
                            </div>
                        </div>
                    </div>

                    {person.photos && person.photos.length ?
                        <div>
                            <h2 className="scroll-m-20 mb-3 text-xl font-semibold tracking-tight first:mt-0">
                                Фотографии
                            </h2>
                            <FamilyPersonGallery photos={person.photos}/>
                        </div>
                        : ""
                    }
                </div>
            </div>
        </>
    )
}
