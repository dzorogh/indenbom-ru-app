import {Metadata, ResolvingMetadata} from "next";
import {notFound} from "next/navigation";
import {FamilyTree} from "@/components/family-tree";
import React from "react";
import {joinUrl} from "@/lib/utils";
import {Couple, Person} from "@/types";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

// export async function generateMetadata(
//     {params, searchParams}: Props,
//     parent: ResolvingMetadata
// ): Promise<Metadata> {
//     // read route params
//     const id = params.id
//
//     // fetch data
//     const person = await getData(id)
//
//     // optionally access and extend (rather than replace) parent metadata
//     //const previousImages = (await parent).openGraph?.images || []
//
//     return {
//         title: person.full_name + " - " + (await parent).title.absolute,
//         description: `${person.full_name} — биография, годы жизни, родственники, фотографии, контакты, ссылки`
//     }
// }

export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id

    // fetch data
    const {people} = await getData(id)
    const person = people.find(p => p.id === Number(id))

    // optionally access and extend (rather than replace) parent metadata
    //const previousImages = (await parent).openGraph?.images || []

    return {
        title: person.full_name + " на семейном дереве - " + (await parent).title.absolute,
        description: `${person.full_name} — семейное дерево, родители, жены, мужья, дети, братья и сестры`
    }
}

async function getData(id: string) {
    const url = joinUrl(process.env.API_URL, '/family/people/tree');

    url.searchParams.set('root_person_id', id);

    const treeResponse = await fetch(url);

    const treeData = await treeResponse.json();

    return {
        couples: treeData.data.couples as Couple[],
        people: treeData.data.people as Person[],
    };
}

export const revalidate = 15

export async function generateStaticParams() {
    const peopleResponse = await fetch(process.env.API_URL + '/family/people/');
    const people = (await peopleResponse.json())['data'];

    return people.map(({id}) => ({
        id: String(id)
    }))
}

export default async function Page({params}: Props) {
    const {couples, people} = await getData(params.id)

    const rootPerson = people.find(p => p.id === Number(params.id))

    return (
        <>
            <div className="p-2 px-4">
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
                            <BreadcrumbLink href={`/people/${rootPerson.id}`}>{rootPerson.full_name}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Семейное дерево</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <FamilyTree couples={couples} people={people} rootPersonId={Number(params.id)}/>
        </>
    )
}
