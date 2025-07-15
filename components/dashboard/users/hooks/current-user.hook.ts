"use client";

import { useEffect, useState } from "react";
// Suppression de l'import non utilisé de auth

// Ceci est un hook client qui récupère l'utilisateur connecté depuis le serveur
export function useCurrentUser() {
  const [userName, setUserName] = useState<string>("Utilisateur");
  
  useEffect(() => {
    // Fonction pour récupérer l'utilisateur
    const fetchUser = async () => {
      try {
        const session = await fetch("/api/auth/session");
        // Type casting pour éviter les erreurs d'ESLint
        const data = await session.json() as { user?: { name?: string } };
        
        // Utilisation de chaîne optionnelle
        if (data?.user?.name) {
          // Cast vers string pour éviter l'erreur no-unsafe-argument
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }
    };
    
    // Utilisation de void pour indiquer que nous ignorons délibérément la promesse
    void fetchUser();
  }, []);
  
  return { userName };
}
