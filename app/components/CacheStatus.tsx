"use client";

import React, { useEffect, useState } from "react";
import { cacheManager } from "../utils/cacheManager";

export default function CacheStatus() {
  const [cacheStats, setCacheStats] = useState({
    totalCaches: 0,
    totalEntries: 0,
    cacheNames: [],
  });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStats = async () => {
      const stats = await cacheManager.getCacheStats();
      setCacheStats(stats);
    };

    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Update stats on mount
    updateStats();

    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000);

    // Listen for online/offline changes
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const clearAllCaches = async () => {
    await cacheManager.clearAllCaches();
    const stats = await cacheManager.getCacheStats();
    setCacheStats(stats);
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`}
        />
        <span>{isOnline ? "Online" : "Offline"}</span>
      </div>
      <div className="text-gray-300">
        <div>Caches: {cacheStats.totalCaches}</div>
        <div>Entries: {cacheStats.totalEntries}</div>
      </div>
      <button
        onClick={clearAllCaches}
        className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
      >
        Clear Cache
      </button>
    </div>
  );
}
