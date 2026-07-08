"use client";

import { MdArrowOutward } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type reportType = {
  name: string;
  reportName: string;
};

const reportDescriptions: Record<string, string> = {
  "BOND BG":
    "Financial guarantees that secure customs duties and compliance, enabling faster clearance, deferred payments, and temporary imports without blocking working capital.",

  "IMPORT INVOICE DETAILS":
    "Commercial documents containing transaction value, goods description, and sale terms, used by customs to determine duties and taxes accurately.",

  "Import Item Details":
    "Detailed shipment information including product descriptions, HS codes, and quantities, required for duty assessment and compliance verification.",

  "SPECIAL VALUATION BRANCH":
    "A customs unit that verifies related-party import transactions to ensure fair market pricing and prevent duty evasion through undervaluation.",

  "SCRIP / LICENSE UTILIZATION":
    "Use of authorized duty credit scrips or licenses to offset customs duties, helping importers reduce cash outflow under trade policy benefits.",

  CERTIFICATE:
    "A document certifying the manufacturing country of goods, used to determine applicable duties, trade benefits, and agreement compliance.",

  "EXPORT INCENTIVES":
    "Government benefits such as duty exemptions, refunds, and credits provided to exporters to reduce costs and promote international trade.",

  "EXPORT ITEM DETAILS":
    "Complete shipment information including product description, quantity, value, and classification, used for customs verification and export clearance.",

  "EXPORT VALUE DETAILS":
    "Declared monetary value of exported goods used for duty assessment, export incentives, foreign exchange reporting, and compliance.",

  "DRAW BACK":
    "A refund of duties and taxes paid on imported inputs used in exported goods, helping reduce export costs and improve competitiveness.",

  "AA / EPCG LICENSE":
    "Export promotion schemes allowing import of raw materials or capital goods at reduced or zero duty against export obligations.",

  "EXPORT INVOICE DETAILS":
    "Commercial export document containing exporter and buyer details, goods description, quantity, pricing, and shipment value for customs and compliance purposes.",

  "RODTEP REPORT":
    "A customs report used to claim refunds of embedded taxes and duties on exported goods under the RoDTEP scheme.",

  "IMPORT HSN MASTER":
    "A standardized HS code classification system for imported goods, used to determine duties, compliance requirements, and documentation accuracy.",

  "IMPORT ITEM DESCRIPTION":
    "Detailed explanation of imported goods, including composition and usage, helping customs classify items and assess applicable duties.",

  "IMPORT EXEMPTION WISE":
    "Goods eligible for customs duty exemption or concessional rates under government schemes or notifications, helping reduce import costs through compliant duty-free clearance.",
};

const Reports = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const billOfEntry: reportType[] = [
    { name: "BOND BG", reportName: "bond-bg" },
    { name: "IMPORT INVOICE DETAILS", reportName: "invoice-details" },
    { name: "Import Item Details", reportName: "import-item-detail" },
    { name: "SPECIAL VALUATION BRANCH", reportName: "svb" },
    { name: "SCRIP / LICENSE UTILIZATION", reportName: "license" },
    { name: "CERTIFICATE", reportName: "certificate" },
  ];

  const shippingBill: reportType[] = [
    { name: "EXPORT INCENTIVES", reportName: "export-promotion" },
    { name: "EXPORT ITEM DETAILS", reportName: "item-details" },
    { name: "EXPORT VALUE DETAILS", reportName: "value-details" },
    { name: "DRAW BACK", reportName: "drawback-report" },
    { name: "AA / EPCG LICENSE", reportName: "aa-license" },
    { name: "EXPORT INVOICE DETAILS", reportName: "invoice-details" },
    { name: "RODTEP REPORT", reportName: "rodtep-report" },
  ];

  const masterReport: reportType[] = [
    { name: "IMPORT HSN / ITEM MASTER ", reportName: "hsn-master" },
    // { name: "IMPORT ITEM MASTER", reportName: "item-description" },
    { name: "IMPORT EXEMPTION WISE", reportName: "exemption-wise" },
    { name: "IMPORT SAME DESCRIPTION DIFFERENT HSN", reportName: "same-desc-diff-hsn" },
    { name: "IMPORT SAME HSN DIFFERENT RATE", reportName: "same-hsn-diff-rate" },
  ];

  const ReportList = ({
    title,
    data,
    reportType,
  }: {
    title: string;
    reportType: string;
    data: reportType[];
  }) => {
    const handleReports = (reportName: string) => {
      params.set("report_type", reportName);

      if (reportType === "boe") {
        router.push(`/reports/boe-reports?${params.toString()}`);
      } else if (reportType === "master_report") {
        router.push(`/reports/master-reports?${params.toString()}`);
      } else {
        router.push(`/reports/sb-reports?${params.toString()}`);
      }
    };

    return (
      <div className="space-y-5">
        <h2 className="text-gray-900 text-sm tracking-[0.18em] font-semibold">
          {title}
        </h2>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveTooltip(item.name)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => handleReports(item.reportName)}
              className="relative w-fit"
            >
              {/* REPORT ITEM */}
              <div className="group flex items-center gap-2 cursor-pointer transition-all duration-300">
                <span className="uppercase text-sm tracking-wide text-gray-600 group-hover:text-black transition-colors duration-300">
                  {item.name}
                </span>

                <MdArrowOutward className="text-base text-gray-500 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>

              {/* TOOLTIP */}
              <AnimatePresence mode="wait">
                {activeTooltip === item.name && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="absolute left-0 top-8 z-50 w-80 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl p-4"
                  >
                    {/* TOP GLOW */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/40 to-transparent pointer-events-none" />

                    {/* CONTENT */}
                    <div className="relative z-10">
                      <h3 className="text-xs font-semibold tracking-wider text-black mb-2 uppercase">
                        {item.name}
                      </h3>

                      <p className="text-xs leading-5 text-gray-600">
                        {reportDescriptions[item.name] ||
                          "No description available"}
                      </p>
                    </div>

                    {/* ARROW */}
                    <div className="absolute -top-1.5 left-5 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 py-8">
      <div className="grid md:grid-cols-3 gap-20">
        <ReportList
          reportType="boe"
          title="BILL OF ENTRY"
          data={billOfEntry}
        />

        <ReportList
          reportType="shipping_bill"
          title="SHIPPING BILL"
          data={shippingBill}
        />

        <ReportList
          reportType="master_report"
          title="MASTER REPORTS"
          data={masterReport}
        />
      </div>
    </div>
  );
};

export default Reports;