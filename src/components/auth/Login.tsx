"use client";

import { useEffect, useState } from "react";
import { Input, Button, Form, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { loginUser, LoginPayload } from "@/api/loginApi";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      router.replace("/"); 
    }
  }, [router]);

  const onFinish = async (values: LoginPayload) => {
    setLoading(true);
    try {
      const data = await loginUser(values); // dùng API riêng
      message.success("Đăng nhập thành công!");
      localStorage.setItem("currentUser", JSON.stringify({ userId: data.userId, email: values.email }));
      router.push("/");
    } catch (err) {
      message.error(err.message || "Đã có lỗi, thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-2/5 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: "", password: "" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
              <Button type="default" onClick={goToSignup} block>
                Đăng ký
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
