import {
  useBOEBulkUpload,
  useBOESingleUpload,
} from "@/src/hooks/useBOE.tsx/useBOEApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/Dialog";
import clsx from "clsx";
import { ReactNode, useState, ChangeEvent } from "react";
import { FaUpload } from "react-icons/fa6";
import toast from "react-hot-toast";

const SingleUploadModel = ({
  user_id,
  pathValidate,
  open,
  setOpen,
  bill_name,
}: {
  user_id: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  pathValidate: string;
  bill_name: "Bill Of Entry" | "Shipping Bill";
}) => {
  const {
    data: filedata,
    mutateAsync,
    isPending,
    // isError,
  } = useBOESingleUpload();

  const singleFileHandle = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bill_name", pathValidate);
    formData.append("user_id", user_id || "");
    const response = await mutateAsync(formData);
    setOpen(false)
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    singleFileHandle(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white!">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold!">
            Upload {bill_name}
          </DialogTitle>

          <div className="mt-5">
            {isPending && <p>Uploading...</p>}

            <input
              type="file"
              accept=".pdf"
              id="single-upload-input"
              onChange={handleChange}
              className="hidden"
              disabled={isPending}
            />

            <label htmlFor="single-upload-input">
              <div
                className={clsx(
                  "border-dotted border-2 rounded-lg py-6 mt-2 border-ciq-primary text-center cursor-pointer",
                  isPending && "cursor-not-allowed opacity-50",
                )}
              >
                <FaUpload className="mx-auto text-ciq-primary" size={24} />
                <p className="mt-3 font-medium text-slate-700">
                  Upload PDF File
                </p>
                <p className="text-xs text-slate-400 mt-1">Click to upload</p>
              </div>
            </label>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SingleUploadModel;
