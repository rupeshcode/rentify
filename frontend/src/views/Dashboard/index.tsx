import React from "react";
import { ROLE, useUserStore } from "@/stores/user-store";
import scss from "./dashboard.module.scss";
import { useRouter } from "next/router";
import BuyerDashboard from "../BuyerDashboard";
import SellerDashboard from "../SellerDashboard";

function Dashboard() {
  const user = useUserStore.use.user();

  return user?.roles[0]?.roleId == ROLE.SELLER ? (
    <SellerDashboard />
  ) : (
    <BuyerDashboard />
  );
}

export default Dashboard;
