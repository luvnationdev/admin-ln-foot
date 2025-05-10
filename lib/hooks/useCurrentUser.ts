"use client";

import { useEffect, useState } from "react";
import { auth } from "@/server/auth";

// Ceci est un hook client qui récupère l'utilisateur connecté depuis le serveur
export function useCurrentUser() {
  const [userName, setUserName] = useState<string>("Utilisateur");
  
  useEffect(() => {
    // Fonction pour récupérer l'utilisateur
    const fetchUser = async () => {
      try {
        const session = await fetch("/api/auth/session");
        const data = await session.json();
        if (data && data.user && data.user.name) {
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }
    };
    
    fetchUser();
  }, []);
  
  return { userName };
}
