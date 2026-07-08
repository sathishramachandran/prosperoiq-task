import type { Metadata } from "next";
import { ReactNode } from "react";



const layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
