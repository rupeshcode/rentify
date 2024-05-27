import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Leave Management System for Employees"
        />
        <link rel="icon" href="/rentify/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/rentify/assets/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
