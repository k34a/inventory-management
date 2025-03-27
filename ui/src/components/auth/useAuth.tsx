"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const useAuth = (cookieName: string) => {
  const [token, setTokenState] = useState<string | null>(null);
  const cookies = new Cookies();
  const router = useRouter();

  useEffect(() => {
    setTokenState(cookies.get(cookieName) || null);
  }, []);

  const setToken = (newToken: string) => {
    cookies.set(cookieName, newToken, { path: "/", sameSite: "strict" });
    setTokenState(newToken);
  };

  const logout = ({ redirectTo }: { redirectTo: string }) => {
    cookies.remove(cookieName);
    setTokenState(null);
    redirectTo ? router.push(redirectTo) : router.refresh();
  };

  const redirectToLogin = () => {
    router.push("/login");
  };

  return { token, setToken, logout, redirectToLogin };
};

export default useAuth;
