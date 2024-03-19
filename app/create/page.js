'use client'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreateForm } from "@/Components/CreateForm";
import { SyncLoader } from "react-spinners";
import { Suspense } from "react";

export default function Create() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading")
    return (
      <div className="sweet-loading">
        <SyncLoader color={"#222831"} size={15} margin={5} />
      </div>
    );

  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <Suspense>
      <CreateForm />;
    </Suspense>
  );
}
