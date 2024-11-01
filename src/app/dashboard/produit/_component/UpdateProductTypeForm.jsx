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
import { updateTypeProduit } from "@/api/typeProduit/typeProduitApi"; // Assurez-vous que cette importation est correcte
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const productTypeSchema = z.object({
  id: z.string().min(1, { message: "L'ID est requis." }),
  nom: z.string().min(1, { message: "Le nom est requis." }),
  description: z.string().optional(),
});

const UpdateProductTypeForm = ({ initialData, fetchTypesProduits }) => {
  const form = useForm({
    resolver: zodResolver(productTypeSchema),
    defaultValues: initialData,
  });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    console.log("submite"); // Vérifiez si ce message s'affiche dans la console
    const response = await updateTypeProduit(data.id, data);
    if (response.status === 201) {
      toast({
        title: "Type de produit mis à jour avec succès",
        description: "Le type de produit a été mis à jour avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
      fetchTypesProduits(); // Rafraîchir la liste des types de produits
    } else {
      toast({
        title: "Erreur lors de la mise à jour du type de produit",
        description:
          "Une erreur s'est produite lors de la mise à jour du type de produit.",
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
        <DialogTrigger>Modifier</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier Type de Produit</DialogTitle>
          <DialogDescription>
            Modification d'un type de produit existant
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom du type</Label>
            <Input id="nom" {...form.register("nom")} />
            {errors.nom && <p className="text-red-500">{errors.nom.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="resize-none h-40"
              id="description"
              {...form.register("description")}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Mettre à jour le type de produit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductTypeForm;
