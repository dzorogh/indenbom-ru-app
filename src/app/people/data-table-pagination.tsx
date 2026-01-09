import {Table} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {ArrowLeftDoubleIcon, ArrowRightDoubleIcon} from "hugeicons-react";
import {ArrowLeftIcon, ArrowRightIcon} from "lucide-react";

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>(
    {
        table,
    }: DataTablePaginationProps<TData>
) {
    return (
        <div className="flex items-center gap-x-6 lg:gap-x-8 ">
            <div className="flex items-center gap-x-2 flex-wrap">
                <p className="text-sm font-medium">Записей на странице</p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="h-8 w-16">
                        <SelectValue placeholder={table.getState().pagination.pageSize}/>
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-[100px] grow items-center justify-center text-sm font-medium">
                Страница {table.getState().pagination.pageIndex + 1} из {" "}
                {table.getPageCount()}
            </div>
            <div className="flex items-center gap-x-2">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">На первую страницу</span>
                    <ArrowLeftDoubleIcon className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <span className="sr-only">На предыдущую страницу</span>
                    <ArrowLeftIcon className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">На следующую страницу</span>
                    <ArrowRightIcon className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <span className="sr-only">На последнюю страницу</span>
                    <ArrowRightDoubleIcon className="h-4 w-4"/>
                </Button>
            </div>
        </div>

    )
}
