import { useBOEBulkDownloads } from "@/src/hooks/useBOE.tsx/useBOEApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/Dialog";
import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";
import { FaDownload } from "react-icons/fa6";

const ViewDetails = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState<number | null>(1);

  const data = [
    {
      sno: 1,
      items: Array(4).fill({
        number: "KDP6124LRS",
        amount: "₹ 198593",
        currency: "USD",
      }),
    },
    {
      sno: 2,
      items: Array(4).fill({
        number: "KDP6124LRS",
        amount: "₹ 198593",
        currency: "USD",
      }),
    },
    {
      sno: 3,
      items: Array(4).fill({
        number: "KDP6124LRS",
        amount: "₹ 198593",
        currency: "USD",
      }),
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[48rem] p-0 border">
        <DialogHeader className="text-slate-800 py-4 px-4 font-semibold!">
          <DialogTitle >
            Invoice Details
          </DialogTitle>
        </DialogHeader>

       <div className=" px-6 bg-[#F7F8FA] py-4">
         <div className=" mx-auto  rounded-lg overflow-hidden  ">
          {data.map((group , index) => {
            const isOpen = open === group.sno;

            return (
              <div
                key={group.sno}
                className={clsx(" border-b border-l border-r border-gray-200 bg-white overflow-hidden" ,!index&&'border-t' )}
              >
                {/* Header Row */}
                <button
                  onClick={() => setOpen(isOpen ? null : group.sno)}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50"
                >
                  <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  <span className="font-medium text-gray-800 min-w-[180px] text-left">
                    INVOICE SNO {group.sno}
                  </span>

                  <div className="flex-1 grid grid-cols-3 text-sm font-medium text-gray-700">
                    <div className="text-center">INVOICE NUMBER</div>
                    <div className="text-center">INVOICE AMOUNT</div>
                    <div className="text-center">INVOICE CURRENCY</div>
                  </div>
                </button>

                {/* Dropdown Content */}
                {isOpen && group.items.length > 0 && (
                  <div className="border-t border-gray-200">
                    {group.items.map((item, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-[200px_1fr_1fr_1fr] px-4 py-3 text-sm text-gray-700 ${
                          i !== group.items.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <div className="pl-2">{group.sno}</div>
                        <div className="text-center">{item.number}</div>
                        <div className="text-center">{item.amount}</div>
                        <div className="text-center">{item.currency}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
       </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetails;
