import Link from "next/link";
import Image from "next/image";
import { FaGooglePlay } from "react-icons/fa";

// Service and company links arrays
const serviceLinks = [
  { label: "Latest News", href: "#" },
  { label: "Match Highlights", href: "#" },
  { label: "Player Profiles", href: "#" },
  { label: "Team Analysis", href: "#" },
  { label: "Upcoming Matches", href: "#" },
  { label: "Transfer News", href: "#" },
  { label: "Game Recaps", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1e3c] text-white  ">
      {/* Logo */}
      <div className="flex justify-between overflow-hidden">
        <Image
          src={"/ln-foot.svg"}
          alt="Logo"
          width={375}
          height={215}
          className="px-2 mb-12"
        />
        <Image
          src={"/LN.png"}
          alt="Logo"
          width={150}
          height={50}
          className="hidden lg:block -rotate-15 translate-x-4 top-0 -translate-y-10 opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="md:col-span-6">
          <h3 className="text-2xl font-bold uppercase mb-2">
            Obtenir les dernieres exclusivite
            <br />
            en matiere de foot!
          </h3>
          <p className="text-sm text-gray-300 mb-6 max-w-md">
            Rejoignez notre communauté et recevez les dernières mises à jour,
            les points forts du jeu et du contenu exclusif directement dans
            votre boîte de réception. suivez-nous sur les réseaux sociaux et
            abonnez-vous à notre newsletter dès aujourd&apos;hui.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#"
              className="bg-[#f05a28] text-white px-6 py-3 rounded-md text-sm font-medium uppercase hover:bg-[#e04a18] transition-colors"
            >
              Contact nous
            </Link>
            <Link
              href="#"
              className="border border-orange-500 text-orange-500 px-6 py-3 rounded-md text-sm font-medium uppercase flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <FaGooglePlay size={20} className="text-white" />
              Téléchargez notre application
            </Link>
          </div>
        </div>

        {/* Empty space */}
        <div className="hidden md:block md:col-span-2"></div>

        {/* Footer Links */}
        <div className="md:col-span-2">
          <ul className="space-y-2 text-sm">
            {serviceLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <ul className="space-y-2 text-sm">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-700 my-8 lg:w-4xl mx-auto px-6 md:px-12"></div>

      {/* Copyright */}
      <div className="flex flex-col md:flex-row lg:w-4xl mx-auto justify-between items-center text-xs text-gray-400 pb-2 px-6 md:px-12">
        <div>© Copyright 2025 LNFOOT</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Services
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
