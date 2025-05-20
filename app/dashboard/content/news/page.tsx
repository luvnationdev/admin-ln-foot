import NewsTable from "@/components/tables/NewsTable";
import React from "react";

export default function NewsPage() {
  return (
    <div className="p-8 lg:py-20 space-y-4">
      <h1 className="text-2xl font-bold text-orange-500">Gestion des Actualites</h1>
      <NewsTable />
    </div>
  );
}
