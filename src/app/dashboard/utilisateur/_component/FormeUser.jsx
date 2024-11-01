"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createUtilisateur } from "@/api/utilisateurs/utilisateurApi";
import { registerUser } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const userSchema = z.object({
  name: z.string().min(1, { message: "Le nom est obligatoire" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z
    .string()
    .min(4, { message: "Le mot de passe doit avoir au moins 8 caractères" }),
});

const FormeUser = ({ fetchUtilisateurs }) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const response = await registerUser(data);
    console.log("Form Data:", response);
    if (response === 201) {
      toast({
        title: "Utilisateurs créée avec succès",
        description: "La Utilisateurs a été créée avec succès.",
        action: (
          <ToastAction className="bg-green-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
      fetchUtilisateurs();
    } else {
      toast({
        title: "Erreur lors de la création de la Utilisateur  ", // Updated title
        description:
          "Une erreur s'est produit lors de la création de l'utilisateur.", // Updated description
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
          <DialogTitle>Utilisateurs </DialogTitle>
          <DialogDescription>Création d'un utilisateur</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Champ Name */}
          <div>
            <Label htmlFor="name">Nom de l'utilisateurs </Label>{" "}
            {/* Utiliser le composant Label */}
            <Input id="name" type="text" {...form.register("name")} />{" "}
            {/* Utiliser le composant Input */}
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Champ Email */}
          <div>
            <Label htmlFor="email">Email</Label>{" "}
            {/* Utiliser le composant Label */}
            <Input id="email" type="email" {...form.register("email")} />{" "}
            {/* Utiliser le composant Input */}
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Champ Password */}
          <div>
            <Label htmlFor="password">Mot de passe</Label>{" "}
            {/* Utiliser le composant Label */}
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />{" "}
            {/* Utiliser le composant Input */}
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Champ Remember Token (facultatif, généré par le backend) */}
          {/* Le remember_token est souvent généré automatiquement côté serveur, donc pas nécessaire dans le formulaire */}

          <div>
            <Button type="submit" className="w-full">
              {" "}
              {/* Utiliser le composant Button */}
              Créer l'utilisateur
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormeUser;
