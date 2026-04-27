"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Início" },
  { href: "/evaluate", label: "Avaliar" },
  { href: "/ona", label: "Rede ONA" },
  { href: "/results", label: "Meus Resultados" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
            style={{ background: "#E5302F" }}
          >
            iF
          </div>
          <span className="font-bold text-gray-900 text-sm">AvD iFood</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={pathname.startsWith(item.href) ? { background: "#E5302F" } : {}}
            >
              {item.label}
            </Link>
          ))}
          {role === "ADMIN" && (
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={pathname.startsWith("/admin") ? { background: "#E5302F" } : {}}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-none">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{(session?.user as any)?.department}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
