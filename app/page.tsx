"use client";

import { AppProvider } from "./contexts/AppContext";
import App from "./components/App";

export default function Home() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
