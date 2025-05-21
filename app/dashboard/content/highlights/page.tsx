import HighlightsTable from "@/components/tables/HighlightsTable";
import React from "react";

export default function HighlightsPage() {
  return (
    <div className="p-8 lg:px-24 lg:py-20 space-y-4">
      <h1 className="text-2xl font-bold text-orange-500">Gestion des Points Forts</h1>
      <HighlightsTable />
    </div>
  );
}
