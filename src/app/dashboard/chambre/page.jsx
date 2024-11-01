import React from "react";
import PrePage from "./_component/PrePage";
import RoomList from "./_component/RoomList";

const Page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Chambres</h1>
      <p className="md:max-w-[60%] text-zinc-400">
        Attribution des chambres. Attribuez les chambres aux clients en fonction
        de leurs demandes et de la disponibilité.
      </p>

      <PrePage />
    </div>
  );
};

export default Page;
