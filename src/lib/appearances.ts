/**
 * APARÊNCIAS — estrutura de configuração editável.
 *
 * Cada aparência tem:
 *  - label:       nome exibido na interface
 *  - modelo:      (opcional) id de modelo de imagem. Deixe "" para usar o modelo padrão.
 *                 Preencha aqui quando você fornecer os modelos.
 *  - configuracao: instrução de estilo adicionada ao prompt do usuário (nunca substitui o prompt).
 *
 * Para associar um modelo próprio a uma aparência, basta preencher o campo `modelo`.
 */
export type AppearanceId =
  | "3d-pixar"
  | "anime"
  | "arte-biblica"
  | "cartoon"
  | "cinematografico-dramatico"
  | "cinematografico"
  | "ilustracao"
  | "pintura-classica"
  | "realista";

export type Appearance = {
  label: string;
  modelo: string;
  configuracao: string;
};

export const aparencias: Record<AppearanceId, Appearance> = {
  "3d-pixar": {
    label: "3D Pixar",
    modelo: "",
    configuracao:
      "estilo animação 3D tipo Pixar, personagens estilizados, iluminação suave, cores vibrantes, render 3D limpo",
  },
  anime: {
    label: "Anime",
    modelo: "",
    configuracao:
      "estilo anime japonês, traço limpo, cores saturadas, sombreamento em células, olhos expressivos",
  },
  "arte-biblica": {
    label: "Arte Bíblica",
    modelo: "",
    configuracao:
      "estilo de arte sacra bíblica, luz divina dourada, composição solene e reverente, atmosfera espiritual",
  },
  cartoon: {
    label: "Cartoon",
    modelo: "",
    configuracao: "estilo cartoon, formas simplificadas, contornos marcados, cores chapadas e alegres",
  },
  "cinematografico-dramatico": {
    label: "Cinematográfico Dramático",
    modelo: "",
    configuracao:
      "fotografia cinematográfica dramática, alto contraste, luz lateral forte, sombras profundas, clima tenso",
  },
  cinematografico: {
    label: "Cinematográfico",
    modelo: "",
    configuracao:
      "fotografia cinematográfica, lente 35mm, profundidade de campo, gradação de cor de cinema, luz natural equilibrada",
  },
  ilustracao: {
    label: "Ilustração",
    modelo: "",
    configuracao: "ilustração digital artística, pinceladas visíveis, paleta harmônica, arte editorial",
  },
  "pintura-classica": {
    label: "Pintura Clássica",
    modelo: "",
    configuracao:
      "pintura clássica a óleo, técnica dos grandes mestres, textura de tela, claro-escuro, tons terrosos",
  },
  realista: {
    label: "Realista",
    modelo: "",
    configuracao: "fotorrealista, hiper-realismo, nitidez alta, textura de pele e materiais reais, luz natural",
  },
};

export const appearanceIds = Object.keys(aparencias) as AppearanceId[];
