"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { registerUser } from "@/api/api";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const formSchema = z
  .object({
    name: z.string().min(3, {
      message: "Le nom doit contenir au moins 3 caractères.",
    }),
    email: z.string().email({
      message: "L'email est requis.",
    }),
    password: z.string().min(8, {
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    }),
    confirmPassword: z.string().min(8, {
      message: "La confirmation du mot de passe est requise.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

const RegisterForme = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values) {
    registerUser(values).then((status) => {
      if (status === 200) {
        console.log("Inscription réussie");
        router.push("/dashboard");
      } else {
        console.log(status);
        console.log("Inscription échouée");
        setShowAlert(true);
      }
    });
  }

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 space-y-2"
      >
        <div className="flex flex-col gap-2 space-y-2">
          <Label htmlFor="name">name</Label>
          <Input id="name" {...form.register("name")} placeholder="name" />
          {form.formState.errors.name && (
            <p className="text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...form.register("email")} placeholder="Email" />
          {form.formState.errors.email && (
            <p className="text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            placeholder="Mot de passe"
          />
          {form.formState.errors.password && (
            <p className="text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
            placeholder="Confirmer le mot de passe"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit">S'inscrire</Button>
      </form>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Échec de l'inscription</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez vérifier votre téléphone ou email. Il est possible qu'il
              soit déjà utilisé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegisterForme;
