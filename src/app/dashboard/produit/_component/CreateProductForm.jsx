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
import { createProduit } from "@/api/produits/produitApi";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  type_produit_id: z
    .string()
    .nonempty({ message: "Le type de produit est requis." }),
  nom: z.string().min(1, { message: "Le nom du produit est requis." }),
  description: z.string().optional(),
  prix: z
    .number()
    .positive({ message: "Le prix doit être un nombre supérieur à 0." }), // Utilisation de z.number()
});

const CreateProductForm = ({ fetchProduits, typesProduits }) => {
  const form = useForm({ resolver: zodResolver(productSchema) });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    // Convertir le prix en nombre
    data.prix = parseFloat(data.prix); // {{ edit_1 }}
    console.log(data);
    const response = await createProduit(data);
    if (response.status === 201) {
      toast({
        title: "Produit créée avec succès",
        description: "La Produit a été créée avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
      fetchProduits();
    } else {
      toast({
        title: "Erreur lors de la création de la Produit", // Updated title
        description:
          "Une erreur s'est produite lors de la création de la Produit.", // Updated description
        action: (
          <ToastAction className="bg-red-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
    }
  };
  console.log(typesProduits);
  return (
    <Dialog>
      <Button asChild className="border border-primary" variant="outline">
        <DialogTrigger>Ajouter</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Produit</DialogTitle>
          <DialogDescription>Création d'un produit</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="type_produit_id">Type de Produit</Label>
            <Select
              id="type_produit_id"
              value={form.watch("type_produit_id") || ""}
              onValueChange={(value) => form.setValue("type_produit_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {typesProduits.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nom}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type_produit_id && (
              <p className="text-red-500">{errors.type_produit_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nom">Nom du produit </Label>
            <Input id="nom" {...form.register("nom")} />
            {errors.nom && <p className="text-red-500">{errors.nom.message}</p>}
          </div>

          <div>
            <Label htmlFor="prix">Prix</Label>
            <Input
              id="prix"
              type="number"
              step="any" // pour permettre des nombres décimaux
              {...form.register("prix", { valueAsNumber: true })} // Utilisez valueAsNumber pour manipuler directement le type number
            />
            {errors.prix && (
              <p className="text-red-500">{errors.prix.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="resize-none  h-40"
              id="description"
              {...form.register("description")}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Créer un produit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;
