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
  priceFrom: "desde 45€",
},
{
  id: "col2",
  category: "coloracao",
  name: "Balayage",
  desc: "Técnica de iluminação natural, personalizada conforme o teu cabelo.",
  priceFrom: "desde 120€",
  badge: "Tendência",
},
{
  id: "col3",
  category: "coloracao",
  name: "Madeixas",
  desc: "Clareamento localizado para dar luz e profundidade ao cabelo.",
  priceFrom: "desde 90€",
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
    name: "Knotless Braids",
    desc: "Mais leve na raiz e com resultado natural. Ideal para quem quer conforto.",
    priceFrom: "desde 110€",
  },
  {
    id: "t3",
    category: "penteados",
    name: "Twists",
    desc: "Opção versátil e elegante com excelente durabilidade.",
    priceFrom: "desde 75€",
  },
  {
    id: "t4",
    category: "penteados",
    name: "Cornrows (nagô)",
    desc: "Riscas precisas e design personalizado (simples a elaborado).",
    priceFrom: "desde 35€",
  },

  {
    id: "c1",
    category: "cabelo",
    name: "Lavagem + hidratação",
    desc: "Tratamento para brilho e maciez. Ideal antes de penteados/tranças.",
    priceFrom: "desde 20€",
  },
  {
    id: "c2",
    category: "cabelo",
    name: "Escova + finalização",
    desc: "Escova com acabamento polido e duradouro.",
    priceFrom: "desde 18€",
  },
  {
    id: "c3",
    category: "cabelo",
    name: "Corte (feminino)",
    desc: "Corte pensado para o teu formato de rosto e rotina.",
    priceFrom: "desde 15€",
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

