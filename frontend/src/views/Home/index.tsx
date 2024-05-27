import React, { useEffect, useState } from "react";
import scss from "./home.module.scss";
import fetcher from "@/utils/fetcher";
import { Button, Loader, Paper, Text } from "@mantine/core";
import { useRouter } from "next/router";

const leavesCountArray = [
  {
    id: 1,
    title: "Approved",
    key: "approved_count",
    color: "blue",
    path: "/approved-leave-list",
  },
  {
    id: 2,
    key: "rejected_count",
    title: "Rejected",
    color: "red",
    path: "/rejected-leave-list",
  },
  {
    id: 3,
    title: "Pending",
    key: "pending_count",
    color: "yellow",
    path: "/pending-leave-list",
  },
  {
    id: 4,
    title: "Remaining",
    key: "remaining_count",
    color: "green",
    footerEL: (elCount: number) => `${elCount ?? " "} EL`,
    footerCL: (clCount: number) => `${clCount ?? " "} CL`,
    footerCOF: (cofCount: number) => `${cofCount ?? " "} COF`,
  },
];

function Home() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, any>>({});
  const [ELCLCounts, setELCLCounts] = useState<Record<string, any>>({});

  useEffect(() => {
    getELCLCOUNTS();
  }, []);

  useEffect(() => {
    if (Object.entries(ELCLCounts).length === 0) {
      return;
    }
    fetchCount();
  }, [ELCLCounts]);

  const fetchCount = async () => {
    try {
      const response = await fetcher(
        "/leaves/get-leave-status-dashboard-count",
        "POST"
      );

      const updatedCounts = {
        approved_count: response?.approved_count || 0,
        rejected_count: response?.rejected_count || 0,
        pending_count: response?.pending_count || 0,
        remaining_count:
          parseFloat(ELCLCounts?.el_count) +
          parseFloat(ELCLCounts?.cl_count) +
          parseFloat(ELCLCounts?.cof_count),
      };

      setCounts(updatedCounts);
    } catch (error) {
      console.error("Error fetching leave counts:", error);
    }
  };

  const getELCLCOUNTS = async () => {
    try {
      const response = await fetcher(
        "/leaves/get-all-el-cl-counts-dashboard",
        "POST"
      );
      setELCLCounts(response);
    } catch (error) {
      console.error("error fetching", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className={scss.home_content}>
        {leavesCountArray.map((tab) => (
          <Paper withBorder shadow="md" className={scss.count_box} key={tab.id}>
            <div className={scss.card_wrapper}>
              <div className={scss.main_heading}>
                <Text c={tab.color} component="span">
                  {counts[tab.key] ?? <Loader />}
                </Text>
              </div>
              <div className={scss.title}>
                <Text c={tab.color} component="p" mb="1rem">
                  {tab.title}
                </Text>
              </div>
              {tab.title !== "Remaining" && (
                <Button
                  disabled={!counts[tab.key]}
                  color={tab.color}
                  onClick={() => router.push(tab.path!)}
                >
                  View List
                </Button>
              )}
              <div className={scss.footer_title}>
                <span className="flex justify-between gap-x-3">
                  {tab.footerEL && (
                    <Button
                      size="compact-sm"
                      className="tracking-wide"
                      color="pink.6"
                      disabled={ELCLCounts?.el_count == 0}
                    >
                      {tab.footerEL(ELCLCounts?.el_count)}
                    </Button>
                  )}
                  {tab.footerCL && (
                    <Button
                      size="compact-sm"
                      className="tracking-wide"
                      color="cyan.6"
                      disabled={ELCLCounts?.cl_count == 0}
                    >
                      {tab.footerCL(ELCLCounts?.cl_count)}
                    </Button>
                  )}
                  {tab.footerCOF && (
                    <Button
                      size="compact-sm"
                      className="tracking-wide"
                      color="violet.6"
                      disabled={ELCLCounts?.cof_count == 0}
                    >
                      {tab.footerCOF(ELCLCounts?.cof_count)}
                    </Button>
                  )}
                </span>
              </div>
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}

export default Home;
