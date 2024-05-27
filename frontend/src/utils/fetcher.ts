import axios, { AxiosError, AxiosRequestConfig, CanceledError } from "axios";
import { getFingerprint } from "./fingerprint";
import { toast } from "react-toastify";
import { getToken } from "./token";
import { d, e } from "./crypto";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = async (
  url: string,
  method: string,
  data?: any,
  signal?: AbortSignal
) => {
  const token = getToken();
  let headers = {};
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
      fp: getFingerprint(),
    };
  }
  const config: AxiosRequestConfig = {
    method,
    headers,
    data,
    signal,
  };
  if (config.data) {
    config.data = { data: await e(data as object) };
  }

  try {
    const result = await axios(`${API_BASE_URL}${url}`, config);
    const response = result?.data?.data;
    if (response == null) {
      throw new Error(JSON.stringify(response));
    }
    const decData = await d(response);
    return JSON.parse(decData);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error instanceof CanceledError) {
        return;
      }
      // console.log("error", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Network Error!!!");
      }
      if (error.response?.status == 401) {
        // alert("Network Authentication Error");
        // window.localStorage.clear();
        window.sessionStorage.clear();
        window.open("/rentify/login", "_self");
      } else {
        if (error.response?.data.error) {
          throw new Error(error.response?.data.error);
        } else {
          throw new Error(error.response?.data);
        }
      }
    }
  }
};

export default fetcher;
