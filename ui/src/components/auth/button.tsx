"use client";

import useAuth from "./useAuth";

const AuthButton = () => {
  const { token, logout, redirectToLogin } = useAuth("token");

  if (!token) {
    return (
      <button
        onClick={() => redirectToLogin()}
        className="py-2 px-3 rounded-md bg-green-600 text-white"
      >
        Log in
      </button>
    );
  }

  return (
    <button
      onClick={() => logout({ redirectTo: "/" })}
      className="py-2 px-3 rounded-md bg-green-600 text-white"
    >
      Log Out
    </button>
  );
};

export default AuthButton;
