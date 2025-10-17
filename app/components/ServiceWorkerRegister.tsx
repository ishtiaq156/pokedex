"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Service worker registered successfully
        })
        .catch((error) => {
          // Service worker registration failed
        });
    }
  }, []);

  return null; // This component doesn't render anything
}
