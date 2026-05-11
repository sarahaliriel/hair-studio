"use client";

import { useEffect } from "react";

export default function ScrollIndicator() {
  useEffect(() => {
    let timeout: any;

    const activateScroll = () => {
      document.documentElement.classList.add("is-scrolling");

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 500);
    };

    const onScroll = () => {
      activateScroll();
    };

    const onTouchMove = () => {
      activateScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchmove", onTouchMove);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}