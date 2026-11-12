"use client";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { bookingHref } from "./BookingLink";
import { site } from "@/config/Site";

const left = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
];
const right = [
  { href: "/galeria", label: "Galeria" },
  { href: "/#contato", label: "Contacto" },
];

export function Navbar() {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <header className="classic-header">
      <div className="classic-navbar">
        <nav className="classic-nav-left" aria-label="Navegação principal">
          {left.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="classic-logo"
          aria-label="Arlete Space — início"
        >
          <Image
            src="/images/Arlete.png"
            alt="Arlete Space"
            width={124}
            height={124}
            priority
          />
        </Link>
        <div className="classic-nav-right">
          <nav aria-label="Galeria e contacto">
            {right.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Button render={<a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
           />}>
            WhatsApp
          </Button>
        </div>
        <details
          className="classic-mobile-menu"
          ref={menu}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current) {
              menu.current.open = false;
              menu.current.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label="Menu de navegação">
            <span aria-hidden="true">☰</span>
          </summary>
          <nav aria-label="Navegação móvel">
            {[...left, ...right].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                }}
              >
                {item.label}
              </Link>
            ))}
            <Button render={<a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
             />}>
              Marcar no WhatsApp
            </Button>
            <a href={`tel:${site.phoneRaw}`}>Ligar · {site.phoneDisplay}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
