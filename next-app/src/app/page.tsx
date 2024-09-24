import React from 'react';
import {FamilyTree} from "../components/family-tree";
import {Metadata} from "next";
import {Couple, Person} from "../types";

// either Static metadata
export const metadata: Metadata = {
    title: 'Семейное дерево фамилии Инденбом',
}

export const revalidate = 5

export async function generateStaticParams() {
    let props = await getData();

    return props.people
}

async function getData() {
    try {
        const couplesResponse = await fetch('http://147.45.171.210:9081/api/v1/family/couples');
        const peopleResponse = await fetch('http://147.45.171.210:9081/api/v1/family/people');

        if (!couplesResponse.ok || !peopleResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const couplesData = await couplesResponse.json();
        const peopleData = await peopleResponse.json();

        console.log(couplesData);

        return {
            couples: couplesData.data || [],
            people: peopleData.data || [],
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            couples: [],
            people: [],
        };
    }
}

export default async function Page() {
    const {couples, people} = await getData()

    return (
        <FamilyTree couples={couples} people={people}/>
    );
};
