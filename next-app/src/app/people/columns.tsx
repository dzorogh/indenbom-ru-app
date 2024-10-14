"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Person} from "@/types";
import FamilyPersonDates from "@/components/family-person-dates";
import {AppLink} from "@/components/app-link";

export const columns: ColumnDef<Person>[] = [
    {
        accessorKey: "full_name",
        header: "ФИО",
        size: 400,
        cell: ({row}) => {
            return <AppLink href={`/people/${row.original.id}`}>
                {row.original.full_name}
            </AppLink>
        },
    },
    {
        accessorKey: "dates",
        header: "Годы жизни",
        size: 200,
        cell: ({row}) => {
            return <FamilyPersonDates person={row.original}/>
        },
    },
    {
        accessorKey: "place_of_birth",
        header: "Место рождения",
        size: 300,
    },
    {
        accessorKey: "father",
        header: "Родители",
        size: 400,
        cell: ({row}) => {
            const parents = [];

            if (row.original.parent_couple?.husband) {
                parents.push(
                    <AppLink key={row.original.parent_couple.husband.id} href={`/people/${row.original.parent_couple.husband.id}`}>
                        {row.original.parent_couple.husband.full_name}
                    </AppLink>
                )
            }

            if (row.original.parent_couple?.wife) {
                parents.push(
                    <AppLink key={row.original.parent_couple.wife.id} href={`/people/${row.original.parent_couple.wife.id}`}>
                        {row.original.parent_couple.wife.full_name}
                    </AppLink>
                )
            }

            const parentsJoined = parents.length ? parents.reduce((prev, curr) => [prev, ' и ', curr]) : ""

            return (
                parentsJoined
            )
        },
    },
]
