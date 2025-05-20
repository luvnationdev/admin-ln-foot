import AdvertisementsTable from "@/components/tables/AdvertisementsTable";
import React from "react";

export default function AdvertisementsPage() {
  return (
    <div className="p-8 lg:px-24 lg:py-20 space-y-4">
      <h1 className="text-2xl font-bold text-orange-500">Gestion des Publicités</h1>
      <AdvertisementsTable />
    </div>
  );
}
