"use client";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  LineChart,
  CalendarRange,
  FileText,
  BedDouble,
  HandPlatter,
} from "lucide-react";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

export function SaidebareContent({ closeSidebar }) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    // Ferme le sidebar en mode mobile
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Home className="h-4 w-4" />
          Accueil
        </Link>
        <Link
          href="/dashboard/planning"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/planning"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <CalendarRange className="h-4 w-4" />
          Planning
        </Link>
        <Link
          href="/dashboard/client"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/client"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Clients
        </Link>
        <Link
          href="/dashboard/reservation"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/reservation"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Réservations
        </Link>
        <Link
          href="/dashboard/achat"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/achat"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Achats
        </Link>
        <Link
          href="/dashboard/chambre"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/chambre"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <BedDouble className="h-4 w-4" />
          Chambres
        </Link>
        <Link
          href="/dashboard/produit"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/produit"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <HandPlatter className="h-4 w-4" />
          Produits
        </Link>

        <Link
          href="/dashboard/utilisateur"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            pathname === "/dashboard/utilisateur"
              ? "bg-muted text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          Utilisateurs
        </Link>
      </nav>
    </>
  );
}
