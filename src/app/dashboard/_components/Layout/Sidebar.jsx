"use client";
import { useState } from "react";
import Link from "next/link";
import { Package2, Bell, DollarSign, BedSingle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SaidebareContent } from "./SaidebareContent";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div
      className={`border-r bg-muted/40 md:block ${isOpen ? "block" : "hidden"}`}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BedSingle className="h-6 w-6" />
            <span className="">Hôtel </span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <SaidebareContent closeSidebar={closeSidebar} />
      </div>
    </div>
  );
}
