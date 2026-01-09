import {Person} from "@/types";
import {DataTable} from "@/app/people/data-table";
import {columns} from "@/app/people/columns";
import {PageTitle} from "@/components/page-title";
import React from "react";

// export const revalidate = 5
//
// async function getData(): Promise<Person[]> {
//     const peopleResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/family/people');
//     const peopleData = await peopleResponse.json();
//
//     return peopleData.data as Person[]
// }

export default async function ListPage() {
    // const data = await getData()

    return (
        <div className="container mx-auto px-4 justify-center items-center py-10 overflow-hidden">
            <PageTitle>Список людей</PageTitle>
            <DataTable columns={columns} />
        </div>
    )
}
