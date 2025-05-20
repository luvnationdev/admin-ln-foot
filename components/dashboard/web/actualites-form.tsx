"use client";

import type React from "react";
import NewsEditor from "@/components/News/NewsEditor";
import { Button } from "@/components/ui/button";

export default function ActualitesForm() {
  return (
    <div className="w-full space-x-5">
      <NewsEditor />
      <span className="flex justify-between items-center mt-4">
        <Button variant="outline" className="mb-4">
          <a href="/dashboard/content/news">Voir tout les articles</a>
        </Button>
      </span>
    </div>
  );
}
