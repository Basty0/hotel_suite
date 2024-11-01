"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/api/authApi";

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/auth/login"); // Redirige vers la page de connexion après la déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/dashboard">
              <span className="text-xl font-bold text-gray-800">Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/profile">
              <Button variant="ghost">Profil</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
