import {Person} from "@/types";
import {DataTable} from "@/app/list/data-table";
import {columns} from "@/app/list/columns";

async function getData(): Promise<Person[]> {
    const peopleResponse = await fetch('https://admin.indenbom.ru/api/v1/family/people');
    const peopleData = await peopleResponse.json();

    return peopleData.data as Person[]
}

export default async function ListPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10 flex">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
