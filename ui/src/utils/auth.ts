const BASE_URL = "http://localhost:8000";

type AuthErrors = Record<string, string>;
type AuthResponse = { token: string };

const getAuthTokenOrErrors = async (
  username: string,
  password: string
): Promise<AuthErrors | AuthResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await res.json();
  return data;
};

interface RegistrationSuccessfulResponse {
  token: string;
  message: string;
}

const getAuthTokenOrRegistrationErrors = async (
  username: string,
  password: string
): Promise<AuthErrors | RegistrationSuccessfulResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await res.json();
  return data;
};

export { getAuthTokenOrErrors, getAuthTokenOrRegistrationErrors };
