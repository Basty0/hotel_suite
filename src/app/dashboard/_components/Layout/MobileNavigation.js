"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { AlignLeft, Copy, Home, List } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { SaidebareContent } from "./SaidebareContent";
const MobileNavigation = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <AlignLeft className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetDescription className="flex flex-row">
              <SaidebareContent />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
