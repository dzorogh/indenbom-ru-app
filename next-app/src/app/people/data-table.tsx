"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel, PaginationState,
    useReactTable,
} from "@tanstack/react-table"

import {
    keepPreviousData,
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {DataTablePagination} from "@/app/people/data-table-pagination";
import {useMemo, useState} from "react";
import {Person} from "@/types";
import {joinUrl} from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

async function getData(pagination: PaginationState): Promise<{
    data: Person[],
    meta: {
        current_page: number,
        from: number,
        last_page: number,
        per_page: number,
        to: number,
        total: number
    }
}> {

    console.log('getData', 123);

    const url = joinUrl(process.env.NEXT_PUBLIC_API_URL, `/family/people`);
    url.searchParams.set('page', String(pagination.pageIndex + 1));
    url.searchParams.set('per_page', String(pagination.pageSize));

    console.log('getData', url);

    const peopleResponse = await fetch(url);


    const peopleData = await peopleResponse.json();

    console.log(pagination, peopleData);

    return peopleData;
}

const queryClient = new QueryClient()

function DataTableContent<TData, TValue>(
    {
        columns,
    }: DataTableProps<TData, TValue>
) {

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 30,
    })

    const dataQuery = useQuery({
        queryKey: ['data', pagination],
        queryFn: () => getData(pagination),
        placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
    })

    const defaultData = useMemo(() => [], [])

    const table = useReactTable({
        columns,
        data: dataQuery.data?.data as TData[] ?? defaultData,

        state: {
            pagination,
        },
        rowCount: dataQuery.data?.meta.total,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        debugTable: true,
    })

    return (

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{width: `${header.getSize()}px`}}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {dataQuery.isFetching ? 'Загрузка...' : 'Нет результатов'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="p-4">
                    <DataTablePagination table={table}/>
                </div>
            </div>
    )
}

export function DataTable<TData, TValue>(
    {
        columns,
    }: DataTableProps<TData, TValue>
) {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTableContent columns={columns} />
        </QueryClientProvider>
    )
}
