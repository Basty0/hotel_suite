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
import { createCategorie } from "@/api/categories/categorieApi";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const categorieSchema = z.object({
  nom: z.string().min(1, { message: "Le nom de la catégorie est requis." }),
  tarif: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Le tarif doit être un nombre supérieur à 0.",
    })
    .transform((value) => parseFloat(value)), // Transformation en nombre
  description: z.string().optional(),
});

const CreateCategorieForm = ({ fetcCategorie }) => {
  const form = useForm({ resolver: zodResolver(categorieSchema) });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const response = await createCategorie(data);
    if (response.status === 201) {
      toast({
        title: "Catégorie créée avec succès",
        description: "La catégorie a été créée avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
      fetcCategorie();
    } else {
      toast({
        title: "Erreur lors de la création de la catégorie", // Updated title
        description:
          "Une erreur s'est produite lors de la création de la catégorie.", // Updated description
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
        <DialogTrigger>Ajouter</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catégorie</DialogTitle>
          <DialogDescription>
            Création d'un Categorie d'une chambre
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom de la Catégorie</Label>
            <Input id="nom" {...form.register("nom")} />
            {errors.nom && <p className="text-red-500">{errors.nom.message}</p>}
          </div>

          <div>
            <Label htmlFor="tarif">Tarif</Label>
            <Input
              id="tarif"
              type="number"
              step="0.01"
              {...form.register("tarif")}
            />
            {errors.tarif && (
              <p className="text-red-500">{errors.tarif.message}</p>
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
            Créer une catégorie
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategorieForm;
