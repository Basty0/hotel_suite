import React from "react";
import { DatePickerWithRange } from "./DatePickerWithRange";

const FiltreChambre = ({ client_id }) => {
  return (
    <div>
      {/* en utilisent les forme date piker de shadcn un cree une formulaire avec date ariver et date depart */}
      <div>
        <DatePickerWithRange client_id={client_id} />
      </div>
    </div>
  );
};

export default FiltreChambre;
