import {Person} from "@/types";
import {DataTable} from "@/app/people/data-table";
import {columns} from "@/app/people/columns";

async function getData(): Promise<Person[]> {
    console.log(process.env.API_URL)
    const peopleResponse = await fetch(process.env.API_URL + '/family/people');
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
