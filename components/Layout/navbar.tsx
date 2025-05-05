"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NavbarProps {
  isLoggedIn?: boolean
  user?: {
    name?: string | null
    email?: string | null
  } | undefined
}


export default function Navbar({ isLoggedIn = false, user }: NavbarProps) {

  const [activeTab, setActiveTab] = useState<string>("mobile")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="w-full bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/LN.png" alt="LN FOOT" width={40} height={40} className="h-10 w-auto" />

          </Link>
        </div>

        {isLoggedIn && !isMobile && (
          <div className="flex justify-center flex-grow">
            <nav>
              <ul className="flex space-x-8">
                <li className={`relative ${activeTab === "site-web" ? "text-blue-700" : "text-gray-800"}`}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setActiveTab("site-web")
                      router.push("/dashboard/web")
                    }}
                    className="font-semibold px-1 py-2 bg-transparent"
                  >
                    SITE WEB
                  </Button>
                  {activeTab === "site-web" && (
                    <div className="absolute bottom-[-18px] left-0 w-full h-1 bg-blue-700"></div>
                  )}
                </li>
                <li className={`relative ${activeTab === "mobile" ? "text-blue-700" : "text-gray-800"}`}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setActiveTab("mobile")
                      router.push("/dashboard/mobile")
                    }}
                    className="font-semibold px-1 py-2 bg-transparent"
                  >
                    MOBILE
                  </Button>
                  {activeTab === "mobile" && (
                    <div className="absolute bottom-[-18px] left-0 w-full h-1 bg-blue-700"></div>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}

        <div className="flex items-center">
          {isLoggedIn ? (
            <>
              {user  && (
                <span className="mr-4 font-semibold text-gray-700 truncate max-w-[120px]" title={user?.name ?? undefined}>
                  {user?.name}
                </span>
              )}
              <Link href="/api/auth/signout" className="flex items-center">
                <span>
                  <LogOut className="text-red-500" />
                </span>
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-600 mr-4 p-2" aria-label="Rechercher">
                <Search size={20} />
              </Button>
              <Link href="/auth/login">
                <Button variant="outline" className="text-blue-700 border-blue-700 rounded px-4 py-2 font-semibold">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {isMobile && (
          <Button variant="ghost" className="ml-4 text-gray-800 p-2" onClick={toggleMobileMenu} aria-label="Menu">
            <Menu size={24} />
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="w-full bg-white shadow-md py-4 px-4">
          <nav>
            {isLoggedIn ? (
              <ul className="space-y-4">
                <li className={activeTab === "site-web" ? "text-blue-700" : "text-gray-800"}>
                  <Button
                    variant={activeTab === "site-web" ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab("site-web")
                      router.push("/dashboard/web")
                    }}
                    className="font-semibold w-full text-left py-2 bg-transparent"
                  >
                    SITE WEB
                  </Button>
                </li>
                <li className={activeTab === "mobile" ? "text-blue-700" : "text-gray-800"}>
                  <Button
                    variant={activeTab === "mobile" ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab("mobile")
                      router.push("/dashboard/mobile")
                    }}
                    className="font-semibold w-full text-left py-2 bg-transparent"
                  >
                    MOBILE
                  </Button>
                </li>
                <li className="pt-2">
                  <Link href="/dashboard/web">
                    <Button variant="outline" className="text-blue-700 border-blue-700 rounded-full px-6 py-2 font-semibold w-full">
                      Tableau De Bord
                    </Button>
                  </Link>
                </li>
                <li>
                  {user && (
                    <span className="block mb-2 font-semibold text-gray-700 truncate max-w-[120px]" title={user?.name ?? undefined}>
                      {user?.name}
                    </span>
                  )}
                  <Link href="/api/auth/signout">
                    <Button variant="outline" className="text-red-600 border-red-600 rounded px-4 py-2 font-semibold w-full">
                      Déconnexion
                    </Button>
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-4">
                <li>
                  <div className="flex items-center py-2">
                    <Search size={20} className="text-gray-600 mr-2" />
                    <span className="font-semibold">Rechercher</span>
                  </div>
                </li>
                <li>
                  <Link href="/api/auth/signin">
                    <Button variant="outline" className="text-blue-700 border-blue-700 rounded px-4 py-2 font-semibold w-full">
                      Login
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
