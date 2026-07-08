"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Summary from "./Summary";
import P1General from "./P1GeneralMain";
import P1Inovice from "./P1Invoice";
import P2Inovice from "./P2Invoice";
import P2ItemDetails from "./P2ItemTDetails";
import P3ItemDetail from "./P3ItemDetail";
import P4Drawback from "./P4Drawback";
import P4Supporting from "./P4Supporting";
import P4Single from "./P4Single";
import P4RodTep from "./P4Rodtep";
import P4Invoice from "./P4Invoice";
import P1Container from "./P1Container";
import P4Container from "./P4Container";
import { IoArrowBack } from "react-icons/io5";
import P4License from "./P4License";

const ShippingBill = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const job_id = params.get("job_id") || "";
  const sb_no = params.get("sb_no") || "";
  const sheet_name = params.get("sheet_name") || "";
  const handleSheets = (sheetName: string) => {
    params.set("sheet_name", sheetName);

    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    {
      id: "Summary",
      name: "Summary",
    },
    {
      id: "P1 General",
      name: "P1 General",
    },
    {
      id: "P1 Invoice Summary",
      name: "P1 Invoice Summary",
    },
    {
      id: "P1 Container Details",
      name: "P1 Container Details",
    },
    {
      id: "P2 Invoice",
      name: "P2 Invoice",
    },
    {
      id: "P2 Item Details",
      name: "P2 Item Details",
    },
    {
      id: "P3 Item Details",
      name: "P3 Item Details",
    },
    {
      id: "P4 Drawback",
      name: "P4 Drawback",
    },
    {
      id: "P4 Single Window",
      name: "P4 Single Window",
    },
    {
      id: "P4 Supporting Docs",
      name: "P4 Supporting Docs",
    },
    {
      id: "P4 Invoice Details",
      name: "P4 Invoice Details",
    },
    {
      id: "P4 License",
      name: "P4 License",
    },
    {
      id: "P4 Container Details",
      name: "P4 Container Details",
    },
    {
      id: "P4 RODTEP",
      name: "P4 RODTEP",
    },
  ];

  return (
    <div className="px-8 py-6 ">
      <div
        onClick={() => router.push('/sbextraction')}
        className="flex items-center cursor-pointer mb-4 w-fit  gap-3"
      >
        <IoArrowBack size={26} className="text-slate-700" />{" "}
        <h1 className="text-xl font-semibold text-slate-700 ">
          Shipping Bil Number : {sb_no}
        </h1>
      </div>

      <div className="flex  py-2 gap-4 flex-wrap">
        {tabs.map((tab, index) => {
          return (
            <button
              onClick={() => handleSheets(tab.id)}
              className={clsx(
                "text-nowrap text-xs  cursor-pointer border-ciq-primary border-2 text-ciq-primary transition-colors bg-ciq-primary/5  rounded-full px-3 py-2",
                sheet_name == tab.id && "text-white bg-ciq-primary!",
              )}
              key={index}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      {sheet_name === "Summary" && <Summary job_id={job_id} />}
      {sheet_name === "P1 General" && <P1General job_id={job_id} />}
      {sheet_name === "P1 Invoice Summary" && <P1Inovice job_id={job_id} />}
      {sheet_name === "P1 Container Details" && <P1Container job_id={job_id} />}
      {sheet_name === "P2 Invoice" && <P2Inovice job_id={job_id} />}
      {sheet_name === "P2 Item Details" && <P2ItemDetails job_id={job_id} />}
      {sheet_name === "P3 Item Details" && <P3ItemDetail job_id={job_id} />}
      {sheet_name === "P4 Drawback" && <P4Drawback job_id={job_id} />}
      {sheet_name === "P4 Single Window" && <P4Single job_id={job_id} />}
      {sheet_name === "P4 Supporting Docs" && <P4Supporting job_id={job_id} />}
      {sheet_name === "P4 Container Details" && <P4Container job_id={job_id} />}
      {sheet_name === "P4 RODTEP" && <P4RodTep job_id={job_id} />}
      {sheet_name === "P4 Invoice Details" && <P4Invoice job_id={job_id} />}
      {sheet_name === "P4 License" && <P4License job_id={job_id} />}
    </div>
  );
};

export default ShippingBill;
