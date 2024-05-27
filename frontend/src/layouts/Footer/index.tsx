import React from "react";
import { MdCopyright } from "react-icons/md";
import scss from "./footer.module.scss";
import { clsx } from "@/utils/string";

const Footer = () => {
  return (
    <footer className={scss.footer_main}>
      <div className={scss.footerpage}>
        <span>Rentify</span>
        <span className="flex items-center">
          {/* <span>TM </span>
          <MdCopyright className={clsx(scss.icon_footer, "mx-1")} /> */}
          <span className="mx-1">{new Date().getFullYear()}</span>
          <span> - All Rights Reserved</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
