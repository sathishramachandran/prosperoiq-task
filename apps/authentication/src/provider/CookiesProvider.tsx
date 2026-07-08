"use client";
import React from "react";
import { CookiesProvider } from "react-cookie";

const ReactCookiesProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      {children}
    </CookiesProvider>
  );
};

export default ReactCookiesProvider;
