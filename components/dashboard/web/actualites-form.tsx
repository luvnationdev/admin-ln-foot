"use client";

import type React from "react";
import NewsEditor from "@/components/News/NewsEditor";
import { Button } from "@/components/ui/button";

export default function ActualitesForm() {
  return (
    <div className="w-full space-x-5">
      <NewsEditor article={null}  />
    </div>
  );
}
