import React, { useEffect, useState } from "react";
import MainNavbar from "../components/navbars/mainNavbar";
function HomepageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <MainNavbar />
        <section>{children}</section>
      </main>
    </>
  );
}

export default HomepageLayout;
