"use client";

import NewsEditor from "@/components/News/NewsEditor";

export default function NewsForm() {
  return (
    <div className="w-full space-x-5">
      <NewsEditor article={null}  />
    </div>
  );
}
