import { Barlow } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";

// Import font Barlow
const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"], // thêm các độ đậm bạn cần
});
export const metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} font-sans antialiased`}>
        <Suspense>
          <AntdRegistry>{children}</AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
