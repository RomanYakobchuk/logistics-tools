import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Suspense} from "react";
import {AuthProvider} from "@/lib/auth/auth-context";

import Header from "@/components/Header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Logistics Tools",
    description: "Collection of tools for logistics operations",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen`}>
        <AuthProvider>
            <Header/>
            <Suspense fallback={null}>
                <main className="container mx-auto px-4 py-8 overflow-hidden">
                    {children}
                </main>
            </Suspense>
        </AuthProvider>
        </body>
        </html>
    );
}