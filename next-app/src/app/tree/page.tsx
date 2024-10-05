import React from 'react';
import {FamilyTree} from "@/components/family-tree";
import {Couple, Family, Person} from "@/types";

export const revalidate = 5

export async function generateStaticParams() {
    let props = await getData();

    return props.people
}

async function getData() {
    const [couplesResponse, peopleResponse] = await Promise.all([
        await fetch(process.env.API_URL + '/family/couples'),
        await fetch(process.env.API_URL + '/family/people')
    ])

    const couplesData = await couplesResponse.json();
    const peopleData = await peopleResponse.json();

    return {
        couples: couplesData.data as Couple[],
        people: peopleData.data as Person[],
    };
}

export default async function Page() {
    const {couples, people} = await getData()

    return (
        <FamilyTree couples={couples} people={people}/>
    );
};
