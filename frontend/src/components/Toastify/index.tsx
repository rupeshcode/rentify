import React from "react";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toastify = () => (
  <ToastContainer
    position="bottom-center"
    autoClose={4000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss={false}
    draggable="mouse"
    pauseOnHover
    theme="colored"
    transition={Slide}
  />
);

export default Toastify;
