"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, User as UserIcon, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { usuario, logout, isAuthenticated } = useAuth()

  const navLinks = isAuthenticated
    ? (usuario?.rol === "autoridad" || usuario?.rol === "admin")
      ? [
        { href: "/", label: "Inicio" },
        { href: "/denuncias", label: "Denuncias" },
        { href: "/dashboard", label: "Dashboard" },
      ]
      : [
        { href: "/", label: "Inicio" },
        { href: "/denuncias", label: "Denuncias" },
        { href: "/mis-denuncias", label: "Mis Denuncias" },
        { href: "/nueva-denuncia", label: "Reportar" },
      ]
    : [
      { href: "/", label: "Inicio" },
      { href: "/denuncias", label: "Denuncias" },
    ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logotipo */}
          {/* Logotipo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden sm:inline">Denuncias Urbanas</span>
            <span className="sm:hidden">DU</span>
          </Link>

          {/* Navegación de escritorio */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                asChild
                className="text-sm font-medium"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>

          {/* Botones de autenticación */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/perfil" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">{usuario?.nombre}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navegación móvil */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium transition-colors ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between py-2 border-t mt-2 pt-2">
              <span className="text-sm font-medium text-muted-foreground">Tema</span>
              <ThemeToggle />
            </div>
            <div className="pt-3 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    {usuario?.nombre}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/registro">Registrarse</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
