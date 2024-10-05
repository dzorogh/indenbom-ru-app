"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Person} from "@/types";
import Link from "next/link";
import FamilyPersonDates from "@/components/family-person-dates";

export const columns: ColumnDef<Person>[] = [
    {
        accessorKey: "id",
        header: "#",
        size: 50
    },
    {
        accessorKey: "full_name",
        header: "ФИО",
        size: 400,
        cell: ({ row }) => {
            const fullName = row.getValue("full_name") as string;
            const id = row.getValue("id") as number;

            return <Link href={`/people/${id}`}>
                {fullName}
            </Link>
        },
    },
    {
        accessorKey: "dates",
        header: "Годы жизни",
        size: 200,
        cell: ({ row }) => {
            return <FamilyPersonDates person={row.original} />
        },
    },
]
