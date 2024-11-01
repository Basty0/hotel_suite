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
  SelectGroup,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { updateChambre } from "@/api/chambres/chambreApi";
import { Pencil } from "lucide-react";

const chambreSchema = z.object({
  categorie_id: z.string().optional(),
  numero_chambre: z
    .string()
    .min(1, { message: "Le numéro de la chambre est requis." }),
  caracteristiques: z.string().optional(),
  image: z.any().optional(), // Accepte n'importe quel type pour le fichier
});

const UpdateChambreForm = ({ chambre, categorie, fetchChambre }) => {
  // Changement ici
  const form = useForm({
    resolver: zodResolver(chambreSchema),
    defaultValues: chambre, // Ajout des valeurs par défaut
  });
  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;
  const { toast } = useToast();

  const onSubmit = async (data) => {
    // Crée un nouvel objet FormData
    const formData = new FormData();

    // Ajoute l'image au FormData si elle est présente
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    // Ajoute les autres champs du formulaire
    formData.append("categorie_id", data.categorie_id);
    formData.append("numero_chambre", data.numero_chambre);
    formData.append("caracteristiques", data.caracteristiques || "");

    // Vérifiez le contenu de formData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      console.log(formData);
      if (formData !== null) {
        const response = await updateChambre(chambre.id, formData); // Mise à jour de la chambre
      }

      fetchChambre();
      toast({
        title: "Chambre mise à jour avec succès",
        description: "La chambre a été mise à jour avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi du formulaire :",
        error.response ? error.response.data : error.message
      );
      toast({
        title: "Erreur",
        description: error.response
          ? error.response.data.message
          : "Une erreur est survenue.",
        variant: "destructive",
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
          <DialogTitle>Chambre</DialogTitle>
          <DialogDescription>
            Mise à jour d'une Chambre ou salle
          </DialogDescription>
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
            Mettre à jour la chambre {/* Changement ici */}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChambreForm; // Changement ici
