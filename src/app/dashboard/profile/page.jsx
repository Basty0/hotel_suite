"use client";
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("userToken");
        if (token) {
          const response = await getCurrentUser(token);
          setUser(response.data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div>Utilisateur non trouvé ou non connecté.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={user.name} readOnly />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly />
            </div>
            {/* Ajoutez d'autres champs si nécessaire */}
            <Button className="mt-4">Modifier le profil</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
