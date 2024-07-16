import { Button, Drawer, FocusTrap, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import scss from "./tech.module.scss";
const Technical = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Focus demo">
        <TextInput label="First input" placeholder="First input" />
        <TextInput
          data-autofocus
          label="Input with initial focus"
          placeholder="It has data-autofocus attribute"
          mt="md"
        />
      </Drawer>
      <Button onClick={open}>Open drawer</Button>
      <div className={scss.animate_class}>Hello Animate me</div>
    </>
  );
};

export default Technical;
