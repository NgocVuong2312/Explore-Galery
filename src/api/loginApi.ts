// src/api/LoginApi.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string | number;
  email: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch("/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Email hoặc mật khẩu không đúng");
  }

  return data;
}
