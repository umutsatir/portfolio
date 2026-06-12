"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "one-to-one-meeting" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#ff7800" },
          dark: { "cal-brand": "#ff7800" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="one-to-one-meeting"
      calLink="umutsatir/one-to-one-meeting"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        theme: "dark",
      }}
    />
  );
}
