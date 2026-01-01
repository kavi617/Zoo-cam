"use client";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext({
  showToast: (msg: string, type?: "success" | "error" | "info") => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<null | { msg: string; type: string }>(
    null
  );

  function showToast(msg: string, type: "success" | "error" | "info" = "info") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-9999] px-6 py-3 rounded-lg shadow-lg text-base font-semibold transition bg-zinc-900 text-zinc-100 border ${
            toast.type === "success"
              ? "border-green-400 text-green-300"
              : toast.type === "error"
              ? "border-red-400 text-red-300"
              : "border-blue-400 text-blue-300"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}
