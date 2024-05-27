import React from "react";
import scss from "./header.module.scss";
import { clsx } from "@/utils/string";
import { ROLE, useUserStore } from "@/stores/user-store";
import { FaCalendarAlt, FaPowerOff } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { LuTableProperties } from "react-icons/lu";
import {
  Button,
  Drawer,
  Menu,
  Modal,
  Title,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import Switch from "@/components/Switch/Switch";
import { FaKey } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import AddPropertyForm from "@/views/AddProperty";

function Header() {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const user = useUserStore.use.user();
  const [
    openedAddProperty,
    { open: openAddProperty, close: closeAddProperty },
  ] = useDisclosure(false);
  const [password, { open: openPassword, close: closePassword }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);

  const logout = () => {
    // window.localStorage.clear();
    window.sessionStorage.clear();
    window.open("/rentify/login", "_self");
  };
  const handleprofile = () => {
    router.push("/profile");
    close();
  };

  const handlepaswword = () => {
    openPassword();
    close();
  };

  return (
    <header>
      <div
        className={clsx(
          scss.header,
          "px-4 py-2 flex justify-between items-center"
        )}
        style={{
          backgroundColor: colorScheme == "light" ? "#F8F9FA" : "#2E2E2E",
        }}
      >
        <Title
          order={1}
          display="flex"
          className="items-center gap-1 tracking-wider font-normal cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          Rentify
        </Title>
        <div className={scss.header_content}>
          <span className={scss.header_switch}>
            <Switch />
          </span>

          <Drawer
            opened={opened}
            onClose={close}
            title={
              <>
                <div className="flex align-items-center justify-center">
                  <Switch />
                  <span className={scss.userrr}>{user?.username}</span>
                </div>
              </>
            }
            position="right"
            // size="60%"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          >
            <div className="flex flex-column my-4">
              <div className="flex flex-row align-items-center my-1">
                {user?.username ? (
                  <>
                    <FaPowerOff className="mx-2" size={15} />
                    <span onClick={logout}>Logout</span>
                  </>
                ) : (
                  <span onClick={() => router.push("/login")}>Login</span>
                )}
              </div>
            </div>
          </Drawer>

          <span className={scss.menuIcon} onClick={open}>
            <IoIosMenu size={30} />
          </span>

          <div className={scss.Header_Profile}>
            <div className="flex items-center p-1 rounded">
              {user?.roles[0]?.roleId == ROLE.SELLER && (
                <Tooltip label="Add Property">
                  <span onClick={openAddProperty}>
                    <LuTableProperties size={25} />
                  </span>
                </Tooltip>
              )}
              <Menu width="Target" shadow="md" withArrow>
                <Menu.Target>
                  <Button className="flex">
                    <span>{user?.username}</span>
                    <CgProfile className="mx-2" size={20} />
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  {user?.username ? (
                    <Menu.Item leftSection={<FaPowerOff />} onClick={logout}>
                      Logout
                    </Menu.Item>
                  ) : (
                    <Menu.Item onClick={() => router.push("/login")}>
                      Login
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Add Property"
        opened={openedAddProperty}
        onClose={closeAddProperty}
      >
        <AddPropertyForm />
      </Modal>
    </header>
  );
}

export default Header;
