import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/context/AuthContext";
import { SidebarProvider } from "@/components/context/SidebarContext";
import { ThemeProvider } from "@/components/context/ThemeContext";
import TanstackProvider from "../../providers/TanstackProvider";
import MainLayout from "@/components/mainLayout/MainLayout";
import { Toaster } from "sonner";
export const metadata = {
  title: "My App",
  icons: {
    icon: "/favicon.ico",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
           <TanstackProvider>
        <SidebarProvider>

      <ThemeProvider>
         <AuthProvider role={"user"}>
  <Toaster />
      <MainLayout>{children}</MainLayout>
         </AuthProvider>
         </ThemeProvider>
           </SidebarProvider>
           </TanstackProvider>
      </body>
    </html>
  );
}
