import Link from "next/link"
import Navbar from "@/components/Layout/navbar"

export default function Home() {
  return (
    <main>
      <div className="max-w-7xl mx-auto p-8">
        <Link href="/dashboard/web" className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800">
          Voir le tableau de bord (démo)
        </Link>
      </div>
    </main>
  )
}
