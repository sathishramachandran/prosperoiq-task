import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/Dialog";
import clsx from "clsx";

import { useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { LuCircleDashed } from "react-icons/lu";

type Props = {
  children: ReactNode;
  no?: string;
  mutateAsync: any;
  billName: string;
  isPending: boolean;
};

const DeleteModel = ({
  children,
  no,
  mutateAsync,
  isPending,
  billName,
}: Props) => {
  //   const { mutateAsync, isPending } = useDeleteImage();

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger> {children} </DialogTrigger>
      <DialogContent className="p-0!">
        <DialogTitle className="hidden" />

        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          {/* HEADER */}
          <div className="flex items-start justify-between px-8 py-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delete</h2>
            </div>
          </div>
          {no ? (
            <p className="px-8 text-slate-700 ">
              Are you sure you want to delete this {billName} {no} ? This action
              cannot be undone.
            </p>
          ) : (
            <p className="px-8 text-slate-700 ">
              Are you sure you want to delete selected Bill of Entry? This
              action cannot be undone.
            </p>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between  px-8 py-5 rounded-b-2xl">
            <div className="flex gap-3 w-full justify-end">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="text-sm cursor-pointer text-gray-600"
              >
                Cancel
              </button>

              <button
                disabled={isPending}
                className={clsx(
                  "bg-red-600 px-5 py-1 cursor-pointer rounded-sm border-0! text-white",
                  isPending && "cursor-default!",
                )}
                onClick={async () => {
                  await mutateAsync();
                  setOpen(false);
                }}
              >
                {isPending ? (
                  <div className="animate-spin ">
                    <LuCircleDashed size={21} />
                  </div>
                ) : (
                  "Delete"
                )}{" "}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModel;
