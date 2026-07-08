import { useBOEBulkUpload } from "@/src/hooks/useBOE.tsx/useBOEApi";
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
import JSZip from "jszip";
import toast from "react-hot-toast";

const BulkUploadModel = ({
  userId,
  billName = "boe",
  open,
  setOpen,
  bill_name,
}: {
  userId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  billName: string;
  bill_name: "Bill Of Entry" | "Shipping Bill";
}) => {
  const { mutateAsync: bulkUpload, isPending } = useBOEBulkUpload();

  const MAX_FILES = 100;

  const handleBulkUpload = async (files: FileList) => {
    try {
      const formData = new FormData();
      let pdfFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const isZip =
          file.type === "application/zip" ||
          file.type === "application/x-zip-compressed" ||
          file.name.endsWith(".zip");

        const isPdf = file.type === "application/pdf";

        if (isZip) {
          const zip = await JSZip.loadAsync(file);

          for (const fileName in zip.files) {
            const zipEntry = zip.files[fileName];

            if (zipEntry.dir) continue;
            if (!fileName.toLowerCase().endsWith(".pdf")) continue;

            if (pdfFiles.length >= MAX_FILES) {
              toast.error(`Maximum ${MAX_FILES} PDF files allowed`);
              return;
            }

            const blob = await zipEntry.async("blob");

            const pdfFile = new File([blob], fileName, {
              type: "application/pdf",
            });

            pdfFiles.push(pdfFile);
          }
        } else if (isPdf) {
          if (pdfFiles.length >= MAX_FILES) {
            alert(`Maximum ${MAX_FILES} PDF files allowed`);
            return;
          }

          pdfFiles.push(file);
        }
      }

      if (pdfFiles.length === 0) {
        alert("No valid PDF files found");
        return;
      }

      if (pdfFiles.length > MAX_FILES) {
        alert(`You can upload maximum ${MAX_FILES} PDFs only`);
        return;
      }

      pdfFiles.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("user_id", userId);
      formData.append("bill_name", billName);


      await bulkUpload(formData);

      setOpen(false);
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    handleBulkUpload(files);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white!">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold!">
            Bulk Upload for {bill_name}
          </DialogTitle>

          <div className="mt-5">
            {isPending && <p>Uploading...</p>}

            <input
              type="file"
              multiple
              accept=".zip,.pdf"
              id="bulk-upload-input"
              onChange={handleChange}
              className="hidden"
            />

            <label htmlFor="bulk-upload-input">
              <div
                className={clsx(
                  "border-dotted border-2 rounded-lg py-6 mt-2 border-ciq-primary text-center cursor-pointer",
                  isPending && "cursor-not-allowed opacity-50",
                )}
              >
                <FaUpload className="mx-auto text-ciq-primary" size={24} />
                <p className="mt-3 font-medium text-slate-700">
                  Upload ZIP or Multiple PDFs
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Click or drag & drop
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  Max file Upload 100
                </p>
              </div>
            </label>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadModel;
