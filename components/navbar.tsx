"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/content/site";

type NavItem = { label: string; href: string };

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const left: NavItem[] = useMemo(
    () => [
      { label: "Início", href: "/" },
      { label: "Serviços", href: "/servicos" },
    ],
    []
  );

  const right: NavItem[] = useMemo(
    () => [
      { label: "Galeria", href: "/galeria" },
      { label: "Contacto", href: "/#contato" },
    ],
    []
  );

  const all = useMemo(() => [...left, ...right], [left, right]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname]);

  const waText = encodeURIComponent(
    "Olá! Gostava de marcar um atendimento. 😊\n\nServiço: \nData e horário preferidos: \nLocal: Salão ou Domicílio\n\nNome: "
  );

  function handleNavClick(href: string) {
    const hasHash = href.includes("#");
    if (!hasHash) return;

    const hash = href.slice(href.indexOf("#"));
    const id = hash.replace("#", "");

    if (pathname !== "/") {
      router.push(`/${hash}`);
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    setOpen(false);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function NavLink({ item }: { item: NavItem }) {
    const hasHash = item.href.includes("#");
    return (
      <Link
        href={item.href}
        onClick={(e) => {
          if (!hasHash) return;
          e.preventDefault();
          handleNavClick(item.href);
        }}
        className="group relative text-[#2f2d2d]/70 transition-colors hover:text-[#2f2d2d]"
      >
        <span className="relative">
          {item.label}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#875f46] transition-[width] duration-300 group-hover:w-full" />
        </span>
      </Link>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-3 rounded-[28px] border border-black/10 bg-[#edeae2]/75 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4 sm:grid sm:grid-cols-3 sm:items-center sm:px-6">
            <nav className="hidden items-center gap-7 text-[11px] tracking-[0.22em] sm:flex">
              {left.map((i) => (
                <NavLink key={i.label} item={i} />
              ))}
            </nav>

            <Link href="/" className="flex items-center sm:mx-auto sm:justify-center" aria-label={site.name}>
              <Image
                src="/images/Arlete.png"
                alt={site.name}
                width={124}
                height={40}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <div className="hidden items-center justify-end gap-6 sm:flex">
              <nav className="flex items-center gap-7 text-[11px] tracking-[0.22em]">
                {right.map((i) => (
                  <NavLink key={i.label} item={i} />
                ))}
              </nav>

              <a
                href={`https://wa.me/${site.whatsappRaw}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#5b5545] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#edeae2]"
              >
                WhatsApp
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/20 text-[#2f2d2d] sm:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute left-0 top-0 block h-px w-4 bg-[#2f2d2d] transition-all ${open ? "top-1.5 rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-px w-4 bg-[#2f2d2d] transition-all ${open ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute left-0 top-3 block h-px w-4 bg-[#2f2d2d] transition-all ${open ? "top-1.5 -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>

          <div className={`sm:hidden ${open ? "block" : "hidden"}`}>
            <div className="px-4 pb-4">
              <div className="h-px w-full bg-black/10" />
              <nav className="mt-4 grid gap-2 text-[12px] tracking-[0.22em]">
                {all.map((i) => {
                  const hasHash = i.href.includes("#");
                  return (
                    <Link
                      key={i.label}
                      href={i.href}
                      onClick={(e) => {
                        if (!hasHash) {
                          setOpen(false);
                          return;
                        }
                        e.preventDefault();
                        handleNavClick(i.href);
                      }}
                      className="rounded-2xl px-4 py-3 text-[#2f2d2d]/80 transition-colors hover:bg-black/5 hover:text-[#2f2d2d]"
                    >
                      {i.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 grid gap-2">
                <a
                  href={`https://wa.me/${site.whatsappRaw}?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-[#5b5545] px-4 py-3 text-center text-[12px] font-semibold tracking-[0.18em] text-[#edeae2]"
                >
                  MARCAR NO WHATSAPP
                </a>
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="rounded-2xl border border-black/10 bg-white/35 px-4 py-3 text-center text-[12px] font-semibold tracking-[0.18em] text-[#2f2d2d]"
                >
                  LIGAR
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm transition-opacity sm:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
    </header>
  );
}