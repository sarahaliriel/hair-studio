"use client";

import { useEffect } from "react";

export default function ScrollIndicator() {
  useEffect(() => {
    let timeout: any;

    const onScroll = () => {
      document.body.classList.add("scrolling");

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        document.body.classList.remove("scrolling");
      }, 1200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}