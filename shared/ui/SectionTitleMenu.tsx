export function SectionTitle({
  overline,
  title,
  desc,
  as: Heading = "h2",
}: {
  overline?: string;
  title: string;
  desc?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-6" data-reveal="stagger">
      {overline ? (
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#875f46]" />
          <p className="text-[11px] tracking-[0.28em] text-[#2f2d2d]/65">
            {overline.toUpperCase()}
          </p>
        </div>
      ) : null}
      <Heading
        className={
          Heading === "h1"
            ? "page-heading"
            : "font-serif mt-3 text-3xl leading-tight tracking-[-0.02em] text-[#2f2d2d] sm:text-4xl"
        }
      >
        {title}
      </Heading>
      {desc ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#2f2d2d]/70">
          {desc}
        </p>
      ) : null}
    </div>
  );
}
