"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation"; // Change this import
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { loginUser } from "@/api/authApi";

const formSchema = z.object({
  email: z.string().email({
    message: "l'email est requis.",
  }),
  password: z.string().min(2, {
    message: "le mot de passe est requis.",
  }),
});

const LoginForme = () => {
  const router = useRouter(); // Move this here
  const [showAlert, setShowAlert] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    loginUser(values).then((status) => {
      if (status === 200) {
        console.log("Connexion réussie");
        router.push("/dashboard");
      } else {
        console.log(status);
        console.log("Connexion échouée");
        setShowAlert(true);
      }
    });

    console.log(values);
  }

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 space-y-2"
      >
        <div className="flex flex-col gap-2 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...form.register("email")}
            placeholder="Email ou numéro de téléphone"
          />
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
            {...form.register("password")}
            placeholder="Mot de passe"
          />
          {form.formState.errors.password && (
            <p className="text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit">Se connecter</Button>
      </form>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Échec de connexion</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez vérifier vos informations de connexion et réessayer.
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

export default LoginForme;
