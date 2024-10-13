import {Person} from "@/types";
import {DataTable} from "@/app/people/data-table";
import {columns} from "@/app/people/columns";

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
        <div className="container justify-center items-center mx-auto py-10 flex">
            <DataTable columns={columns} />
        </div>
    )
}
