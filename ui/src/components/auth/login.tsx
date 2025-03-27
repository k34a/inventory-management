"use client";

import { useState } from "react";
import Input from "../input";
import { getAuthTokenOrErrors } from "@/utils/auth";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth("token");

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = await getAuthTokenOrErrors(username, password);
    if ("token" in data) {
      setToken(data.token);
      router.push("/");
    } else {
      setError(data);
    }
    setLoading(false);
  };

  return (
    <div className="w-11/12 max-w-[600px] mx-auto p-6 border border-gray-200 rounded-md shadow-md">
      <h1 className="text-lg font-bold text-center">Login</h1>
      <form className="grid grid-cols-1 gap-4" onSubmit={onSubmit}>
        <Input
          label="Username"
          fieldName="username"
          value={username}
          handleInputChange={(e) => {
            setUsername(e.target.value);
          }}
          disabled={loading}
          error={error.username}
        />
        <Input
          label="Password"
          fieldName="password"
          value={password}
          handleInputChange={(e) => {
            setPassword(e.target.value);
          }}
          disabled={loading}
          type="password"
          error={error.password}
        />
        <button
          type="submit"
          className="bg-blue-400 rounded-md p-2"
          disabled={loading}
        >
          Login
        </button>
        {error.message && (
          <div className="text-red-500 text-sm">{error.message}</div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
