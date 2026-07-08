import { useBOEBulkDownloads } from "@/src/hooks/useBOE.tsx/useBOEApi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/Dialog";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { FaDownload } from "react-icons/fa6";

const BulkDownloadModel = ({
  children,
  data,
  bill_name
}: {
  children: ReactNode;
  data: any[];
  bill_name:"boe" | "shipping_bill"
}) => {
  const { isPending: downloadPending, mutateAsync: mutateAsyncDownload } =
    useBOEBulkDownloads();

  const [open, setOpen] = useState(false);

  const CHUNK_SIZE = 100;

  const BulkDownload = async (index: number) => {
    const start = index * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;

    const slicedVal = data.slice(start, end);
    const filter = slicedVal.map((value: any) => value.job_id);

    await mutateAsyncDownload({
      job_ids: filter,
      bill_name: bill_name,
    });

    setOpen(false);
  };

  const totalChunks = Math.ceil(data.length / CHUNK_SIZE);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white!">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold!">
            Bulk Download
          </DialogTitle>

          <div className="mt-5">
            {downloadPending && <div>Downloading...</div>}

            <div className="h-96 mt-2  overflow-auto space-y-2 p-2">
              {Array.from({ length: totalChunks }).map((_, index) => {
                const start = index * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, data.length);

                return (
                  <button
                    key={index}
                    disabled={downloadPending}
                    onClick={() => BulkDownload(index)}
                    className={clsx(
                      "border flex justify-between items-center p-3 w-full px-6 cursor-pointer font-medium text-slate-700 rounded-sm hover:bg-slate-100 transition",
                      downloadPending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex gap-3 items-center">
                      <FaDownload />
                      Download
                    </div>

                    <div className="text-sm text-slate-600">
                      {start + 1} - {end} Rows
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default BulkDownloadModel;
