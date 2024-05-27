import React from "react";
import scss from "./homefooter.module.scss";
const HomeFooter = () => {
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

export default HomeFooter;
