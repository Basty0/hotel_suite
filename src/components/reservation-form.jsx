"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { createReservationFromForm } from "@/api/reservations/reservationApi";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Ajoutez cet import

export function ReservationFormDialog({ rooms, clients, roomPrices }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Nouvelle réservation</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto">
        <ReservationFormComponent
          onClose={handleClose}
          rooms={rooms}
          clients={clients}
          roomPrices={roomPrices}
        />
      </DialogContent>
    </Dialog>
  );
}

function ReservationFormComponent({ onClose, rooms, clients, roomPrices }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dateArrivee, setDateArrivee] = useState();
  const [dateDepart, setDateDepart] = useState();
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [openClientSearch, setOpenClientSearch] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    contact: "",
    genre: "",
    dateNaissance: "",
    lieuNaissance: "",
    pieceIdentite: "",
    cin: "",
    profession: "",
    nationalite: "",
    nomPere: "",
    nomMere: "",
    email: "",
    age: "",
  });
  const [openNationalite, setOpenNationalite] = useState(false);
  const [nombreNuits, setNombreNuits] = useState(0);
  const [prixTotal, setPrixTotal] = useState(0);
  const [modePaiement, setModePaiement] = useState("");
  const [referencePaiement, setReferencePaiement] = useState("");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [statut, setStatut] = useState("");
  const [modeTransport, setModeTransport] = useState("");
  const [tarif, setTarif] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Ajoutez cet état

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

  // Filter rooms based on selected room type
  const filteredRooms = selectedRoomType
    ? rooms.filter(
        (room) =>
          room.categorie.toLowerCase() === selectedRoomType.toLowerCase()
      )
    : rooms;

  // Filter clients based on search input
  const filteredClients = clients
    ? clients.filter((client) =>
        `${client.nom} ${client.prenom}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (selectedClient) {
      // Update other form fields with selected client's information
      setClientInfo(selectedClient);
    }
  }, [selectedClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const clearClientSelection = () => {
    setSelectedClient(null);
    setClientInfo({
      nom: "",
      prenom: "",
      adresse: "",
      contact: "",
      genre: "",
      dateNaissance: "",
      lieuNaissance: "",
      pieceIdentite: "",
      cin: "",
      profession: "",
      nationalite: "",
      nomPere: "",
      nomMere: "",
      email: "",
      age: "",
    });
  };

  const router = useRouter();

  const handleNationaliteSelect = (value) => {
    setClientInfo((prev) => ({ ...prev, nationalite: value }));
    setOpenNationalite(false);
  };

  // Calculer le nombre de nuits et le prix total
  useEffect(() => {
    if (dateArrivee && dateDepart && selectedRoom) {
      const nights = differenceInDays(dateDepart, dateArrivee);
      setNombreNuits(nights > 0 ? nights : 0);

      const roomCategorie = rooms.find(
        (room) => room.id === selectedRoom
      )?.categorie;
      if (roomCategorie) {
        const prixParNuit = roomPrices[roomCategorie.toUpperCase()] || 0;
        setPrixTotal(prixParNuit * (nights > 0 ? nights : 0));
      }
    } else {
      setNombreNuits(0);
      setPrixTotal(0);
    }
  }, [dateArrivee, dateDepart, selectedRoom, rooms, roomPrices]);

  // Fonction pour formater le prix en Ariary
  const formatPrix = (prix) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
    }).format(prix);
  };

  const handleEnregistrer = async () => {
    setIsLoading(true); // Activez l'état de chargement

    let clientData;
    if (selectedClient) {
      clientData = {
        id: selectedClient.id,
        selectionne: true,
      };
    } else {
      clientData = {
        ...clientInfo,
        nom: clientInfo.nom || "Inconnu",
        prenom: clientInfo.prenom || "Inconnu",
        selectionne: false,
      };
    }

    const reservationData = {
      client: clientData,
      dateArrivee,
      dateDepart,
      nombreNuits,
      chambre: selectedRoom,
      prixTotal,
      modePaiement,
      referencePaiement:
        modePaiement === "especes" ? "CAISSE" : referencePaiement,
      articles: articles,
      statut,
      modeTransport,
      tarif,
      venantDe: document.getElementById("venant-de").value,
      allantA: document.getElementById("allant-a").value,
      natureVisa: document.getElementById("nature-visa").value,
      commentaire: document.getElementById("commentaire").value,
      montantAvance: document.getElementById("montant-avance").value,
      litsSupplementaires: document.getElementById("lits-supplementaires")
        .checked,
    };

    try {
      const response = await createReservationFromForm(reservationData);
      console.log("Réservation créée avec succès:", response.data);

      router.push(`/dashboard/factures/${response.data.reservation.id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);

      setErrorMessage(
        error.response?.data?.error ||
          "Une erreur est survenue lors de la création de la réservation."
      );
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false); // Désactivez l'état de chargement
    }
  };

  const handleAddArticle = () => {
    if (selectedArticle) {
      setArticles([...articles, selectedArticle]);
      setSelectedArticle("");
    }
  };

  const handleRemoveArticle = (index) => {
    const newArticles = articles.filter((_, i) => i !== index);
    setArticles(newArticles);
  };

  return (
    <Card className="w-full max-w-[1200px] mx-auto shadow-none border-none">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Enregistrer une réservation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold   p-2">
                INFORMATION SUR LA RESERVATION
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="date-arrivee">Date d'arrivée</Label>
                  <Calendar
                    mode="single"
                    selected={dateArrivee}
                    onSelect={setDateArrivee}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="date-depart">Date de départ</Label>
                  <Calendar
                    mode="single"
                    selected={dateDepart}
                    onSelect={setDateDepart}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label htmlFor="nombre-nuit">Nombre de Nuits</Label>
                  <Input
                    type="number"
                    id="nombre-nuit"
                    value={nombreNuits}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={statut} onValueChange={setStatut}>
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Choisissez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reserve">Réservé</SelectItem>
                      <SelectItem value="valide">Validé</SelectItem>
                      <SelectItem value="occupe">Occupé</SelectItem>
                      <SelectItem value="cloture">Clôturé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="venant-de">Venant de</Label>
                  <Input id="venant-de" />
                </div>
                <div>
                  <Label htmlFor="allant-a">Allant à</Label>
                  <Input id="allant-a" />
                </div>
                <div>
                  <Label htmlFor="nature-visa">Nature du VISA</Label>
                  <Input id="nature-visa" />
                </div>
                <div>
                  <Label htmlFor="mode-transport">Mode de Transport</Label>
                  <Select
                    value={modeTransport}
                    onValueChange={setModeTransport}
                  >
                    <SelectTrigger id="mode-transport">
                      <SelectValue placeholder="Choisissez une option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avion">Avion</SelectItem>
                      <SelectItem value="voiture">Voiture</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="commentaire">Commentaire</Label>
                <Textarea id="commentaire" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold   p-2">
                INFORMATION SUR LE CLIENT
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center space-x-2">
                  <div className="flex-grow">
                    <Label htmlFor="client-search">Recherche client</Label>
                    <Popover
                      open={openClientSearch}
                      onOpenChange={setOpenClientSearch}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openClientSearch}
                          className="w-full justify-between"
                        >
                          {selectedClient
                            ? `${selectedClient.nom} ${selectedClient.prenom}`
                            : "Rechercher un client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher un client..." />
                          <CommandList>
                            <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                            <CommandGroup>
                              {clients.map((client) => (
                                <CommandItem
                                  key={client.id}
                                  value={`${client.nom} ${client.prenom}`}
                                  onSelect={() => {
                                    setSelectedClient(client);
                                    setClientInfo(client);
                                    setOpenClientSearch(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedClient?.id === client.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {client.nom} {client.prenom}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {selectedClient && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearClientSelection}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={clientInfo.nom}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={clientInfo.prenom}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={clientInfo.adresse}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    disabled={!!selectedClient}
                    value={clientInfo.genre}
                    onValueChange={(value) =>
                      setClientInfo((prev) => ({ ...prev, genre: value }))
                    }
                  >
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Sélectionner le genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Homme">Homme</SelectItem>
                      <SelectItem value="Femme">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={clientInfo.contact}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="date-naissance">Date de naissance</Label>
                  <Input
                    id="date-naissance"
                    name="dateNaissance"
                    type="date"
                    value={clientInfo.dateNaissance}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="lieu-naissance">Lieu de Naissance</Label>
                  <Input
                    id="lieu-naissance"
                    name="lieuNaissance"
                    value={clientInfo.lieuNaissance}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="piece-identite">Pièce d'identité</Label>
                  <Input
                    id="piece-identite"
                    name="pieceIdentite"
                    value={clientInfo.pieceIdentite}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="cin">CIN</Label>
                  <Input
                    id="cin"
                    name="cin"
                    value={clientInfo.cin}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="profession">Profession (occupation)</Label>
                  <Input
                    id="profession"
                    name="profession"
                    value={clientInfo.profession}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="nationalite">Nationalité</Label>
                  <Popover
                    open={openNationalite}
                    onOpenChange={setOpenNationalite}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openNationalite}
                        className="w-full justify-between"
                        disabled={!!selectedClient}
                      >
                        {clientInfo.nationalite
                          ? frameworks.find(
                              (f) => f.value === clientInfo.nationalite
                            )?.label
                          : "Sélectionnez votre nationalité..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher une nationalité..." />
                        <CommandList>
                          <CommandEmpty>
                            Aucune nationalité trouvée.
                          </CommandEmpty>
                          <CommandGroup>
                            {frameworks.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={() =>
                                  handleNationaliteSelect(framework.value)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    clientInfo.nationalite === framework.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {framework.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="nom-pere">Nom du père</Label>
                  <Input
                    id="nom-pere"
                    name="nomPere"
                    value={clientInfo.nomPere}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="nom-mere">Nom de la mère</Label>
                  <Input
                    id="nom-mere"
                    name="nomMere"
                    value={clientInfo.nomMere}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="mail">Mail</Label>
                  <Input
                    id="mail"
                    name="email"
                    value={clientInfo.email}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    value={clientInfo.age}
                    onChange={handleInputChange}
                    readOnly={!!selectedClient}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold   p-2">
                LES CHAMBRES
              </h2>
              <div>
                <Label htmlFor="type-chambre">Type chambre</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedRoomType(value === "all" ? null : value);
                    setSelectedRoom(null); // Réinitialiser la chambre sélectionnée
                  }}
                >
                  <SelectTrigger id="type-chambre">
                    <SelectValue placeholder="Type de chambre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(roomPrices).map(([category, price]) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category} -{" "}
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "MGA",
                        }).format(price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-2 text-sm sm:text-base">
                  Veuillez sélectionner une chambre à réserver
                </p>
                <RadioGroup
                  value={selectedRoom || ""}
                  onValueChange={setSelectedRoom}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`relative cursor-pointer rounded-lg border p-4 ${
                          selectedRoom === room.id
                            ? "border-primary bg-primary/10"
                            : "border-input hover:border-primary"
                        }`}
                        onClick={() => setSelectedRoom(room.id)}
                      >
                        <RadioGroupItem
                          value={room.id}
                          id={room.id}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={room.id}
                          className={`block text-center ${
                            room.id === "CH201" ? "text-destructive" : ""
                          }`}
                        >
                          <span className="text-lg font-semibold">
                            CH{room.numero}
                          </span>
                          <br />
                          <span className="text-sm">{room.categorie}</span>
                        </Label>
                        {selectedRoom === room.id && (
                          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre-nuit">Nombre de Nuits</Label>
                  <Input
                    type="number"
                    id="nombre-nuit"
                    value={nombreNuits}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="prix-total">Prix Total</Label>
                  <Input
                    id="prix-total"
                    value={formatPrix(prixTotal)}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="tarif">Tarif</Label>
                  <Select value={tarif} onValueChange={setTarif}>
                    <SelectTrigger id="tarif">
                      <SelectValue placeholder="Journée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="journee">Journée</SelectItem>
                      <SelectItem value="nuit">Nuit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="montant-avance">Montant Avance</Label>
                  <Input id="montant-avance" />
                </div>
                <div>
                  <Label htmlFor="mode-paiement">Mode de paiement</Label>
                  <Select onValueChange={setModePaiement} value={modePaiement}>
                    <SelectTrigger id="mode-paiement">
                      <SelectValue placeholder="Choisissez le mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="mvola">MVola</SelectItem>
                      <SelectItem value="orange-money">Orange Money</SelectItem>
                      <SelectItem value="airtel-money">Airtel Money</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                      <SelectItem value="carte-bancaire">
                        Carte bancaire
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {modePaiement === "especes" ? (
                  <div>
                    <Label htmlFor="tresorerie">Trésorerie</Label>
                    <Input id="tresorerie" value="CAISSE" readOnly />
                  </div>
                ) : modePaiement && modePaiement !== "especes" ? (
                  <div>
                    <Label htmlFor="reference-paiement">
                      Référence Paiement
                    </Label>
                    <Input
                      id="reference-paiement"
                      value={referencePaiement}
                      onChange={(e) => setReferencePaiement(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lits-supplementaires" />
                <Label
                  htmlFor="lits-supplementaires"
                  className="text-sm sm:text-base"
                >
                  Ajouter des lits supplémentaires
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold   p-2">
                ARTICLES DE LA CHAMBRE
              </h2>
              <div className="flex space-x-2">
                <Select
                  value={selectedArticle}
                  onValueChange={setSelectedArticle}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisissez un article" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serviette">Serviette</SelectItem>
                    <SelectItem value="oreiller">Oreiller</SelectItem>
                    <SelectItem value="couverture">Couverture</SelectItem>
                    <SelectItem value="minibar">Minibar</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddArticle} disabled={!selectedArticle}>
                  Ajouter
                </Button>
              </div>
              {articles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Articles ajoutés :</h3>
                  <ul className="space-y-2">
                    {articles.map((article, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center /20 p-2 rounded border bg-primary/10"
                      >
                        <span>{article}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveArticle(index)}
                        >
                          Supprimer
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
            disabled={isLoading}
          >
            Fermer
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={handleEnregistrer}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer la réservation"
            )}
          </Button>
        </div>
      </CardContent>

      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsErrorModalOpen(false)}>Fermer</Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ReservationFormComponent;
