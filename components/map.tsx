import { site } from "@/content/site";

export function MapSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Onde estamos</h3>
        <p className="mt-2 text-white/70">{site.addressLine}</p>
        <p className="mt-2 text-white/60">{site.homeServiceText}</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            className="rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-neutral-950 hover:bg-white/90"
            href={`tel:${site.phoneRaw}`}
          >
            Ligar
          </a>
          <a
            className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-medium hover:bg-white/5"
            href={`mailto:${site.email}`}
          >
            Email
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <iframe
          title="Mapa"
          src={site.googleMapsEmbedSrc}
          className="h-80 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}