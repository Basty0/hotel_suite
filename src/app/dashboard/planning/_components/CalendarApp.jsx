"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CalendarArrowDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { getReservationsParDate } from "@/api/reservations/reservationApi";
import { getChambresListe } from "@/api/chambres/chambreApi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ReservationInfo from "./ReservationInfo";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  isToday,
  startOfDay,
  subDays,
  endOfDay,
  addDays,
  isWithinInterval,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ReservationStatus = {
  RESERVE: "réserve",
  VALIDE: "validé",
  OCCUPE: "occupé",
  CLOTURE: "clôturé",
};

const statusColors = {
  [ReservationStatus.RESERVE]: "bg-blue-500",
  [ReservationStatus.VALIDE]: "bg-green-500",
  [ReservationStatus.OCCUPE]: "bg-red-500",
  [ReservationStatus.CLOTURE]: "bg-gray-500",
};

const CalendarApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("year");
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [date, setDate] = useState(new Date());
  const scrollRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [visibleDateRange, setVisibleDateRange] = useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (viewMode === "year") {
      const today = new Date();
      scrollToDate(today);
    } else if (viewMode === "month") {
      scrollToMiddleOfMonth(selectedDate);
    }
  }, [viewMode, reservations, selectedDate]);

  const fetchRooms = async () => {
    try {
      const response = await getChambresListe();
      const roomList = response.data.map((room) => `CH${room.numero_chambre}`);
      setRooms(roomList.sort());
      console.log("Fetched rooms:", roomList);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchReservations = async (date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM");
      const response = await getReservationsParDate(formattedDate);
      console.log("Fetched reservations:", response.data);
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
    fetchReservations(newDate);
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(
      start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1)
    );
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      dates.push({
        date: day.toISOString().split("T")[0],
        formatted: day.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
      });
    }
    return dates;
  };

  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push({
        date: d.toISOString().split("T")[0],
        formatted: d.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "2-digit",
        }),
      });
    }
    return dates;
  };

  const getYearDates = (date) => {
    const year = date.getFullYear();
    const startDate = startOfYear(date);
    const endDate = endOfYear(date);
    const dates = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      dates.push({
        date: format(currentDate, "yyyy-MM-dd"),
        formatted: format(currentDate, "dd MMM", { locale: fr }),
      });
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  };

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setVisibleDateRange({ start: null, end: null });
      setFilteredReservations(reservations);
      return;
    }

    let visibleStart = startDate ? startOfDay(startDate) : null;
    let visibleEnd = endDate ? endOfDay(endDate) : null;

    if (visibleStart && visibleEnd) {
      setVisibleDateRange({ start: visibleStart, end: visibleEnd });
      setViewMode("custom");
    } else if (visibleStart) {
      visibleEnd = endOfDay(addDays(visibleStart, 30));
      setVisibleDateRange({ start: visibleStart, end: visibleEnd });
      setViewMode("custom");
    } else if (visibleEnd) {
      visibleStart = startOfDay(subDays(visibleEnd, 30));
      setVisibleDateRange({ start: visibleStart, end: visibleEnd });
      setViewMode("custom");
    }

    const filtered = reservations.filter((reservation) => {
      const reservationStart = new Date(reservation.date_arrivee);
      const reservationEnd = new Date(reservation.date_depart);
      return (
        (visibleStart <= reservationStart && reservationStart < visibleEnd) ||
        (visibleStart < reservationEnd && reservationEnd <= visibleEnd) ||
        (reservationStart <= visibleStart && visibleEnd <= reservationEnd)
      );
    });

    console.log("Filtered reservations:", filtered);
    setFilteredReservations(filtered);

    // Center the scroll
    setTimeout(() => {
      const middleDate = new Date(
        (visibleStart.getTime() + visibleEnd.getTime()) / 2
      );
      scrollToDate(middleDate);
    }, 0);
  };

  const scrollToDate = (date) => {
    setTimeout(() => {
      const dateElement = scrollRef.current?.querySelector(
        `[data-date="${format(date, "yyyy-MM-dd")}"]`
      );
      if (dateElement) {
        dateElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const scrollToMiddleOfMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const middleDay = Math.floor(differenceInDays(end, start) / 2);
    const middleDate = addDays(start, middleDay);
    scrollToDate(middleDate);
  };

  const getCustomDates = () => {
    if (!visibleDateRange.start || !visibleDateRange.end) return [];

    const dates = [];
    let currentDate = visibleDateRange.start;
    while (currentDate <= visibleDateRange.end) {
      dates.push({
        date: format(currentDate, "yyyy-MM-dd"),
        formatted: format(currentDate, "EEE dd/MM", { locale: fr }),
      });
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  };

  const generateCalendar = () => {
    let dates;
    if (viewMode === "week") {
      dates = getWeekDates(selectedDate);
    } else if (viewMode === "month") {
      dates = getMonthDates(selectedDate);
    } else if (viewMode === "year") {
      dates = getYearDates(selectedDate);
    } else if (viewMode === "custom") {
      dates = getCustomDates();
    }

    return rooms.map((room) => {
      let currentReservation = null;
      let reservationStartIndex = -1;

      return (
        <tr key={room}>
          <td className="px-2 py-2 font-bold  sticky left-0 bg-secondary z-10">
            {room}
          </td>
          {dates.map(({ date, formatted }, index) => {
            const currentDate = startOfDay(new Date(date));
            const isTodayDate = isToday(currentDate);

            if (!currentReservation) {
              const reservationsToUse =
                viewMode === "custom" ? filteredReservations : reservations;
              currentReservation = reservationsToUse.find(
                (res) =>
                  `CH${res.chambre.numero_chambre}` === room &&
                  new Date(res.date_arrivee) <= currentDate &&
                  new Date(res.date_depart) > currentDate
              );
              if (currentReservation) {
                reservationStartIndex = index;
              }
            }

            if (
              currentReservation &&
              new Date(currentReservation.date_depart) <= currentDate
            ) {
              currentReservation = null;
              reservationStartIndex = -1;
            }

            if (currentReservation && index === reservationStartIndex) {
              const reservationEndDate = new Date(
                currentReservation.date_depart
              );
              const endIndex = dates.findIndex(
                (d) => new Date(d.date) >= reservationEndDate
              );
              const reservationLength =
                endIndex === -1
                  ? dates.length - reservationStartIndex
                  : endIndex - reservationStartIndex;
              const colspan = Math.max(1, reservationLength);

              return (
                <td
                  key={date}
                  className={`px-5 py-2  ${isTodayDate ? "bg-primary/30" : ""}`}
                  data-date={date}
                  colSpan={colspan}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        className={`${
                          statusColors[currentReservation.statuts] + "/10"
                        } p-3 rounded-xl text-white flex flex-col items-start cursor-pointer border`}
                        onClick={() => {
                          console.log(
                            "Clicked reservation:",
                            currentReservation
                          );
                          setSelectedReservation(currentReservation);
                        }}
                      >
                        <div
                          className={`${
                            statusColors[currentReservation.statuts]
                          } flex flex-col items-start gap-1 p-2 rounded-xl`}
                        >
                          <span>{`${currentReservation.client.nom} ${currentReservation.client.prenom}`}</span>
                          <span className="text-gray-200 flex items-center gap-1">
                            <CalendarArrowDown className="h-4 w-4" />
                            {`${format(
                              new Date(currentReservation.date_arrivee),
                              "dd/MM"
                            )} - ${format(
                              new Date(currentReservation.date_depart),
                              "dd/MM"
                            )}`}
                          </span>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <ReservationInfo
                        reservation={currentReservation}
                        onStatusUpdate={(newStatus) => {
                          fetchReservations(selectedDate);
                          setSelectedReservation(null);
                        }}
                        fetchReservation={() => fetchReservations(selectedDate)}
                      />
                    </DialogContent>
                  </Dialog>
                </td>
              );
            } else if (!currentReservation || index < reservationStartIndex) {
              return (
                <td
                  key={date}
                  className={`px-4 py-2 ${isTodayDate ? "bg-primary/30" : ""}`}
                  data-date={date}
                >
                  <div className="h-12"></div>
                </td>
              );
            }

            return null;
          })}
        </tr>
      );
    });
  };

  const handlePrevPeriod = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setSelectedDate(newDate);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => {
      if (prevMode === "week") return "month";
      if (prevMode === "month") return "year";
      return "week";
    });
  };

  useEffect(() => {
    if (scrollRef.current && viewMode === "year") {
      const selectedDateElement = scrollRef.current.querySelector(
        `[data-date="${selectedDate.toISOString().split("T")[0]}"]`
      );
      if (selectedDateElement) {
        selectedDateElement.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      }
    }
  }, [selectedDate, viewMode]);

  const handleViewModeChange = (value) => {
    setViewMode(value);
  };

  const handleStartDateSelect = (date) => {
    setStartDate(date);
  };

  const handleEndDateSelect = (date) => {
    setEndDate(date);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <Select value={viewMode} onValueChange={handleViewModeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner la vue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Vue par année</SelectItem>
            <SelectItem value="month">Vue par mois</SelectItem>
            <SelectItem value="week">Vue par semaine</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "PPP", { locale: fr })
                ) : (
                  <span>Date d'arrivée</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, "PPP", { locale: fr })
                ) : (
                  <span>Date de départ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button onClick={applyDateFilter}>Appliquer le filtre</Button>
        </div>

        <Button variant="outline" onClick={handlePrevPeriod}>
          <ArrowLeft size={16} />
          {viewMode === "week"
            ? "Semaine précédente"
            : viewMode === "month"
            ? "Mois précédent"
            : "Année précédente"}
        </Button>
        <span>
          {viewMode === "year"
            ? `${selectedDate.getFullYear()} (centré sur ${format(
                selectedDate,
                "dd MMMM",
                { locale: fr }
              )})`
            : selectedDate.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
        </span>
        <Button variant="outline" onClick={handleNextPeriod}>
          {viewMode === "week"
            ? "Semaine suivante"
            : viewMode === "month"
            ? "Mois suivant"
            : "Année suivante"}
          <ArrowRight size={16} />
        </Button>
        <Button onClick={toggleViewMode} className=" -gray-300 p-2">
          {viewMode === "week"
            ? "Vue par mois"
            : viewMode === "month"
            ? "Vue par année"
            : "Vue par semaine"}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={"w-[240px] justify-start text-left font-normal"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div
          className="max-h-[calc(100vh-200px)] overflow-y-auto"
          ref={scrollRef}
        >
          <table className="min-w-full -collapse rounded-lg">
            <thead className="sticky top-0 bg-white z-20">
              <tr>
                <th className="px-4 py-2  sticky left-0 z-30 bg-secondary">
                  Chambre
                </th>
                {(viewMode === "week"
                  ? getWeekDates(selectedDate)
                  : viewMode === "month"
                  ? getMonthDates(selectedDate)
                  : getYearDates(selectedDate)
                ).map(({ formatted, date }) => (
                  <th
                    key={formatted}
                    className={`px-5 py-2 shadow rounded-full ${
                      isToday(new Date(date)) ? "bg-primary text-white" : ""
                    }`}
                    data-date={date}
                  >
                    {formatted}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="rounded-lg">{generateCalendar()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
