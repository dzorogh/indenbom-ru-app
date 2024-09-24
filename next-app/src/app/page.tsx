import React from 'react';
import {FamilyTree} from "../components/family-tree";
import {getServerSideProps} from "../utils/get-server-side-props";
import {Metadata} from "next";

// either Static metadata
export const metadata: Metadata = {
    title: 'Семейное дерево фамилии Инденбом',
}

export default async function Page() {
    const {couples, people} = await getServerSideProps();

    return (
        <FamilyTree couples={couples} people={people} />
    );
};
