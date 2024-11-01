import { Toaster } from "@/components/ui/toaster";
import Autorisation from "./_components/Layout/Autorisation";
import { Header } from "./_components/Layout/Header";
import { Sidebar } from "./_components/Layout/Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Autorisation>
          <Sidebar />
          <div className="flex flex-col h-screen w-full md:w-[calc(100vw-220px)] lg:w-[calc(100vw-280px)]">
            <Header />

            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
              {children}
            </main>
          </div>
          <Toaster />
        </Autorisation>
      </div>
    </>
  );
}
