import Switch from "@/components/Switch/Switch";
import { clsx } from "@/utils/string";
import { Title, useMantineColorScheme } from "@mantine/core";
import React from "react";
import scss from "./home-header.module.scss";
import { FaPowerOff } from "react-icons/fa6";

function HomeHeader() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <header
        className={clsx(
          scss.header,
          "px-3 py-2 flex justify-between items-center"
        )}
        style={{
          backgroundColor: colorScheme == "light" ? "#F8F9FA" : "#2E2E2E",
        }}
      >
        <Title
          order={1}
          display="flex"
          className="items-center gap-1 tracking-wider font-normal cursor-pointer"
        >
          Rentify
        </Title>
        <div className="flex items-center gap-3">
          <Switch />
        </div>
      </header>
    </>
  );
}

export default HomeHeader;
