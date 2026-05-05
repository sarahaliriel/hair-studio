import { reviews } from "@/content/Review";

export function Reviews() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {reviews.map((r, idx) => (
        <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-white/80">“{r.text}”</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-medium">{r.name}</span>
            <span className="text-white/60">{r.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
