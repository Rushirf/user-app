"use client"

import * as React from "react"
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    ColumnDef,
} from "@tanstack/react-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaRegTrashCan } from "react-icons/fa6"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"

import { Button } from "@/components/ui/button"

import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import Link from "next/link"



import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Input } from "../ui/input"
import { deleteUserApi, getUsersApi } from "@/app/users/action"
import { User } from "../../../types/types"
import { showToast } from "@/lib/toast"

// import Loader from "../common/Loader"

export function UserTable() {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [pageSize, setPageSize] = useState(5)
    const [finalSearchTerm, setFinalSearchTerm] = useState("")
    const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null)
    const queryClient = useQueryClient();
    const [searchBy, setSearchBy] = useState<"name" | "email">("name")
    const [searchValue, setSearchValue] = useState("")
    const [page, setPage] = useState(1);
    const {
        data: usersdata,
        isLoading,

        error,
    } = useQuery({
        queryKey: ["getUsersApi", page, pageSize, finalSearchTerm],
        queryFn: () => getUsersApi({
            page, limit:
                pageSize,
            search: finalSearchTerm,
        }),
        enabled: true,
    });
    console.log(usersdata);

    const pagination = usersdata;
    const totalPages = pagination?.totalPages ?? 1;
    const currentPage = pagination?.page ?? 1;
    const totalPlans = pagination?.total ?? 0;

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchValue.length === 0 || searchValue.length >= 3) {
                setFinalSearchTerm(searchValue)
            }
        }, 300) // debounce 300ms

        return () => clearTimeout(delay)
    }, [searchValue])
    const handleSearch = (value: string) => {
        setSearchValue(value)
        table.getColumn(searchBy)?.setFilterValue(value)
    }

    const handleSearchByChange = (value: "name" | "email") => {
        table.getColumn(searchBy)?.setFilterValue("")
        setSearchBy(value)
        if (searchValue) {
            table.getColumn(value)?.setFilterValue(searchValue)
        }
    }
    const deleteUserMutation = useMutation({
        mutationFn: async () => {
            if (!selectedUserForDelete?._id) throw new Error("user ID is missing.");
            return deleteUserApi(selectedUserForDelete._id);
        },
        onSuccess: (res) => {
            setSelectedUserForDelete(null);
            if (res.success) {
                showToast({
                    tone: "success",
                    variant: "solid",
                    children: (
                        <>
                            <div className="font-medium text-base">User deleted</div>
                            <div className="text-sm opacity-80">Title: {selectedUserForDelete?.name}</div>
                        </>
                    ),
                });
                queryClient.invalidateQueries({
                    queryKey: ["getUsersApi"],
                });

            } else {
                showToast({
                    tone: "error",
                    variant: "solid",
                    children: <p className="font-medium">{res.message}</p>,
                });

            }
        },

    });

    const deleteUserPlan = () => {
        deleteUserMutation.mutate();
    };
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="px-0 uppercase font-bold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4 text-brand-500" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4 text-brand-500" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={`/users/userDetail/${row.original._id}`}
                    className=" font-semibold text-base hover:underline"
                >
                    {row.original.name}
                </Link>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone",
        },
        {
            accessorKey: "gender",
            header: () => <div className="text-center w-full">Gender</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original?.gender}
                </div>
            ),
        },
        {
            accessorKey: "age",
            header: "AGE",
        },
        {
            accessorKey: "city",
            header: "City",
        },

        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const user = row.original
                const isDeleting = selectedUserForDelete?._id === user._id
                return (
                    <div className="text-center">
                        <Button
                            size="icon"
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => {
                                setSelectedUserForDelete(user)
                                deleteUserPlan()
                            }}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : <FaRegTrashCan />}


                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: usersdata?.users || [],
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,        // ✅ tells table to not paginate automatically
        pageCount: totalPages,
    })

    React.useEffect(() => {
        table.setPageSize(pageSize)
    }, [pageSize, table])

    return (
        <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between gap-4 items-center">

                <div className="flex items-center gap-2">

                    <Input
                        placeholder={`Search by ${searchBy}...`}
                        value={searchValue ?? ""}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-md h-12"
                    />
                </div>
            </div>

            <div className="rounded-md border dark:border-gray-500 overflow-hidden">
                {isLoading ? (
                    <div className="flex w-full items-center justify-center py-10">
                        Loading...
                        {/* <Loader /> */}
                    </div>
                ) : error ? (
                    <div className="flex w-full items-center justify-center py-10">
                        <p className="text-2xl text-gray-400">No users found</p>
                    </div>
                ) : usersdata?.users && usersdata?.users?.length > 0 ?
                    (
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((group) => (
                                    <TableRow key={group.id}>
                                        {group.headers.map((header) => (
                                            <TableHead key={header.id} className="font-bold uppercase bg-brand-25 dark:bg-gray-800">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="text-center py-10">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex w-full items-center justify-center py-10">
                            <p className="text-xl text-gray-400">No Users found.</p>
                        </div>
                    )}

            </div>
            <div className="flex justify-center sm:justify-between items-center flex-wrap gap-2">
                <div className="text-base text-muted-foreground">
                    Page <span className="font-bold text-brand-400"> {currentPage} </span> of {totalPages} | Total: {totalPlans}
                </div>
                <div className="flex items-center gap-2 flex-wrap mx-auto sm:mx-0 justify-center ">
                    <Select
                        value={String(pageSize)}
                        onValueChange={(val) => {
                            setPageSize(Number(val))
                            setPage(1)
                        }}>
                        <SelectTrigger className="w-24 h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 15].map((size) => (
                                <SelectItem key={size} value={String(size)}>{size}  rows</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    ><ChevronLeft className="w-4 h-4" />Previous</Button>
                    <Button
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >Next<ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>

        </div>
    )
}
