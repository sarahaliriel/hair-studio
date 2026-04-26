import { pricing, pricingNote } from "@/content/Pricing";

export function PricingTable() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <ul className="divide-y divide-white/10">
        {pricing.map((p) => (
          <li key={p.service} className="flex items-center justify-between py-3">
            <span className="text-white/85">{p.service}</span>
            <span className="font-medium">{p.price}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-white/60">{pricingNote}</p>
    </div>
  );
}
