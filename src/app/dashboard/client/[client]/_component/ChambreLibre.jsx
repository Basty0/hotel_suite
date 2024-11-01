import React, { useState } from "react";
import FiltreChambre from "./FiltreChambre";
const ChambreLibre = ({ client_id }) => {
  const [chambres, setChambres] = useState([]);
  return (
    <div>
      <FiltreChambre client_id={client_id} />
      {/* composent pour filter les chambre libre */}
      {/* composent pour afficher les chambres libres */}
    </div>
  );
};

export default ChambreLibre;
