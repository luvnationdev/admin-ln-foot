"use client";
import ContentTabs from "@/components/content-tabs";
import ActualitesForm from "@/components/dashboard/web/actualites-form";
import PointsFortsForm from "@/components/dashboard/web/points-forts-form";
import PublicitesForm from "@/components/dashboard/web/publicites-form";
import { useState } from "react";
import PostsForm from "./web/posts-form";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("actualites");

  const tabs = [
    { id: "actualites", label: "Actualités" },
    { id: "articles", label: "Articles" },
    { id: "pointsForts", label: "Points Forts" },
    { id: "publicites", label: "Publicités" },
  ];

  // Function to determine the form title based on active tab
  const getFormTitle = () => {
    switch (activeTab) {
      case "actualites":
        return "Gestion des Actualités";
      case "pointsForts":
        return "Gestion des Points Forts";
      case "publicites":
        return "Gestion des Publicités";
      default:
        return "Gestion du Contenu";
    }
  };

  return (
    <>
      {/* Content Tabs */}
      <ContentTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {/* Form Title */}
      <h2 className="my-6 text-2xl font-bold text-center">{getFormTitle()}</h2>
      {/* Active Form Component */}
      {activeTab === "actualites" && <ActualitesForm />}
      {activeTab === "articles" && <PostsForm />}{" "}
      {/* Placeholder for Articles Form */}
      {activeTab === "pointsForts" && <PointsFortsForm />}
      {activeTab === "publicites" && <PublicitesForm />}
    </>
  );
}
