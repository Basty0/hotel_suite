"use client";
import React, { useState, useCallback, useRef } from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import "moment/locale/fr";
import "react-calendar-timeline/lib/Timeline.css";
import "./timeline-styles.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { chambres } from "../_data/chambresData";
import { ReservationDialog } from "./ReservationDialog";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

moment.locale("fr");

const ReservationTimeline = ({ reservations }) => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState({
    from: moment().startOf("month").toDate(),
    to: moment().endOf("month").toDate(),
  });
  const [visibleTimeStart, setVisibleTimeStart] = useState(
    moment().startOf("month").valueOf()
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(
    moment().endOf("month").valueOf()
  );

  const timelineRef = useRef(null);

  const items = reservations.map((reservation) => ({
    id: reservation.id,
    group: reservation.chambre_id,
    title: `${reservation.client.nom} ${reservation.client.prenom}`,
    start_time: moment(reservation.date_arrivee),
    end_time: moment(reservation.date_depart),
    itemProps: {
      style: {
        background: reservation.statuts === "validé" ? "#22c55e" : "#f97316",
        color: "white",
        borderRadius: "40px",
        padding: "6px 12px",
        cursor: "pointer",
      },
    },
  }));

  const handleItemClick = useCallback(
    (itemId) => {
      const reservation = reservations.find((r) => r.id === itemId);
      if (reservation) {
        setSelectedReservation(reservation);
        setIsDialogOpen(true);
      }
    },
    [reservations]
  );

  const handleTimeChange = (visibleTimeStart, visibleTimeEnd) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
  };

  // Fonctions de zoom améliorées
  const handleZoomIn = () => {
    const currentDuration = visibleTimeEnd - visibleTimeStart;
    const newDuration = currentDuration * 0.5; // Réduire la durée de moitié
    const centerPoint = (visibleTimeStart + visibleTimeEnd) / 2;

    setVisibleTimeStart(centerPoint - newDuration / 2);
    setVisibleTimeEnd(centerPoint + newDuration / 2);
  };

  const handleZoomOut = () => {
    const currentDuration = visibleTimeEnd - visibleTimeStart;
    const newDuration = currentDuration * 2; // Doubler la durée
    const centerPoint = (visibleTimeStart + visibleTimeEnd) / 2;

    setVisibleTimeStart(centerPoint - newDuration / 2);
    setVisibleTimeEnd(centerPoint + newDuration / 2);
  };

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <DatePickerWithRange
            date={date}
            setDate={(newDate) => {
              if (newDate?.from && newDate?.to) {
                setDate(newDate);
                setVisibleTimeStart(moment(newDate.from).valueOf());
                setVisibleTimeEnd(moment(newDate.to).valueOf());
              }
            }}
            className="w-full max-w-sm"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="timeline-container">
          <Timeline
            ref={timelineRef}
            groups={chambres}
            items={items}
            visibleTimeStart={visibleTimeStart}
            visibleTimeEnd={visibleTimeEnd}
            onTimeChange={handleTimeChange}
            itemHeightRatio={0.75}
            lineHeight={50}
            stackItems={false}
            canMove={false}
            canResize={false}
            sidebarWidth={150}
            onItemClick={handleItemClick}
            sidebarContent={
              <div className="font-bold text-lg text-primary">Chambres</div>
            }
            minZoom={24 * 60 * 60 * 1000} // 1 jour minimum
            maxZoom={365 * 24 * 60 * 60 * 1000} // 1 an maximum
          />
        </div>

        {selectedReservation && (
          <ReservationDialog
            reservation={selectedReservation}
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationTimeline;
