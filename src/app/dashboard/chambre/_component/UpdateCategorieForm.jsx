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
import { updateCategorie } from "@/api/categories/categorieApi"; // Assurez-vous que cette fonction existe
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

const categorieSchema = z.object({
  nom: z.string().min(1, { message: "Le nom de la catégorie est requis." }),
  tarif: z
    .string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Le tarif doit être un nombre supérieur à 0.",
    })
    .transform((value) => parseFloat(value)),
  description: z.string().optional(),
});

const UpdateCategorieForm = ({ categorie, fetchCategorie }) => {
  // Changement ici
  const form = useForm({
    resolver: zodResolver(categorieSchema),
    defaultValues: categorie,
  });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const response = await updateCategorie(categorie.id, data); // Mise à jour de la catégorie
    if (response.status === 200) {
      toast({
        title: "Catégorie mise à jour avec succès",
        description: "La catégorie a été mise à jour avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
      fetchCategorie();
    } else {
      toast({
        title: "Erreur lors de la mise à jour de la catégorie", // Mise à jour du titre
        description:
          "Une erreur s'est produite lors de la mise à jour de la catégorie.", // Mise à jour de la description
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
      <Button size="icon" variant="outline">
        <DialogTrigger>
          <Pencil className="h-4 w-4" />
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catégorie</DialogTitle>
          <DialogDescription>
            Mise à jour d'une Catégorie d'une chambre
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
            Mettre à jour la catégorie {/* Changement ici */}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategorieForm; // Changement ici
