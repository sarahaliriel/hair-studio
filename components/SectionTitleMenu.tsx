export function SectionTitle({
  overline,
  title,
  desc,
}: {
  overline?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-6">
      {overline ? (
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#875f46]" />
          <p className="text-[11px] tracking-[0.28em] text-[#2f2d2d]/65">
            {overline.toUpperCase()}
          </p>
        </div>
      ) : null}
      <h2 className="font-serif mt-3 text-3xl leading-tight tracking-[-0.02em] text-[#2f2d2d] sm:text-4xl">
        {title}
      </h2>
      {desc ? <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#2f2d2d]/70">{desc}</p> : null}
    </div>
  );
}