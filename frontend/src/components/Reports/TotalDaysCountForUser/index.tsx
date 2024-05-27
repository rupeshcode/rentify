import React, { useEffect, useState } from "react";
import useRolexTable from "../../Table/useRolexTable";
import { createColumnHelper } from "@tanstack/react-table";
import RolexTable from "../../Table";
import { useUserStore } from "@/stores/user-store";
import { getPunchDateRange } from "@/utils/string";

type MyTotalDays = {
  employee_id: number;
  display_name: string;
  el_count: string;
  cl_count: string;
  lwp_count: string;
  cof_count: string;
  tour_count: string;
  punched_days: string;
};

const cols = createColumnHelper<MyTotalDays>();

function TotalDaysCountForUser() {
  const user = useUserStore.use.user();
  const [apiParams, _] = useState({ email: String(user.email) });
  const tableState = useRolexTable({
    apiPath: "/punch/get-days-count-from-punches",
    apiParams,
  });

  useEffect(() => {
    // tableState.setSearchQuery();
    const range = getPunchDateRange();
    tableState.setStartDate(range[0]);
    tableState.setEndDate(range[1]);
  }, []);

  const columns = [
    cols.accessor("employee_id", { header: "Emp Id" }),
    cols.accessor("display_name", { header: "Employee Name" }),
    cols.accessor("el_count", { header: "EL" }),
    cols.accessor("cl_count", { header: "CL" }),
    cols.accessor("lwp_count", { header: "LWP" }),
    cols.accessor("cof_count", { header: "COF" }),
    cols.accessor("tour_count", { header: "Tour" }),
    cols.accessor("punched_days", { header: "Total Days" }),
  ];

  return (
    <RolexTable
      title="Total Days"
      columns={columns}
      state={tableState}
      // canSearch
      canFilterByDate
      // canExport
    />
  );
}

export default TotalDaysCountForUser;
