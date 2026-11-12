import { Button } from "@/components/ui/button";
import { site } from "@/config/Site";
export const bookingHref = `https://wa.me/${site.whatsappRaw}?text=${encodeURIComponent("Olá Arlete! Gostava de marcar um atendimento.\n\nServiço: \nData e horário preferidos: \nLocal: Salão ou domicílio\nNome: ")}`;
export function BookingLink({
  children = "Marcar um momento",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      className={className}
      render={<a href={bookingHref} target="_blank" rel="noopener noreferrer" />}
    >
      {children}
    </Button>
  );
}
