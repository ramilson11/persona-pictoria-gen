/**
 * Opções de geração: proporção, resolução, qualidade e enquadramento.
 * Somente parâmetros realmente aceitos pelo modelo de imagem são enviados
 * (size e quality). Enquadramento e aparência entram como instrução de prompt.
 */

export type AspectId = "auto" | "16:9" | "9:16" | "1:1" | "4:5";
export type ResolutionId = "auto" | "480p" | "720p" | "1080p";
export type QualityId = "auto" | "rapida" | "alta" | "maxima";
export type FramingId =
  | "none"
  | "plano-aberto"
  | "plano-medio"
  | "close-up"
  | "corpo-inteiro"
  | "vista-aerea"
  | "perfil"
  | "composicao-central";

export const aspects: { id: AspectId; label: string; ratio: number | null }[] = [
  { id: "auto", label: "Automático", ratio: null },
  { id: "16:9", label: "16:9 (Horizontal)", ratio: 16 / 9 },
  { id: "9:16", label: "9:16 (Vertical)", ratio: 9 / 16 },
  { id: "1:1", label: "1:1 (Quadrado)", ratio: 1 },
  { id: "4:5", label: "4:5 (Retrato)", ratio: 4 / 5 },
];

export const resolutions: {
  id: ResolutionId;
  label: string;
  hint: string;
  /** orçamento de pixels enviado ao modelo */
  pixels: number | null;
  /** redução final feita no navegador (o modelo tem mínimo de pixels) */
  downscale?: { width: number; height: number };
}[] = [
  { id: "auto", label: "Automático", hint: "Padrão do modelo", pixels: null },
  {
    id: "480p",
    label: "480p — 854 × 480",
    hint: "Gerado em alta e reduzido",
    pixels: 1280 * 720,
    downscale: { width: 854, height: 480 },
  },
  { id: "720p", label: "720p HD — 1280 × 720", hint: "Rápido e leve", pixels: 1280 * 720 },
  { id: "1080p", label: "1080p Full HD — 1920 × 1080", hint: "Mais detalhe", pixels: 1920 * 1080 },
];

export const qualities: { id: QualityId; label: string; hint: string; value: string | null }[] = [
  { id: "auto", label: "Automático", hint: "Deixa o modelo decidir", value: null },
  { id: "rapida", label: "Rápida", hint: "Prioriza velocidade", value: "low" },
  { id: "alta", label: "Alta", hint: "Mais detalhe e acabamento", value: "high" },
  { id: "maxima", label: "Máxima", hint: "Melhor resultado, mais lento", value: "max" },
];

export const framings: { id: FramingId; label: string; hint: string; instruction: string }[] = [
  { id: "none", label: "Nenhum", hint: "Sem enquadramento definido", instruction: "" },
  {
    id: "plano-aberto",
    label: "Plano aberto",
    hint: "Mostra personagem e cenário",
    instruction: "plano aberto, personagem e cenário visíveis",
  },
  {
    id: "plano-medio",
    label: "Plano médio",
    hint: "Da cintura para cima",
    instruction: "plano médio, personagem da cintura para cima",
  },
  { id: "close-up", label: "Close-up", hint: "Destaca o rosto", instruction: "close-up, rosto em destaque" },
  {
    id: "corpo-inteiro",
    label: "Corpo inteiro",
    hint: "Personagem completo",
    instruction: "enquadramento de corpo inteiro, personagem completo visível",
  },
  {
    id: "vista-aerea",
    label: "Vista aérea",
    hint: "Cena vista de cima",
    instruction: "vista aérea, câmera acima da cena olhando para baixo",
  },
  { id: "perfil", label: "Perfil", hint: "Personagem visto de lado", instruction: "vista de perfil, personagem de lado" },
  {
    id: "composicao-central",
    label: "Composição central",
    hint: "Personagem centralizado",
    instruction: "composição centralizada, personagem no centro do quadro",
  },
];

const MIN_PIXELS = 655360;
const MAX_EDGE = 3840;

const round16 = (n: number) => Math.max(16, Math.round(n / 16) * 16);

/** Traduz proporção + resolução em um valor `size` aceito pelo modelo. */
export function computeSize(aspect: AspectId, resolution: ResolutionId): string | null {
  const ratio = aspects.find((a) => a.id === aspect)?.ratio ?? null;
  const budget = resolutions.find((r) => r.id === resolution)?.pixels ?? null;

  if (!ratio && !budget) return null; // tudo automático: não envia size

  const effectiveRatio = ratio ?? 16 / 9;
  const effectiveBudget = Math.max(budget ?? 1024 * 1024, MIN_PIXELS);

  let height = Math.sqrt(effectiveBudget / effectiveRatio);
  let width = height * effectiveRatio;

  width = Math.min(round16(width), MAX_EDGE);
  height = Math.min(round16(height), MAX_EDGE);

  if (width * height < MIN_PIXELS) {
    const scale = Math.sqrt(MIN_PIXELS / (width * height)) * 1.02;
    width = Math.min(round16(width * scale), MAX_EDGE);
    height = Math.min(round16(height * scale), MAX_EDGE);
  }

  return `${width}x${height}`;
}

export function downscaleTarget(resolution: ResolutionId, aspect: AspectId) {
  const res = resolutions.find((r) => r.id === resolution);
  if (!res?.downscale) return null;
  if (aspect === "auto" || aspect === "16:9") return res.downscale;
  // mantém a proporção escolhida com a mesma altura da resolução
  const ratio = aspects.find((a) => a.id === aspect)?.ratio ?? 16 / 9;
  return { width: Math.round(res.downscale.height * ratio), height: res.downscale.height };
}

export function qualityValue(quality: QualityId) {
  return qualities.find((q) => q.id === quality)?.value ?? null;
}
