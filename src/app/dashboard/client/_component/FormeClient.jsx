"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { createUser, getNationalities } from "@/api/api"; // Assuming API calls for user creation and fetching nationalities
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/api/clients/clientApi";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  genre: z.enum(["Homme", "Femme"]).optional(),
  adresse: z.string().optional(),
  date_naissance: z.string().optional(),
  lieu_naissance: z.string().optional(),
  profession: z.string().optional(),
  nationalite: z.string().optional(),
  piece_identite: z.string().optional(),
  numero_piece_identite: z.string().optional(),
  contact: z.string().min(10).optional(),
  email: z.string().email().optional(),
});

const FormeClient = () => {
  const [nationalities, setNationalities] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const form = useForm({ resolver: zodResolver(userSchema) });
  const { formState } = form;
  const { isSubmitting } = formState;
  const { toast } = useToast();

  // Remplacer la récupération des nationalités par un tableau statique d'exemples
  const nationalitiesData = [
    "Française",
    "Allemande",
    "Italienne",
    "Espagnole",
    "Portugaise",
    "Néerlandaise",
    "Belge",
    "Suédoise",
    "Danoise",
    "Finlandaise",
  ];

  useEffect(() => {
    setNationalities(nationalitiesData); // Utiliser les nationalités statiques
  }, []);

  const onSubmit = async (values) => {
    try {
      const response = await createClient(values); // Corrected to use createUser
      console.log(values);
      if (response.status === 201) {
        toast({
          title: "Client créé avec succès", // Updated title
          description: "Le client a été créé avec succès.", // Updated description
          action: (
            <ToastAction
              className="bg-green-700"
              altText="Goto schedule to undo"
            >
              Fermé{" "}
            </ToastAction>
          ),
        });
        // Optionally fetch user data or reset form here
      } else {
        toast({
          title: "Erreur lors de la création du client", // Updated title
          description:
            "Une erreur s'est produite lors de la création du client.", // Updated description
          action: (
            <ToastAction className="bg-red-700" altText="Goto schedule to undo">
              Fermé{" "}
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      console.error(error); // Added error handling
      toast({
        title: "Erreur inattendue", // New title for unexpected errors
        description: "Une erreur s'est produite. Veuillez réessayer.", // New description
        action: (
          <ToastAction className="bg-red-700" altText="Goto schedule to undo">
            Fermé{" "}
          </ToastAction>
        ),
      });
    }
  };

  const frameworks = [
    { value: "Française", label: "Française" },
    { value: "Allemande", label: "Allemande" },
    { value: "Italienne", label: "Italienne" },
    { value: "Espagnole", label: "Espagnole" },
    { value: "Portugaise", label: "Portugaise" },
    { value: "Néerlandaise", label: "Néerlandaise" },
    { value: "Belge", label: "Belge" },
    { value: "Suédoise", label: "Suédoise" },
    { value: "Danoise", label: "Danoise" },
    { value: "Finlandaise", label: "Finlandaise" },
  ];

  const ComboboxDemo = ({ onSelect }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const handleSelect = (currentValue) => {
      setValue(currentValue === value ? "" : currentValue);
      setOpen(false);
      onSelect(currentValue); // Call the onSelect prop to pass the selected value
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className=" justify-between"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Sélectionnez votre nationalité..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command>
            <CommandInput placeholder="Rechercher une nationalité..." />
            <CommandList>
              <CommandEmpty>Aucune nationalité trouvée.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => handleSelect(framework.value)}
                  >
                    <Check
                      className={
                        value === framework.value
                          ? "mr-2 h-4 w-4 opacity-100"
                          : "mr-2 h-4 w-4 opacity-0"
                      }
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 space-y-2"
      >
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className=" space-y-3">
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                {...form.register("nom")}
                // placeholder="Entrez votre nom"
              />
              {form.formState.errors.nom && (
                <p className="text-red-500">
                  {form.formState.errors.nom.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                {...form.register("prenom")}
                // placeholder="Entrez votre prénom"
              />
              {form.formState.errors.prenom && (
                <p className="text-red-500">
                  {form.formState.errors.prenom.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                onValueChange={(value) => form.setValue("genre", value)} // Cette ligne est cruciale
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genres</SelectLabel>
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.formState.errors.genre && (
                <p className="text-red-500">
                  {form.formState.errors.genre.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                {...form.register("adresse")}
                // placeholder="Entrez votre adresse"
              />
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="date_naissance">Date de Naissance</Label>
              <Input
                type="date"
                id="date_naissance"
                {...form.register("date_naissance")}
                // placeholder="Sélectionnez votre date de naissance"
              />
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="lieu_naissance">Lieu de Naissance</Label>
              <Input
                id="lieu_naissance"
                {...form.register("lieu_naissance")}
                // placeholder="Entrez votre lieu de naissance"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                {...form.register("profession")}
                // placeholder="Entrez votre profession"
              />
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="nationalite">Nationalité</Label>
              <ComboboxDemo
                onSelect={(selectedValue) =>
                  form.setValue("nationalite", selectedValue)
                }
              />
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="piece_identite">Pièce d'Identité</Label>
              <Input
                id="piece_identite"
                {...form.register("piece_identite")}
                // placeholder="Entrez votre pièce d'identité"
              />
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="numero_piece_identite">
                Numéro de Pièce d'Identité
              </Label>
              <Input
                id="numero_piece_identite"
                {...form.register("numero_piece_identite")}
                // placeholder="Entrez le numéro de votre pièce d'identité"
              />
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                {...form.register("contact")}
                // placeholder="Entrez votre numéro de contact"
              />
              {form.formState.errors.contact && (
                <p className="text-red-500">
                  {form.formState.errors.contact.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...form.register("email")}
                // placeholder="Entrez votre email"
              />
              {form.formState.errors.email && (
                <p className="text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          Soumettre
        </Button>
      </form>
      {showSuccessDialog && (
        <p className="text-green-500">Utilisateur créé avec succès!</p>
      )}
    </div>
  );
};

export default FormeClient;
