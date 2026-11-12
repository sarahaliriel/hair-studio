export type GalleryItem = { id: string; src: string; alt: string };
export const galleryImages: GalleryItem[] = [
  { id: "g1", src: "/images/gallery/001.png", alt: "Corte completo" },
  { id: "g2", src: "/images/gallery/02.png", alt: "Penteado elegante" },
  { id: "g3", src: "/images/gallery/002.png", alt: "Croche" },
  { id: "g4", src: "/images/gallery/003.png", alt: "Corte em camadas" },
  { id: "g5", src: "/images/gallery/004.png", alt: "Penteado volumoso" },
  { id: "g6", src: "/images/gallery/05.png", alt: "Penteado suave" },
  { id: "g7", src: "/images/gallery/06.png", alt: "Coloração fantasia" },
  { id: "g8", src: "/images/gallery/6.png", alt: "Travesseiro para bebe" },
  { id: "g9", src: "/images/gallery/007.png", alt: "Ondas naturais" },
  { id: "g10", src: "/images/gallery/08.png", alt: "Corte curto" },
  { id: "g11", src: "/images/gallery/008.png", alt: "Mosqueteiro para bebe" },
  { id: "g12", src: "/images/gallery/09.png", alt: "Coloração criativa" },
  { id: "g13", src: "/images/gallery/10.png", alt: "Progressiva" },
  { id: "g14", src: "/images/gallery/11.png", alt: "Tranças" },
  { id: "g15", src: "/images/gallery/12.png", alt: "Trança evento" },
  { id: "g16", src: "/images/gallery/13.png", alt: "Arte Cachorro" },
  { id: "g17", src: "/images/gallery/013.png", alt: "Croche de bolsas" },
  { id: "g18", src: "/images/gallery/14.png", alt: "Corte feminino" },
  { id: "g19", src: "/images/gallery/15.png", alt: "Trança elegante" },
  { id: "g20", src: "/images/gallery/015.png", alt: "Croche vasos" },
  {
    id: "g21",
    src: "/images/gallery/16.png",
    alt: "Penteado elegante para festa",
  },
  { id: "g22", src: "/images/gallery/17.png", alt: "Bolsas de croche" },
];

// Curated selection for the homepage image trail.
export const heroTrailImages = galleryImages.filter((image) =>
  ["g4", "g2", "g7"].includes(image.id),
);
