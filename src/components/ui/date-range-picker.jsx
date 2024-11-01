"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({ className, date, setDate }) {
  return (
    <div className={cn("flex gap-2", className)}>
      {/* Sélecteur de date de début */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              format(date.from, "dd MMMM yyyy", { locale: fr })
            ) : (
              <span>Date de début</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date?.from}
            onSelect={(newDate) =>
              setDate((prev) => ({ ...prev, from: newDate }))
            }
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      {/* Sélecteur de date de fin */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date?.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.to ? (
              format(date.to, "dd MMMM yyyy", { locale: fr })
            ) : (
              <span>Date de fin</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date?.to}
            onSelect={(newDate) =>
              setDate((prev) => ({ ...prev, to: newDate }))
            }
            initialFocus
            locale={fr}
            disabled={(date) => {
              // Désactiver les dates antérieures à la date de début
              if (!date) return false;
              return date < new Date(date?.from);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
