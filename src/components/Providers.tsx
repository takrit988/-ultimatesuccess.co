"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "../context/LanguageContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
};
