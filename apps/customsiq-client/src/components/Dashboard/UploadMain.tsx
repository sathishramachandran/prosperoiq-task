"use client";

import {
  useBOEBulkUpload,
  useBOESingleUpload,
} from "@/src/hooks/useBOE.tsx/useBOEApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/Dialog";
import clsx from "clsx";
import { ChangeEvent } from "react";
import { FaUpload } from "react-icons/fa6";
import JSZip from "jszip";
import toast from "react-hot-toast";

type Props = {
  userId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  billName: 'boe' | 'shipping_bill';
  bill_label: "Bill Of Entry" | "Shipping Bill";
};

const UploadModal = ({
  userId,
  open,
  setOpen,
  billName,
  bill_label,
}: Props) => {
  const { mutateAsync: singleUpload, isPending: singleLoading } =
    useBOESingleUpload();

  const { mutateAsync: bulkUpload, isPending: bulkLoading } =
    useBOEBulkUpload();

  const isPending = singleLoading || bulkLoading;
  const MAX_FILES = 100;

const handleUpload = async (files: FileList) => {
  try {
    let pdfFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const isZip =
        file.type === "application/zip" ||
        file.name.endsWith(".zip");

      const isPdf = file.type === "application/pdf";

      if (isZip) {
        const zip = await JSZip.loadAsync(file);

        for (const fileName in zip.files) {
          const zipEntry = zip.files[fileName];

          if (zipEntry.dir) continue;
          if (!fileName.toLowerCase().endsWith(".pdf")) continue;

          if (pdfFiles.length >= MAX_FILES) {
            toast.error(`Max ${MAX_FILES} PDFs allowed`);
            return;
          }

          const blob = await zipEntry.async("blob");

          pdfFiles.push(
            new File([blob], fileName, {
              type: "application/pdf",
            })
          );
        }
      }

      else if (isPdf) {
        if (pdfFiles.length >= MAX_FILES) {
          toast.error(`Max ${MAX_FILES} PDFs allowed`);
          return;
        }

        pdfFiles.push(file);
      }
    }

    if (pdfFiles.length === 0) {
      toast.error("No valid PDF files found");
      return;
    }

    let response;

    if (pdfFiles.length === 1) {
      const formData = new FormData();
      formData.append("file", pdfFiles[0]);
      formData.append("user_id", userId);
      formData.append("bill_name", billName);

      response = await singleUpload(formData);
    }

    else {
      const formData = new FormData();

      pdfFiles.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("user_id", userId);
      formData.append("bill_name", billName);

      response = await bulkUpload(formData);
    }

    const data = response?.data;

    if (data?.files_accepted !== undefined) {
      toast.success(
        `${data.files_accepted || 0} uploaded, ${
          data.files_rejected || 0
        } rejected`
      );

      if (data.errors?.length) {
        toast(
          `${data.errors.length} duplicate file(s) found. ${data.errors.join(
            ", "
          )}`,
          {
            icon: "⚠️",
          }
        );
      }
    }

    setOpen(false);
  } catch (err: any) {

    const errorData = err?.response?.data;

    if (errorData?.detail) {
      const detail = errorData.detail;

      toast.error(detail.message || "Upload failed");

      if (detail.errors?.length) {
        toast(
          `${detail.errors.length} duplicate file(s): ${detail.errors.join(
            ", "
          )}`,
          {
            icon: "⚠️",
          }
        );
        return
      }

      if (detail.file_errors?.length) {
        console.table(detail.file_errors);
      }

      return;
    }

    toast.error("Upload failed");
  }
};   
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    handleUpload(files);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white!">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold!">
            Upload {bill_label}
          </DialogTitle>

          <div className="mt-5">
            {isPending && <p>Uploading...</p>}

            <input
              type="file"
              multiple
              accept=".zip,.pdf"
              id="upload-input"
              onChange={handleChange}
              className="hidden"
              disabled={isPending}
            />

            <label htmlFor="upload-input">
              <div
                className={clsx(
                  "border-dotted border-2 rounded-lg py-6 mt-2 border-ciq-primary text-center cursor-pointer",
                  isPending && "cursor-not-allowed opacity-50"
                )}
              >
                <FaUpload className="mx-auto text-ciq-primary" size={24} />

                <p className="mt-3 font-medium text-slate-700">
                  Upload PDF or ZIP
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Single file → normal upload  
                  Multiple/ZIP → bulk upload
                </p>

                <p className="text-xs text-slate-700 mt-2">
                  Max {MAX_FILES} files
                </p>
              </div>
            </label>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;