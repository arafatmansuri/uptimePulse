"use client";
import { useAuthQuery } from "@/lib/queries/authQueries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isLoading: isAuthLoading,
    isError: isAuthError,
    data: authData,
    isSuccess,
  } = useAuthQuery({
    endpoint: "/me",
  });
  const navigate = useRouter();
  useEffect(() => {
    if (!isAuthLoading && isAuthError) {
      navigate.push("/signin");
    }
  }, [isAuthLoading, isAuthError]);
  useEffect(() => {
    if (isSuccess && authData) {
      const user = authData.data.user;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [isSuccess, authData]);
  return <div className="w-full">{children}</div>;
}
