import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md mt-auto shadow-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Denuncias Urbanas</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma ciudadana para reportar y dar seguimiento a problemas
              urbanos.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/denuncias"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ver Denuncias
                </Link>
              </li>
              <li>
                <Link
                  href="/nueva-denuncia"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Reportar Problema
                </Link>
              </li>
            </ul>
          </div>

          {/* ODS */}
          <div>
            <h3 className="font-semibold mb-4">Objetivos ODS</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>ODS 11: Ciudades Sostenibles</li>
              <li>ODS 16: Instituciones Sólidas</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contacto@denuncias.gob
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +51 984 123 456
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Denuncias Urbanas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
