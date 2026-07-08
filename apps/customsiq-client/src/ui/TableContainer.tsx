/* eslint-disable @typescript-eslint/no-explicit-any */
import { flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import "@tanstack/react-table";

type Props = {
  data: boolean | any;
  table: any;
  firstColumnColor?: string;
};

const TableContainer = ({ data, table, firstColumnColor }: Props) => {
  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  const visibleColumnsCount = table.getVisibleLeafColumns?.().length ?? 1;
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (table && !hasInitialized) {
      setHasInitialized(true);

      // 1. Initialize Column Sizing for select-col and action across all tables
      table.setColumnSizing?.({
        "select-col": 50,
        action: 80,
      });

      // 2. Initialize Column Pinning if not already configured
      if (
        !table.getState().columnPinning?.left?.length &&
        !table.getState().columnPinning?.right?.length
      ) {
        const allCols = table.getAllLeafColumns?.() || [];
        const leftPins: string[] = [];
        const rightPins: string[] = [];

        if (allCols.length > 0) {
          if (allCols[0].id === "select-col") {
            leftPins.push("select-col");
            if (allCols.length > 1) leftPins.push(allCols[1].id);
          } else {
            leftPins.push(allCols[0].id);
          }

          const lastCol = allCols[allCols.length - 1];
          if (
            lastCol.id === "action" ||
            lastCol.id === "Action" ||
            lastCol.columnDef?.header === "Action"
          ) {
            rightPins.push(lastCol.id);
          }
        }

        table.setColumnPinning?.({ left: leftPins, right: rightPins });
      }
    }
  }, [table, hasInitialized]);

  return (
    <table className="w-full whitespace-pre! text-xs custom-scrollbar border-separate border-spacing-0">
      <thead className="sticky top-0 z-30">
        {headerGroups.map((headerGroup: any) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: any, index: number) => {
              const canSort = header.column.getCanSort();
              const sorted = header.column.getIsSorted() as
                | false
                | "asc"
                | "desc";
              return (
                <th
                  style={{
                    width: header.column.getSize(),
                    minWidth: header.column.getSize(),
                    left: header.column.getIsPinned() === "left" ? header.column.getStart("left") : undefined,
                    right: header.column.getIsPinned() === "right" ? header.column.getAfter("right") : undefined,
                    position: header.column.getIsPinned() ? "sticky" : undefined,
                    zIndex: header.column.getIsPinned() ? 20 : 10,
                  }}
                  className={clsx(
                    "select-none px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600",
                    "bg-slate-50",
                    "border-b border-slate-200",
                    "first:rounded-tl-lg last:rounded-tr-lg",
                    canSort
                      ? "cursor-pointer transition-colors hover:bg-slate-100 hover:text-slate-900"
                      : "cursor-default",
                    header.column.getIsPinned() && "shadow-[1px_0_0_0_#e2e8f0]",
                    header.column.columnDef.meta?.className,
                  )}
                  key={index}
                  onClick={
                    canSort ? header.column.getToggleSortingHandler() : undefined
                  }
                >
                  <div
                    className={clsx(
                      "flex w-fit items-center gap-2 text-nowrap",
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {canSort && (
                      <span
                        className={clsx(
                          "inline-flex h-4 w-4 items-center justify-center transition-opacity",
                          sorted ? "text-slate-900 opacity-100" : "text-slate-400 opacity-60",
                        )}
                      >
                        {sorted === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : sorted === "desc" ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className="text-xs">
        {data && rows.length > 0 ? (
          rows.map((row: any, rowIndex: number) => (
            <tr
              key={row.id}
              className={clsx(
                "group transition-colors",
                rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50",
                "hover:bg-blue-50",
              )}
            >
              {row.getVisibleCells().map((cell: any, cellIndex: number) => (
                <td
                  style={{
                    ...(cellIndex === 1 && firstColumnColor
                      ? { color: firstColumnColor, fontWeight: 600 }
                      : {}),
                    minWidth: cell.column.getSize(),
                    left: cell.column.getIsPinned() === "left" ? cell.column.getStart("left") : undefined,
                    right: cell.column.getIsPinned() === "right" ? cell.column.getAfter("right") : undefined,
                    position: cell.column.getIsPinned() ? "sticky" : undefined,
                    zIndex: cell.column.getIsPinned() ? 10 : undefined,
                  }}
                  className={clsx(
                    "px-4 py-2.5 text-left font-normal text-slate-700",
                    "border-b border-slate-100",
                    "group-hover:border-blue-100",
                    cell.column.getIsPinned() && "bg-inherit shadow-[1px_0_0_0_#e2e8f0]",
                    cell.column.columnDef.meta?.className,
                  )}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={visibleColumnsCount}
              className="px-4 py-10 text-center text-sm text-slate-400"
            >
              No records to display
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableContainer;
