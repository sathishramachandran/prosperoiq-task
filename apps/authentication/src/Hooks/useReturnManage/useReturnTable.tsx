// import ViewButton from "@/components/main_ui/Table/FormActionBtn";
// import { format } from "date-fns";

// import {
//   ColumnDef,
//   getCoreRowModel,
//   getSortedRowModel,
//   RowSelectionState,
//   SortingState,
//   useReactTable,
// } from "@tanstack/react-table";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// import { Dispatch, SetStateAction, useMemo, useState } from "react";

// import MetaAssignAdmin from "@/components/main_ui/Forms/Assign/MetaAssignAdmin";
// import UpdateStatusDropDown from "@/components/main_ui/Table/UpdateStatusDropdown";
// import { tSchool } from "@/types/forms";
// import {
//   useGetAllDynamicMetaForm,
//   useUpdateDynamicMetaFormEnquiry,
// } from "./useDynamicMetaFormsApi";
// import { useUserStore } from "@/store/user";

// type Props = {
//   setMode: (value: string) => void;
//   selectedId: string | undefined;
//   setSelectedId: Dispatch<SetStateAction<string | undefined>>;
// };
// const useDynamicMetaFormsTabel = ({ setMode, setSelectedId }: Props) => {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const user = useUserStore((state) => state.user);
//   const router = useRouter();
//   const pathname = usePathname();
//   const params = useSearchParams();
//   const newParams = new URLSearchParams(params.toString());
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [emptyData, setEmptyData] = useState(Array(10).fill({}));
//   const { mutateAsync } = useUpdateDynamicMetaFormEnquiry();

//   const { data, isLoading, isError, dataUpdatedAt, refetch, isRefetching } =
//     useGetAllDynamicMetaForm(
//       params.get("search") || "",
//       params.get("page") || "1",
//       params.get("limit") || "10",
//       params.get("export_csv") || "false",

//       {
//         status: params.get("status") || "",
//         from: params.get("from") || "",
//         to: params.get("to") || "",
//         form_id: params.get("form_id") || "",
//       },
//     );

//   const handlePage = (page: number) => {
//     newParams.set("page", page.toString());
//     router.push(pathname + `?${newParams.toString()}`);
//   };

//   const handleLimit = (limit: number) => {
//     const totalPages = Math.ceil((data?.meta.total_pages as number) / limit);
//     newParams.set("limit", limit.toString());
//     if (Number(newParams.get("page")) > totalPages) {
//       newParams.set("page", "1");
//     } else {
//       newParams.set(
//         "page",
//         Number(newParams.get("page")) <= totalPages
//           ? (newParams.get("page") as string)
//           : "1",
//       );
//     }
//     router.push(pathname + `?${newParams.toString()}`);
//   };

//   const columns = useMemo<ColumnDef<tSchool, any>[]>(() => {
//     return [
//       // {
//       //   id: "select-col",
//       //   header: ({ table }: any) => (
//       //     <IndeterminateCheckbox
//       //       checked={table.getIsAllRowsSelected()}
//       //       indeterminate={table.getIsSomeRowsSelected()}
//       //       onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
//       //     />
//       //   ),
//       //   cell: ({ row }: any) => (
//       //     <IndeterminateCheckbox
//       //       checked={row.getIsSelected()}
//       //       disabled={!row.getCanSelect()}
//       //       onChange={row.getToggleSelectedHandler()}
//       //     />
//       //   ),
//       //   meta: {
//       //     className: "w-10",
//       //   },
//       // },

//       {
//         header: "Name",
//         accessorKey: "full_name",
//         cell: (info: any) => (
//           <p className="line-clamp-1 overflow-hidden text-ellipsis">
//             {info.getValue()}
//           </p>
//         ),
//       },
//       {
//         header: "Contact",
//         accessorKey: "email",
//         cell: (info: any) => (
//           <div className="">
//             <p className="">{info.getValue()}</p>
//             <p className="text-xs">{info.row.original.phone_number}</p>
//           </div>
//         ),
//       },
//       {
//         header: "Campaign",
//         accessorKey: "campaign_name",
//         cell: (info: any) => (
//           <div className="">
//             <p className="line-clamp-1 overflow-hidden text-ellipsis">
//               {info.getValue()}
//             </p>
//             <p className="mt-1 line-clamp-1 overflow-hidden text-ellipsis text-xs">
//               {info.row.original.campaign_id}
//             </p>
//           </div>
//         ),
//       },
//       {
//         header: "Status",
//         accessorKey: "status",
//         cell: (info: any) => {
//           return (
//             <div>
//               <UpdateStatusDropDown
//                 id={info.row.original.id}
//                 status={info.getValue() as string}
//                 mutateAsync={mutateAsync}
//                 role={user?.role || "marketing"}
//               />
//             </div>
//           );
//         },
//       },
//       {
//         header: "Submitted On",
//         accessorKey: "created_at",
//         cell: (info: any) => (
//           <p className="text-nowrap">
//             {info.getValue() &&
//               format(
//                 new Date(info.getValue() as string) + "Z",
//                 "dd MMM yy , hh:mm a",
//               )}
//           </p>
//         ),
//       },
//       {
//         header: () => <div className="flex justify-center"> Actions</div>,
//         meta: {
//           headerClassName: "w-full",
//         },
//         accessorKey: "assigned_admin",
//         enableSorting: false,
//         cell: ({ row }: any) => {
//           return (
//             <div className="flex items-center gap-2">
//               {user && user.role != "marketing" && (
//                 <MetaAssignAdmin
//                   assigned={row.original.assigned_admin}
//                   lob_id={row.original.lob_id}
//                   status={row.original.status}
//                   form_id={row.original.id}
//                   task_id={row.original.task_id}
//                   lob_key={row.original.lob_details.key}
//                 />
//               )}
//               <ViewButton
//                 onClick={({ mode }) => {
//                   if (mode == "view") {
//                     setMode("view");
//                     setSelectedId(row.original.id);
//                   } else {
//                     setMode("assign");
//                   }
//                 }}
//               />
//             </div>
//           );
//         },
//       },
//     ];
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const loadingColumns = useMemo<ColumnDef<any>[]>(() => {
//     return columns.map((column) => {
//       return {
//         ...column,
//         cell(info: any) {
//           if (info.column.id === "action")
//             return (
//               <div
//                 className="loading2 ml-auto size-6 rounded-full"
//                 style={{ animationDelay: `${info.row.id * 0.2}s` }}
//               ></div>
//             );
//           if (info.column.id === "assignee")
//             return (
//               <div className="grid grid-cols-[auto_1fr] items-center gap-2">
//                 <div
//                   className="loading2 aspect-square size-8 rounded-full"
//                   style={{ animationDelay: `${info.row.id * 0.2}s` }}
//                 ></div>
//                 <div
//                   className="loading h-5 w-full rounded-full"
//                   style={{ animationDelay: `${info.row.id * 0.2}s` }}
//                 ></div>
//               </div>
//             );
//           return (
//             <div
//               className="loading my-[3px] mr-4 h-5 w-full rounded-full"
//               style={{ animationDelay: `${info.row.id * 0.2}s` }}
//             ></div>
//           );
//         },
//       };
//     });
//   }, [columns]);

//   return {
//     table: useReactTable({
//       columns: isLoading ? loadingColumns : columns,
//       data: isLoading ? emptyData : data?.data || [],
//       state: { sorting, rowSelection },
//       initialState: {
//         columnOrder: [
//           "select-col",
//           "full_name",
//           "phone_number",
//           "email",
//           "campaign_name",
//           "status",
//           "created_at",
//           "assigned_admin",
//         ],
//       },
//       getRowId: (row) => row.id,
//       onSortingChange: setSorting,
//       getCoreRowModel: getCoreRowModel(),
//       getSortedRowModel: getSortedRowModel(),
//       onRowSelectionChange: setRowSelection,
//     }),
//     handleLimit,
//     handlePage,
//     rowSelection,
//     ...{
//       total_pages: data?.meta.total_pages || 0,
//       page: params.get("page") || 1,
//       limit: params.get("limit") || 10,
//       total_data: data?.meta.total_items || 0,
//       data_length: data?.data.length || 0,
//     },
//     isError,
//     dataUpdatedAt,
//     refetch,
//     isRefetching,
//     data: data?.data || [],
//     isLoading,
//   };
// };

// export default useDynamicMetaFormsTabel;
