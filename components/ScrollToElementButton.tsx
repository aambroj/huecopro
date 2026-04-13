"use client";

import type { ReactNode } from "react";

type ScrollToElementButtonProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

export default function ScrollToElementButton({
  targetId,
  className = "",
  children,
}: ScrollToElementButtonProps) {
  function handleClick() {
    const element = document.getElementById(targetId);

    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 24;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });

      window.history.replaceState(null, "", `#${targetId}`);
      return;
    }

    window.location.hash = targetId;
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
