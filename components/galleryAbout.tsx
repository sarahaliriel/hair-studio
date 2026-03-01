import Image from "next/image";

export function GalleryAbout() {
  return (
    <div className="grid gap-6 sm:grid-cols-[1.1fr_.9fr] sm:items-center">
      <div className="space-y-4">
        <div className="mt-4 rounded-2xl border border-[#2f2d2d]/10 bg-[#edeae2]/60 p-4">
          <p className="text-sm text-[#2f2d2d]/85">
            Se tiveres uma referência, envia-me uma foto. Se não tiveres, eu ajudo-te a escolher o melhor para ti.
          </p>
        </div>
      </div>

    </div>
  );
}