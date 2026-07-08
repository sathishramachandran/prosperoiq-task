import SignIn from "@/components/main_ui/Auth/SignIn";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <SignIn />
      </Suspense>
    </div>
  );
}
