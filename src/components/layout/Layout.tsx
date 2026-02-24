import type { ReactNode } from "react";
// import Header from './Header'
import { Header } from "../Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* <Header title={title} /> */}
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
