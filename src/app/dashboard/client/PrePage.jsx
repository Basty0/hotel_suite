import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import FormeClient from "./_component/FormeClient";
import ListeClient from "./_component/ListeCLient";
const PrePage = () => {
  return (
    <div>
      <div className="my-3 py-3">
        <Tabs defaultValue="liste" className="w-[100%]">
          <TabsList>
            <TabsTrigger value="liste">Liste des clients</TabsTrigger>
            <TabsTrigger value="ajout">Ajouter un client</TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="liste">
              <ListeClient />
            </TabsContent>
            <TabsContent value="ajout">
              <FormeClient />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default PrePage;
