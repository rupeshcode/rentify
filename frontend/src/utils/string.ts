import { subMonths } from "date-fns";

export const clsx = (...classes: (string | false | null | undefined)[]) => {
  return classes.filter((cls): cls is string => !!cls).join(" ");
};

export const isNotBlank = (val: any): val is string =>
  typeof val === "string" && val.trim().length > 0;

export const isBlank = (val: any) => !isNotBlank(val);

export const convertToDatePickerFormat = (date: Date | string) => {
  if (typeof date === "string") {
    return date.split("/").reverse().join("-");
  } else {
    return date.toLocaleDateString("sv", { timeZone: "Asia/Kolkata" });
  }
};

export const convertBase64ToBlob = (base64Image: string) => {
  // Split into two parts
  const parts = base64Image.split(";base64,");
  // Hold the content type
  const imageType = parts[0].split(":")[1];
  // Decode Base64 string
  const decodedData = window.atob(parts[1]);
  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);
  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }
  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
};

export const isValidDate = (date: string) => !isNaN(Date.parse(date));

export const isRegularPunch = (punchIn: string, punchOut: string) => {
  const isValidPunchIn = isValidDate(punchIn);
  const isValidPunchOut = isValidDate(punchOut);
  const inTime = formatTime(punchIn, true);
  const outTime = formatTime(punchOut, true);
  return (
    (!isValidPunchIn && !isValidPunchOut) ||
    (isValidPunchIn &&
      isValidPunchOut &&
      inTime <= "10:35:00" &&
      outTime >= "18:09:00")
  );
};

export const getPunchDateRange = () => {
  const endDate = new Date();
  endDate.setDate(24);
  const startDate = subMonths(endDate, 1);
  startDate.setDate(25);
  return [
    startDate.toLocaleDateString("sv", { timeZone: "Asia/Kolkata" }),
    endDate.toLocaleDateString("sv", { timeZone: "Asia/Kolkata" }),
  ];
};

const dayDateMonthFormatter = new Intl.DateTimeFormat("en-IN", {
  hour12: false,
  weekday: "short",
  month: "long",
  day: "2-digit",
});

export const dayDateMonthFrom = (timestamp: Date | number | string) =>
  timestamp ? dayDateMonthFormatter.format(new Date(timestamp)) : "";

export const formatTime = (date: Date | string | number, withSeconds = false) =>
  new Date(date).toLocaleTimeString("sv", {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    timeZone: "Asia/Kolkata",
  });

export const readableDateFrom = (timestamp: Date | number | string) =>
  timestamp
    ? new Date(timestamp).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
