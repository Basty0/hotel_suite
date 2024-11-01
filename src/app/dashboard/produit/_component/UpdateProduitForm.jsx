"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateProduit } from "@/api/produits/produitApi"; // Assurez-vous que cette importation est correcte
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  id: z.string().min(1, { message: "L'ID est requis." }),
  nom: z.string().min(1, { message: "Le nom du produit est requis." }),
  description: z.string().optional(),
  prix: z
    .number()
    .positive({ message: "Le prix doit être un nombre supérieur à 0." }),
});

const UpdateProduitForm = ({ initialData, fetchProduits }) => {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const response = await updateProduit(data.id, data);
    if (response.status === 200) {
      toast({
        title: "Produit mis à jour avec succès",
        description: "Le produit a été mis à jour avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
      fetchProduits(); // Rafraîchir la liste des produits
    } else {
      toast({
        title: "Erreur lors de la mise à jour du produit",
        description:
          "Une erreur s'est produite lors de la mise à jour du produit.",
        action: (
          <ToastAction className="bg-red-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
    }
  };

  return (
    <Dialog>
      <Button asChild className="border border-primary" variant="outline">
        <DialogTrigger>Modifier </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier Produit</DialogTitle>
          <DialogDescription>
            Modification d'un produit existant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom du produit</Label>
            <Input id="nom" {...form.register("nom")} />
            {errors.nom && <p className="text-red-500">{errors.nom.message}</p>}
          </div>

          <div>
            <Label htmlFor="prix">Prix</Label>
            <Input
              id="prix"
              type="number"
              step="any"
              {...form.register("prix", { valueAsNumber: true })} // Utilisez valueAsNumber pour manipuler directement le type number
            />
            {errors.prix && (
              <p className="text-red-500">{errors.prix.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="resize-none h-40"
              id="description"
              {...form.register("description")}
            />
          </div>

          <Button className="w-full" type="submit">
            Mettre à jour le produit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProduitForm;
