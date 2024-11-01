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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { createChambre } from "@/api/chambres/chambreApi";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const chambreSchema = z.object({
  categorie_id: z.string().optional(),
  numero_chambre: z
    .string()
    .min(1, { message: "Le numéro de la chambre est requis." }),
  caracteristiques: z.string().optional(),
  image: z
    .any() // Accepte n'importe quel type pour le fichier
    .optional(),
});

const CreateChambreForm = ({ categorie, fetchChambre }) => {
  const form = useForm({ resolver: zodResolver(chambreSchema) });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Ajoute l'image au FormData
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    // Ajoute les autres champs du formulaire
    formData.append("categorie_id", data.categorie_id);
    formData.append("numero_chambre", data.numero_chambre);
    formData.append("caracteristiques", data.caracteristiques || "");

    try {
      const response = await createChambre(formData);

      fetchChambre();
      toast({
        title: "Catégorie créée avec succès",
        description: "La catégorie a été créée avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
  };

  return (
    <Dialog>
      <Button asChild className="border border-primary" variant="outline">
        <DialogTrigger>Ajouter</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chambre</DialogTitle>
          <DialogDescription>Création d'une Chambre ou salle</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="categorie_id">Catégorie</Label>
            <Select
              id="categorie_id"
              value={form.watch("categorie_id")}
              onValueChange={(value) => form.setValue("categorie_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categorie.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numero_chambre">Numéro de la Chambre</Label>
            <Input id="numero_chambre" {...form.register("numero_chambre")} />
            {errors.numero_chambre && (
              <p className="text-red-500">{errors.numero_chambre.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...form.register("image")} // Utilise le register de react-hook-form pour récupérer l'image
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="caracteristiques">Caractéristiques</Label>
            <Textarea
              className="resize-none h-40"
              id="caracteristiques"
              {...form.register("caracteristiques")}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Créer une chambre
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChambreForm;
