"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SyncLoader } from "react-spinners";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    const url = `${pathname}?${searchParams}`;

    return () => {
      setLoading(false);
    };
  }, [pathname, searchParams]);

  return loading ? (
    <Suspense
      fallback={
        <div className="sweet-loading">
          <SyncLoader color={"#222831"} size={15} margin={5} />
        </div>
      }
    >
      <div className="sweet-loading">
        <SyncLoader color={"#726a95"} size={15} margin={5} />
      </div>
    </Suspense>
  ) : null;
}
