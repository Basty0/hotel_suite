"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProduit } from "@/api/produits/produitApi"; // Assurez-vous d'avoir cette fonction

export default function CreateProduitForm({ fetchProduits }) {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduit({ nom, prix: parseFloat(prix), description });
      fetchProduits();
      setOpen(false);
      setNom("");
      setPrix("");
      setDescription("");
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un produit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom
            </Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prix" className="text-right">
              Prix
            </Label>
            <Input
              id="prix"
              type="number"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button type="submit" className="ml-auto">
            Créer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
