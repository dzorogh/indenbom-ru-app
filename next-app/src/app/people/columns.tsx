"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Person} from "@/types";
import FamilyPersonDates from "@/components/family-person-dates";
import {AppLink} from "@/components/app-link";

export const columns: ColumnDef<Person>[] = [
    {
        accessorKey: "full_name",
        header: "ФИО",
        size: 400,
        cell: ({ row }) => {
            return <AppLink href={`/people/${row.original.id}`}>
                {row.original.full_name}
            </AppLink>
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
