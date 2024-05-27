import React from "react";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { ActionIcon } from "@mantine/core";

const Backbutton = () => {
  const router = useRouter();
  return (
    <ActionIcon variant="subtle" size="lg" color="dark" onClick={() => router.back()}>
      <IoIosArrowBack size={25} />
    </ActionIcon>
  );
};

export default Backbutton;
