"use client";
import ContentTabs from "@/components/content-tabs";
import ActualitesForm from "@/components/dashboard/web/actualites-form";
import PointsFortsForm from "@/components/dashboard/web/points-forts-form";
import PublicitesForm from "@/components/dashboard/web/publicites-form";
import { useState } from "react";
import PostsForm from "./web/posts-form";
import { Button } from "@/components/ui/button";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("actualites");

  const tabs = [
    { id: "actualites", label: "Actualités" },
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

      {/* Title + Nav Button */}
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-bold">{getFormTitle()}</h2>
        {activeTab === "actualites" && (
          <Button variant="outline">
            <a href="/dashboard/content/news">Voir toutes les actualités</a>
          </Button>
        )}
        {activeTab === "articles" && (
          <Button variant="outline">
            <a href="/dashboard/content/articles">Voir tous les articles</a>
          </Button>
        )}
        {activeTab === "pointsForts" && (
          <Button variant="outline">
            <a href="/dashboard/content/highlights">Voir tous les points forts</a>
          </Button>
        )}
        {activeTab === "publicites" && (
          <Button variant="outline">
            <a href="/dashboard/content/advertisements">
              Voir toutes les publicités
            </a>
          </Button>
        )}
      </div>

      {/* Active Form Component */}
      {activeTab === "actualites" && <ActualitesForm />}
      {activeTab === "articles" && <PostsForm />}
      {activeTab === "pointsForts" && <PointsFortsForm />}
      {activeTab === "publicites" && <PublicitesForm />}
    </>
  );
}
