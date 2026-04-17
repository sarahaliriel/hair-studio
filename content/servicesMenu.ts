export type ServiceCategoryKey = "coloracao" | "penteados" | "cabelo" | "domicilio";

export type ServiceCategory = {
  key: ServiceCategoryKey;
  label: string;
};

export type ServiceItem = {
  id: string;
  category: ServiceCategoryKey;
  name: string;
  desc: string;
  priceFrom: string;
  badge?: string;
};

export const serviceCategories: ServiceCategory[] = [
  { key: "coloracao", label: "Coloração" },
  { key: "penteados", label: "Penteados" },
  { key: "cabelo", label: "Cabelo" },
  { key: "domicilio", label: "Domicílio" },
];

export const servicesMenu: ServiceItem[] = [

{
  id: "col1",
  category: "coloracao",
  name: "Coloração completa",
  desc: "Aplicação uniforme com produtos profissionais. Ideal para mudança total de tom.",
  priceFrom: "desde 35€",
},
{
  id: "col2",
  category: "coloracao",
  name: "Balayage",
  desc: "Técnica de iluminação natural, personalizada conforme o teu cabelo.",
  priceFrom: "desde 80€",
  badge: "Tendência",
},
{
  id: "col3",
  category: "coloracao",
  name: "Madeixas",
  desc: "Clareamento localizado para dar luz e profundidade ao cabelo.",
  priceFrom: "desde 70€",
},

  {
    id: "t1",
    category: "penteados",
    name: "Box Braids (clássicas)",
    desc: "Acabamento limpo e durável. Inclui finalização e orientação de manutenção.",
    priceFrom: "desde 80€",
    badge: "Mais pedido",
  },
  {
    id: "t2",
    category: "penteados",
    name: "Penteados com Referência",
    desc: "Penteados inspirados em fotos ou ocasiões específicas. Consulta prévia para avaliação.",
    priceFrom: "desde 50€",
  },
  {
    id: "t3",
    category: "penteados",
    name: "Penteado Noiva",
    desc: "Penteado elaborado para noivas, com acabamento perfeito e duradouro.",
    priceFrom: "desde 70€",
  },

  {
    id: "c1",
    category: "cabelo",
    name: "Lavagem + hidratação",
    desc: "Tratamento para brilho e maciez. Ideal antes de penteados/tranças.",
    priceFrom: "desde 30€",
  },
  {
    id: "c2",
    category: "cabelo",
    name: "Escova + finalização",
    desc: "Escova com acabamento polido e duradouro.",
    priceFrom: "desde 15€",
  },
  {
    id: "c3",
    category: "cabelo",
    name: "Corte (feminino)",
    desc: "Corte pensado para o teu formato de rosto e rotina.",
    priceFrom: "desde 15€",
  },

    {
    id: "c4",
    category: "cabelo",
    name: "Corte (masculino/infantil)",
    desc: "Corte pensado para o teu formato de rosto e rotina.",
    priceFrom: "desde 12€",
  },

    {
    id: "c5",
    category: "cabelo",
    name: "Progressiva",
    desc: "Tratamento para alisar o cabelo e dar-lhe volume.",
    priceFrom: "desde 90€",
  },

    {
    id: "c6",
    category: "cabelo",
    name: "Relaxamento capilar",
    desc: "Tratamento para alisar o cabelo e reduzir o volume, ideal para cabelos crespos ou muito volumosos.",
    priceFrom: "desde 60€",
  },

  {
    id: "d1",
    category: "domicilio",
    name: "Atendimento ao domicílio",
    desc: "Lisboa e arredores. O valor final depende da zona e do serviço.",
    priceFrom: "sob consulta",
    badge: "Lisboa",
  },
];