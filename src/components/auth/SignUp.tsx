"use client";

import { useState } from "react";
import { Input, Button, Form, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { signupUser, SignupPayload } from "@/api/signupApi";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: SignupPayload) => {
    setLoading(true);
    try {
      await signupUser(values); // gọi API riêng
      message.success("Đăng ký thành công! Chuyển sang trang login...");
      setTimeout(() => router.push("/auth/login"), 1000);
    } catch (err: any) {
      message.error(err.message || "Đã có lỗi, thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-2/5 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Nhập tên" }]}
          >
            <Input placeholder="Tên" />
          </Form.Item>
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
                Sign Up
              </Button>
              <Button type="default" onClick={goToLogin} block>
                Đăng nhập
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
