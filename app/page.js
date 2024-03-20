import { Suspense } from "react";
import Login from "@/Components/Homepage/Login";
import HomePage from "@/Components/Homepage/HomePage";

export default function Home() {
  return (
    <Suspense>
      <main style={{ backgroundColor: "#EEEEEE" }}>
        <HomePage />
      </main>
    </Suspense>
  );
}
