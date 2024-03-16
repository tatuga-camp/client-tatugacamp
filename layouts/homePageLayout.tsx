import React, { useEffect, useState } from "react";
import MainNavbar from "../components/navbars/mainNavbar";
import { useQuery } from "@tanstack/react-query";
import { GetAllAnnouncementSanityService } from "../sanity/services";
import { Alert, AlertColor, AlertTitle } from "@mui/material";
function HomepageLayout({ children }: { children: React.ReactNode }) {
  const announcement = useQuery({
    queryKey: ["announcement"],
    queryFn: () => GetAllAnnouncementSanityService(),
  });

  return (
    <>
      <main>
        {announcement.data && (
          <Alert
            className=" sticky top-0 z-40  md:w-full"
            severity={announcement.data.type as AlertColor}
          >
            <AlertTitle>แจ้งข่าวสาร</AlertTitle>
            {announcement.data?.title} —{" "}
            <strong>{announcement.data?.description}</strong>
          </Alert>
        )}
        <MainNavbar />

        <section>{children}</section>
      </main>
    </>
  );
}

export default HomepageLayout;
