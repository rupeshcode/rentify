import "@/styles/globals.css";
import { MantineProvider, createTheme } from "@mantine/core";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import "../styles/nprogress.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Toastify from "@/components/Toastify";
import { ModalsProvider } from "@mantine/modals";
import { Inter } from "next/font/google";
import Head from "next/head";

const Layout = dynamic(() => import("./../layouts/Layout"), { ssr: false });

export const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  fontFamily: `${inter.style.fontFamily}, sans-serif`,
  headings: { fontFamily: `${inter.style.fontFamily}, sans-serif` },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <>
      <Head>
        <title>Rentify</title>
        <meta name="description" content="Rentify" />
        <link rel="icon" href="/rentify/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/rentify/assets/favicon.png" />
      </Head>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Layout>
            <Toastify />
            <Component {...pageProps} />
          </Layout>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
