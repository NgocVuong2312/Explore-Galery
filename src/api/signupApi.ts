// src/api/SignupApi.ts
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  userExist?: boolean;
  userId?: string | number;
}

export async function signupUser(payload: SignupPayload): Promise<SignupResponse> {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.userExist) {
    throw new Error("Tên hoặc email đã được sử dụng");
  }

  if (!res.ok) {
    throw new Error(data.error || "Đăng ký thất bại");
  }

  return data;
}
