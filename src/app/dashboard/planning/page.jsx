"use client";
import React, { useState, useEffect } from "react";
import CalendarApp from "./_components/CalendarApp";
import { ReservationFormDialog } from "@/components/reservation-form";
import { getCategorieWithTarifs } from "@/api/categories/categorieApi";
import { getChambreSimple } from "@/api/chambres/chambreApi";
import { getClientFormated } from "@/api/clients/clientApi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [roomPrices, setRoomPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, chambresResponse, clientsResponse] =
          await Promise.all([
            getCategorieWithTarifs(),
            getChambreSimple(),
            getClientFormated(),
          ]);

        const categoriesData = categoriesResponse.data;

        setRoomPrices(categoriesData);

        setRooms(chambresResponse.data);
        setClients(clientsResponse.data);

        // Log the received data
        console.log("Categories data:", categoriesData);
        console.log("Rooms data:", chambresResponse.data);
        console.log("Clients data:", clientsResponse.data);
        console.log("Room prices:", prices);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container ">
      <div className="my-2">
        <ReservationFormDialog
          rooms={rooms}
          clients={clients}
          roomPrices={roomPrices}
        />
      </div>
      <CalendarApp />
    </div>
  );
};

export default Page;
