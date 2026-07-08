"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/Popover";
import { Calendar } from "@/src/ui/Calendar";

type Props = {
  setSDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEDate: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function DateFilter({ setSDate, setEDate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);

  React.useEffect(() => {
    const s = searchParams.get("start_date");
    const e = searchParams.get("end_date");

    if (s) setStartDate(parseISO(s));
    if (e) setEndDate(parseISO(e));

    setSDate(s || undefined);
    setEDate(e || undefined);
  }, [searchParams, setSDate, setEDate]);

  const updateQuery = (s?: Date, e?: Date) => {
    const params = new URLSearchParams(searchParams.toString());

    if (s) {
      params.set("start_date", s.toISOString());
    } else {
      params.delete("start_date");
    }

    if (e) {
      params.set("end_date", e.toISOString());
    } else {
      params.delete("end_date");
    }

    // reset pagination
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("Select both dates");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    updateQuery(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    updateQuery(undefined, undefined);
  };

  return (
    <div className="flex items-center justify-end gap-3 flex-wrap">
      {/* START DATE */}
      <Popover open={openStart}  onOpenChange={setOpenStart}>
        <PopoverTrigger className="py-1! h-8" asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-start text-xs text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-1 w-4 opacity-70" />
            {startDate ? (
              format(startDate, "dd MMM yyyy")
            ) : (
              <span className="text-muted-foreground">Start Date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            captionLayout="dropdown"
            fromYear={2000}
            toYear={2035}
            onSelect={(date) => {
              if (!date) return;
              setStartDate(date);
              setOpenStart(false); // ✅ close on select
            }}
          />
        </PopoverContent>
      </Popover>

      {/* END DATE */}
      <Popover open={openEnd} onOpenChange={setOpenEnd}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-start h-8 text-xs text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-3 w-4 opacity-70" />
            {endDate ? (
              format(endDate, "dd MMM yyyy")
            ) : (
              <span className="text-muted-foreground">End Date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            captionLayout="dropdown"
            fromYear={2000}
            className="text-xs"
            toYear={2035}
            onSelect={(date) => {
              if (!date) return;
              setEndDate(date);
              setOpenEnd(false); // ✅ close on select
            }}
            disabled={(date) => (startDate ? date < startDate : false)}
          />
        </PopoverContent>
      </Popover>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!startDate || !endDate}
          className="px-6 bg-ciq-primary text-white py-1.5 rounded-sm text-sm disabled:opacity-50"
        >
          Apply
        </button>

        <button
          onClick={handleReset}
          className="px-4 bg-gray-200 text-black py-1.5 text-sm rounded-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}