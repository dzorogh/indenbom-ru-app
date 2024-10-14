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
import {ChangeEvent, useMemo, useState} from "react";
import {Person} from "@/types";
import {joinUrl} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Cancel01Icon, Search01Icon} from "hugeicons-react";
import {Button} from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

async function getData(pagination: PaginationState, search: string, signal: AbortSignal): Promise<{
    data: Person[];
    meta: { current_page: number; from: number; last_page: number; per_page: number; to: number; total: number }
}> {
    await sleep(200)
    if (!signal?.aborted) {
        const url = joinUrl(process.env.NEXT_PUBLIC_API_URL, `/family/people`);
        url.searchParams.set('page', String(pagination.pageIndex + 1));
        url.searchParams.set('per_page', String(pagination.pageSize));
        url.searchParams.set('query', search ?? '');

        const peopleResponse = await fetch(url, {signal});
        const peopleData = await peopleResponse.json();

        return peopleData;
    }
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
    const [searchTerm, setSearchTerm] = useState("")

    const dataQuery = useQuery({
        queryKey: ['data', pagination, searchTerm],
        queryFn: ({signal}) => getData(pagination, searchTerm, signal),
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
    }

    const handleClear = () => {
        setSearchTerm("")
    }

    return (

        <div className="rounded-md border overflow-hidden bg-white">
            <div className="p-2">
                <div className="relative">
                    <Search01Icon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 pr-10"
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={handleClear}
                        >
                            <Cancel01Icon className="h-4 w-4"/>
                        </Button>
                    )}
                </div>
            </div>
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
            <DataTableContent columns={columns}/>
        </QueryClientProvider>
    )
}
