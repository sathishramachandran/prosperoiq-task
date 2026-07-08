"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Summary from "./Summary";
import P4SupportDocs from "./P4SupportDocs";
import P1General from "./P1General";
import P1Manifest from "./P1Manifest";
import P1Bonds from "./P1Bonds";
import P1Payment from "./P1Payment";
import P1Invoice from "./P1Bonds";
import P1Containers from "./P1Containers";
import P2Invoice from "./P2Invoice";
import P2Items from "./P2Items";
import P1ItemDuty from "./P2ItemDuty";
import P3OtherDetails from "./P3OtherDetail";
import P4Schema from "./P4Schema";
import P4License from "./P4License";
import P4Certificate from "./p4Certificate";
import P4Single from "./P4Single";
import P4Container from "./P4Container";
import P4Invoice from "./P4Invoice";
import P5ExamOrder from "./P5ExamOrder";
import P5Complaince from "./P5Complaince";
import P5OOC from "./P5OOC";
import P6Signatory from "./P6Signatory";
import P6Declaration from "./P6Declaration";
import { IoArrowBack } from "react-icons/io5";
import P3ItemDetails from "./P3ItemDetails";

const ExtractionDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const job_id = params.get("job_id") || "";
  const boe_no = params.get("boe_no") || "";
  const sheet_name = params.get("sheet_name") || "";
  //   const [select, setSelect] = useState("Summary");

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
      id: "P1 Manifest",
      name: "P1 Manifest",
    },
    {
      id: "P1 Bonds",
      name: "P1 Bonds",
    },
    {
      id: "P1 Payment",
      name: "P1 Payment",
    },
    {
      id: "P1 Invoice Summary",
      name: "P1 Invoice Summary",
    },
    {
      id: "P1 Containers",
      name: "P1 Containers",
    },
    {
      id: "P2 Invoices",
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
      id: "P3 Item Duty",
      name: "P3 Item Duty",
    },
    {
      id: "P3 Other Duties",
      name: "P3 Other Duties",
    },
    {
      id: "P4 Scheme Notification",
      name: "P4 Scheme Notification",
    },
    {
      id: "P4 License",
      name: "P4 License",
    },
    {
      id: "P4 Certificate",
      name: "P4 Certificate",
    },
    {
      id: "P4 Single Window",
      name: "P4 Single Window",
    },
    {
      id: "P4 Support Docs",
      name: "P4 Support Docs",
    },
    {
      id: "P4 Containers",
      name: "P4 Containers",
    },
    {
      id: "P4 Invoices",
      name: "P4 Invoices",
    },
    {
      id: "P5 Exam Order",
      name: "P5 Exam Order",
    },
    {
      id: "P5 Compliance",
      name: "P5 Compliance",
    },
    {
      id: "P5 OOC Details",
      name: "P5 OOC Details",
    },
    {
      id: "P6 Declaration",
      name: "P6 Declaration",
    },
    {
      id: "P6 Signatory",
      name: "P6 Signatory",
    },
  ];

  const handleSheets = (sheetName: string) => {
    params.set("sheet_name", sheetName);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="px-8 pt-5 ">
      <div
        onClick={() => router.push('/boeextraction')}
        className="flex items-center cursor-pointer mb-3 w-fit  gap-3"
      >
        <IoArrowBack size={26} className="text-slate-700" />{" "}
        <h1 className="text-lg font-semibold text-slate-700 ">
          Bill Of Entry Number : {boe_no}
        </h1>
      </div>

      <div
        style={{ scrollbarWidth: "thin" }}
        className="flex  pb-2 gap-3 flex-wrap"
      >
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
      <div className="mt-2">
        {sheet_name === "Summary" && <Summary job_id={job_id} />}
        {sheet_name === "P4 Support Docs" && <P4SupportDocs job_id={job_id} />}
        {sheet_name === "P1 General" && <P1General job_id={job_id} />}
        {sheet_name === "P1 Manifest" && <P1Manifest job_id={job_id} />}
        {sheet_name === "P1 Bonds" && <P1Bonds job_id={job_id} />}
        {sheet_name === "P1 Payment" && <P1Payment job_id={job_id} />}
        {sheet_name === "P1 Invoice Summary" && <P1Invoice job_id={job_id} />}
        {sheet_name === "P1 Containers" && <P1Containers job_id={job_id} />}
        {sheet_name === "P2 Invoices" && <P2Invoice job_id={job_id} />}
        {sheet_name === "P2 Item Details" && <P2Items job_id={job_id} />}
        {sheet_name === "P3 Item Details" && <P3ItemDetails job_id={job_id} />}
        {sheet_name === "P3 Item Duty" && <P1ItemDuty job_id={job_id} />}
        {sheet_name === "P3 Other Duties" && <P3OtherDetails job_id={job_id} />}
        {sheet_name === "P4 Scheme Notification" && (
          <P4Schema job_id={job_id} />
        )}
        {sheet_name === "P4 License" && <P4License job_id={job_id} />}
        {sheet_name === "P4 Certificate" && <P4Certificate job_id={job_id} />}
        {sheet_name === "P4 Single Window" && <P4Single job_id={job_id} />}
        {sheet_name === "P4 Containers" && <P4Container job_id={job_id} />}
        {sheet_name === "P4 Invoices" && <P4Invoice job_id={job_id} />}
        {sheet_name === "P5 Exam Order" && <P5ExamOrder job_id={job_id} />}
        {sheet_name === "P5 Compliance" && <P5Complaince job_id={job_id} />}
        {sheet_name === "P5 OOC Details" && <P5OOC job_id={job_id} />}
        {sheet_name === "P6 Declaration" && <P6Declaration job_id={job_id} />}
        {sheet_name === "P6 Signatory" && <P6Signatory job_id={job_id} />}
      </div>
    </div>
  );
};

export default ExtractionDetails;
