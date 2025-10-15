import { Barlow } from "next/font/google";
import "./globals.css"; // css của bạn
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";
import Header from "@/components/layout/Header";

// Import font Barlow
const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"], // thêm các độ đậm bạn cần
});

export const metadata = {
  title: "Explore Galery",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} font-sans antialiased`}>
        <Suspense >
          <AntdRegistry>
            <Header/>
            {children}
          </AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
