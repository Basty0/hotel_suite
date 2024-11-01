"use client";
import React, { useState, useEffect } from "react";
import PrePage from "./PrePage";
import { getClientById } from "@/api/clients/clientApi";
import { Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AchatClient from "./_component/AchatClient";

const Page = ({ params }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchClient = async () => {
    try {
      const response = await getClientById(params.client); // Utilisation correcte de params
      console.log(response);
      setClient(response.data); // Mise à jour de l'état client
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);
  return (
    <div>
      <div className="">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-16 h-16 animate-spin" />
          </div>
        ) : (
          client && (
            <div className="flex flex-row items-center gap-3">
              <div className="bg-secondary rounded-full p-4 border-2">
                <User className="w-16 h-16" />
              </div>
              <div>
                <p>Nom: {client.nom}</p>
                <p>Prénom: {client.prenom}</p>
                <p>Email: {client.email}</p>
                <p>Contact: {client.contact}</p>
              </div>
            </div>
          )
        )}
        <div className="flex flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              /* Modifier logic */
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
          </Button>
          <Button variant="destructive">Supprimer le client</Button>
        </div>
      </div>
      <Tabs defaultValue="reservation" className="mt-5">
        <TabsList>
          <TabsTrigger value="reservation">
            Les réservations du client
          </TabsTrigger>
          <TabsTrigger value="achat">Les achats du client</TabsTrigger>
        </TabsList>

        <TabsContent value="achat">
          <AchatClient />
        </TabsContent>
        <TabsContent value="reservation">
          <PrePage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
