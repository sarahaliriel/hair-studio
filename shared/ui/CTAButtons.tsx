"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/config/Site";

export function CTAButtons() {
  const [isOpenHours, setIsOpenHours] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hour = new Date().getHours();
    setIsOpenHours(hour >= 9 && hour <= 19);
  }, []);

  const waText = encodeURIComponent(
    isOpenHours
      ? `Olá! Gostava de marcar um atendimento no salão 😊\n\n` +
          `💇 Serviço desejado:\n` +
          `Preferência de data/horário:\n` +
          `📍 Local: Salão / Domicílio\n` +
          `Nome:\n\n` +
          `Obrigado!`
      : `Olá! Vi o vosso site e gostava de marcar um atendimento 😊\n\n` +
          `💇 Serviço desejado:\n` +
          `Quando tiverem disponibilidade:\n` +
          `👤 Nome:\n\n` +
          `Obrigado!`
  );

  const handleWhatsAppClick = () => {
    window.gtag?.("event", "cta_whatsapp_click", {
      event_category: "engagement",
      event_label: "whatsapp_booking",
    });
  };

  const handleCallClick = () => {
    window.gtag?.("event", "cta_call_click", {
      event_category: "engagement",
      event_label: "phone_call",
    });
  };

  const buttonBase =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-[12px] font-medium tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

      <motion.a
        href={`https://wa.me/${site.whatsappRaw}?text=${waText}`}
        target="_blank"
        rel="noreferrer"
        onClick={handleWhatsAppClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`${buttonBase} bg-[#5b5545] text-[#edeae2] shadow-[0_10px_25px_rgba(0,0,0,0.15)]`}
      >
        WHATSAPP
      </motion.a>

      <motion.a
        href={`tel:${site.phoneRaw}`}
        onClick={handleCallClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`${buttonBase} border border-black/15 bg-white/30 text-[#2f2d2d] backdrop-blur-md hover:bg-white/50`}
      >
        LIGAR
      </motion.a>

      <motion.a
        href={`mailto:${site.email}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`${buttonBase} border border-black/15 bg-white/20 text-[#2f2d2d] backdrop-blur-md hover:bg-white/40`}
      >
        EMAIL
      </motion.a>
    </div>
  );
}