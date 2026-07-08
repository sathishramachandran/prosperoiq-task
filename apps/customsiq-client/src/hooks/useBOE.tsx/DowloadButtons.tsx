import toast from "react-hot-toast";
import { useBOEDownload } from "./useBOEApi";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { MdPictureAsPdf } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";


const DownButtons = ({
  job_id,
  status,
  bill_name,
  user_id,
  file,
}: {
  job_id: string;
  status: string;
  bill_name: string;
  user_id?: string;
  file?: string;
}) => {
  const [fileType, setFileType] = useState("excel");
  const fileypeConvers = fileType === "excel" ? "xlsx" : "pdf";

  const [downID, setDownID] = useState("");
  const { data } = useBOEDownload(downID, fileType, bill_name, undefined, user_id);
  const [processing, setProcessing] = useState(false);

  const handleFileDownload = (type: string) => {
    setDownID(job_id);
    setFileType(type);
    // const fileypeConvers = type === 'excel' ? 'xlsx' : 'pdf'
  };

  useEffect(() => {
    const dowloadFile = async () => {
      if (data) {
        toast.success("Downloading...");
        const url = window.URL.createObjectURL(data);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${file}.${fileypeConvers}`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Downloaded Successfully");
        setProcessing(false);
      }
    };

    if (data) {
      dowloadFile();
      setDownID("");
      // setFileType(type)
    }
  }, [downID, data]);

  const disabled = status === "processing" || status === "queued";

  return (
    <div className="flex gap-4">
      <button
        disabled={disabled}
        onClick={() => handleFileDownload("excel")}
        title="Download Excel"
        aria-label="Download Excel"
        className={clsx(
          "text-nowrap cursor-pointer text-[#089349]",
          disabled && "cursor-auto!",
        )}
      >
        <RiFileExcel2Fill size={22} />
      </button>
      <button
        disabled={disabled}
        onClick={() => handleFileDownload("pdf")}
        title="Download PDF"
        aria-label="Download PDF"
        className={clsx(
          "text-nowrap cursor-pointer text-[#DC2626]",
          disabled && "cursor-auto!",
        )}
      >
        <MdPictureAsPdf size={22} />
      </button>
    </div>
  );
};

export default DownButtons;
