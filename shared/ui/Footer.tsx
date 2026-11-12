import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/Site";
import { BookingLink, bookingHref } from "./BookingLink";
import { GravityPlayground } from "./gravity-footer/GravityPlayground";
import { salonTools } from "./gravity-footer/assets";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <div className={styles.frame} data-footer-frame>
    <footer className={styles.footer} data-gravity-footer data-reveal="none">
      <GravityPlayground assets={salonTools} />
      <div className={styles.content} data-footer-reveal>
        <div className={styles.identity}>
          <Link href="/" className={styles.brand} aria-label="Arlete Space — início">
            Arlete<em>space.</em>
          </Link>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.description}>Cuidados e finalização com produtos de alta qualidade.</p>
          <p className={styles.hours}>TERÇA A SEXTA · 09:00 ÀS 18:00</p>
          <BookingLink>Marcar no WhatsApp</BookingLink>
        </div>
        <nav className={styles.column} aria-label="Navegação do rodapé">
          <p className={styles.label}>EXPLORA</p>
          <Link href="/">Início</Link>
          <Link href="/servicos">Serviços</Link>
          <Link href="/galeria">Galeria</Link>
          <Link href="/#contato">Contacto</Link>
        </nav>
        <div className={styles.column}>
          <p className={styles.label}>CONTACTO</p>
          <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/arlete.oliveira.79/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Arlete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href={bookingHref} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Arlete no WhatsApp">
              <MessageCircle aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className={`${styles.column} ${styles.location}`}>
          <p className={styles.label}>MORADA</p>
          <p>{site.addressLine}</p>
          <Button variant="secondary" render={<a href="https://www.google.com/maps/search/?api=1&query=Ideias+e+Tran%C3%A7as+R.+Silva+Carvalho+54B+Lisboa" target="_blank" rel="noopener noreferrer" />}>
            Ver no mapa
          </Button>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Arlete Space. Todos os direitos reservados.</p>
        <a className={styles.signature} href="https://sarahaliriel.tech" target="_blank" rel="noopener noreferrer" aria-label="Design e desenvolvimento por Sarah Aliriel — portfólio">
          <span className={styles.signatureMark} aria-hidden="true">{"</s/a>"}</span>
          <span className={styles.signatureCredit} aria-hidden="true">
            design &amp; development by <span>{"</s/a>"}</span> ↗
          </span>
        </a>
      </div>
    </footer>
    </div>
  );
}
