import { flexRender, RowData, Table } from "@tanstack/react-table";
import clsx from "clsx";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    headerClassName?: string;
  }
}

type Props = {
  data: boolean | any;
  table: Table<any>;
};

const TableContainer = ({ data, table }: Props) => {
  return (
    <table className="w-full whitespace-pre! text-sm">
      <thead className="border-b">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-white">
            {headerGroup.headers.map((header) => (
              <th
                className={clsx(
                  "cursor-pointer select-none px-4 py-3.5 text-left font-semibold text-slate-700 last:cursor-default! last:bg-white! hover:bg-slate-100",
                  header.column.columnDef.meta?.className
                )}
                key={header.id}
                onClick={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
              >
                <div
                  className={clsx(
                    "grid w-fit grid-flow-col items-center gap-2 text-nowrap",
                    header.column.columnDef.meta?.headerClassName
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {(header.column.getCanSort() &&
                    {
                      asc: <FaSortUp />,
                      desc: <FaSortDown />,
                    }[header.column.getIsSorted() as string]) ?? <FaSort />}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y">
        {data &&
          table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="transition-colors odd:bg-slate-50 even:bg-white hover:bg-slate-200"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className={clsx(
                    "px-4 py-3 text-left font-normal text-slate-600",
                    cell.column.columnDef.meta?.className
                  )}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TableContainer;
