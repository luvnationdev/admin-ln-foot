"use client";

import NewsEditor from "@/components/dashboard/web/news/news-editor";

export default function NewsForm() {
  return (
    <div className="w-full space-x-5">
      <NewsEditor article={null}  />
    </div>
  );
}
