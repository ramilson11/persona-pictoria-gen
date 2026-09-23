import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
  User,
  Wand2,
  X,
  ChevronDown,
} from "lucide-react";

import { Chips, Field, type ChipOption } from "@/components/studio/Chips";
import { aparencias, appearanceIds, type AppearanceId } from "@/lib/appearances";
import {
  aspects,
  computeSize,
  downscaleTarget,
  framings,
  qualities,
  qualityValue,
  resolutions,
  type AspectId,
  type FramingId,
  type QualityId,
  type ResolutionId,
} from "@/lib/image-options";
import { streamImage } from "@/lib/stream-image";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Invente com IA — Estúdio de Imagens" },
      {
        name: "description",
        content:
          "Gere e edite imagens com IA: aparência, proporção, resolução, qualidade, enquadramento e personagem de referência.",
      },
      { property: "og:title", content: "Invente com IA — Estúdio de Imagens" },
      {
        property: "og:description",
        content: "Escreva sua ideia, escolha a aparência e crie imagens em segundos.",
      },
    ],
  }),
  component: Studio,
});

type Mode = "create" | "edit";
type ViewState = "placeholder" | "loading" | "image";
type Pic = { file: File; url: string };

const HISTORY_KEY = "invente-ia-history";
const HF_TOKEN_KEY = "invente-ia-hf-token";
const HF_MODEL_KEY = "invente-ia-hf-model";

const appearanceOptions: ChipOption<AppearanceId | "none">[] = [
  { id: "none", label: "Nenhuma", hint: "Sem estilo definido" },
  ...appearanceIds.map((id) => ({ id, label: aparencias[id].label })),
];

async function toFile(dataUrl: string, name: string) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], name, { type: blob.type || "image/png" });
}

function resizeDataUrl(dataUrl: string, width: number, height: number) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function Studio() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<Mode>("create");
  const [appearance, setAppearance] = useState<AppearanceId | "none">("none");
  const [aspect, setAspect] = useState<AspectId>("auto");
  const [resolution, setResolution] = useState<ResolutionId>("auto");
  const [quality, setQuality] = useState<QualityId>("auto");
  const [framing, setFraming] = useState<FramingId>("none");

  const [hfOpen, setHfOpen] = useState(false);
  const [hfTokenInput, setHfTokenInput] = useState("");
  const [hfModelInput, setHfModelInput] = useState("");
  const [hfToken, setHfToken] = useState("");
  const [hfModel, setHfModel] = useState("");
  const [hfSaved, setHfSaved] = useState(false);
  const [provider, setProvider] = useState<"padrao" | "hf">("padrao");

  const [additionalsOpen, setAdditionalsOpen] = useState(false);
  const [characterOpen, setCharacterOpen] = useState(false);
  const [characterRef, setCharacterRef] = useState<Pic | null>(null);
  const [keepCharacter, setKeepCharacter] = useState(true);

  const [sourceImage, setSourceImage] = useState<Pic | null>(null);

  const [viewState, setViewState] = useState<ViewState>("placeholder");
  const [image, setImage] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const characterInput = useRef<HTMLInputElement>(null);
  const sourceInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved) as string[]);
    } catch {
      /* histórico indisponível */
    }
    try {
      const token = localStorage.getItem(HF_TOKEN_KEY) ?? "";
      const model = localStorage.getItem(HF_MODEL_KEY) ?? "";
      if (token) {
        setHfToken(token);
        setHfTokenInput(token);
        setHfSaved(true);
        setProvider("hf");
      }
      if (model) {
        setHfModel(model);
        setHfModelInput(model);
      }
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  const saveHf = () => {
    const token = hfTokenInput.trim();
    const model = hfModelInput.trim();
    setHfToken(token);
    setHfModel(model);
    setHfSaved(Boolean(token));
    try {
      if (token) localStorage.setItem(HF_TOKEN_KEY, token);
      else localStorage.removeItem(HF_TOKEN_KEY);
      if (model) localStorage.setItem(HF_MODEL_KEY, model);
      else localStorage.removeItem(HF_MODEL_KEY);
    } catch {
      /* armazenamento indisponível */
    }
    if (token) setProvider("hf");
  };

  const clearHf = () => {
    setHfTokenInput("");
    setHfModelInput("");
    setHfToken("");
    setHfModel("");
    setHfSaved(false);
    setProvider("padrao");
    try {
      localStorage.removeItem(HF_TOKEN_KEY);
      localStorage.removeItem(HF_MODEL_KEY);
    } catch {
      /* armazenamento indisponível */
    }
  };

  const pushHistory = useCallback((url: string) => {
    setHistory((prev) => {
      const next = [url, ...prev].slice(0, 12);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* espaço insuficiente */
      }
      return next;
    });
  }, []);

  const buildPrompt = () => {
    const extras: string[] = [];
    if (appearance !== "none") extras.push(aparencias[appearance].configuracao);
    const frame = framings.find((f) => f.id === framing);
    if (frame?.instruction) extras.push(frame.instruction);
    if (mode === "create" && characterRef) {
      extras.push("mantenha a aparência do personagem da imagem de referência");
    }
    return extras.length ? `${prompt.trim()}. ${extras.join(", ")}` : prompt.trim();
  };

  const run = useCallback(
    async (overridePrompt?: string) => {
      const base = (overridePrompt ?? prompt).trim();
      if (!base) {
        setError("Escreva sua ideia no prompt.");
        return;
      }
      if (mode === "edit" && !sourceImage) {
        setError("Selecione uma imagem para editar.");
        return;
      }

      const finalPrompt = overridePrompt ? overridePrompt : buildPrompt();
      const size = computeSize(aspect, resolution);
      const q = qualityValue(quality);
      const model = appearance !== "none" ? aparencias[appearance].modelo : "";

      setError(null);
      setViewState("loading");
      setImage(null);
      setIsFinal(false);

      const reference = mode === "edit" ? sourceImage : characterRef;

      try {
        let last: string | null = null;
        const onFrame = (dataUrl: string, final: boolean) => {
          last = dataUrl;
          setImage(dataUrl);
          setIsFinal(final);
          if (final) setViewState("image");
        };

        const useHf = provider === "hf" && Boolean(hfToken) && !reference;

        if (useHf) {
          const [w, h] = (size ?? "").split("x").map((n) => Number(n));
          const res = await fetch("/api/hf-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: finalPrompt,
              token: hfToken,
              ...(hfModel ? { model: hfModel } : {}),
              ...(w && h ? { width: w, height: h } : {}),
            }),
          });
          const data = (await res.json()) as { image?: string; error?: string };
          if (!res.ok || !data.image) throw new Error(data.error ?? "Falha ao gerar no Hugging Face.");
          onFrame(data.image, true);
        } else if (reference) {
          const form = new FormData();
          form.append("prompt", finalPrompt);
          form.append("image", reference.file);
          if (size) form.append("size", size);
          if (q) form.append("quality", q);
          if (model) form.append("model", model);
          await streamImage("/api/edit-image", form, onFrame);
        } else {
          await streamImage(
            "/api/generate-image",
            { prompt: finalPrompt, ...(size ? { size } : {}), ...(q ? { quality: q } : {}), ...(model ? { model } : {}) },
            onFrame,
          );
        }

        if (last) {
          const target = downscaleTarget(resolution, aspect);
          const finalUrl = target ? await resizeDataUrl(last, target.width, target.height) : last;
          setImage(finalUrl);
          setIsFinal(true);
          setViewState("image");
          pushHistory(finalUrl);
        }
        if (mode === "create" && characterRef && !keepCharacter) setCharacterRef(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido ao gerar a imagem.");
        setViewState("placeholder");
        setImage(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      prompt,
      mode,
      sourceImage,
      characterRef,
      keepCharacter,
      appearance,
      aspect,
      resolution,
      quality,
      framing,
      provider,
      hfToken,
      hfModel,
    ],
  );

  const download = (format: "png" | "jpeg" | "webp") => {
    if (!image) return;
    const save = (url: string, ext: string) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `invente-com-ia.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    if (format === "png") return save(image, "png");
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      save(canvas.toDataURL(`image/${format}`, 0.92), format);
    };
    img.src = image;
  };

  const pickCharacter = (file?: File) => {
    if (!file) return;
    setCharacterRef({ file, url: URL.createObjectURL(file) });
  };

  const pickSource = (file?: File) => {
    if (!file) return;
    setSourceImage({ file, url: URL.createObjectURL(file) });
  };

  const useFromHistory = async (url: string) => {
    setImage(url);
    setIsFinal(true);
    setViewState("image");
    setMode("edit");
    setSourceImage({ file: await toFile(url, "historico.png"), url });
    setPrompt("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loading = viewState === "loading";

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:p-6 lg:grid-cols-[420px_1fr]">
      {/* Painel de controles */}
      <section className="panel-surface flex flex-col gap-5 p-5">
        <header className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h1 className="text-lg leading-tight font-semibold">Invente com IA</h1>
            <p className="text-xs text-muted-foreground">Estúdio de imagens</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-secondary p-1">
          {(["create", "edit"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-colors",
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "create" ? "CRIAR" : "EDITAR"}
            </button>
          ))}
        </div>

        <Field label="Sua ideia">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder={
              mode === "create"
                ? "Ex.: São Jorge montado em seu cavalo diante de uma igreja"
                : "Descreva a alteração que deseja na imagem"
            }
            className="w-full resize-y rounded-xl border border-input bg-card p-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary"
          />
        </Field>

        {mode === "edit" && (
          <Field label="Imagem para editar">
            <input
              ref={sourceInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickSource(e.target.files?.[0])}
            />
            {sourceImage ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2">
                <img src={sourceImage.url} alt="Imagem original" className="size-14 rounded-lg object-cover" />
                <div className="flex flex-1 gap-1.5">
                  <button type="button" onClick={() => sourceInput.current?.click()} className="chip cursor-pointer">
                    Substituir
                  </button>
                  <button type="button" onClick={() => setSourceImage(null)} className="chip cursor-pointer">
                    <X className="size-3.5" /> Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => sourceInput.current?.click()}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-6 text-sm text-muted-foreground hover:border-primary/60"
              >
                <ImagePlus className="size-4" /> Selecionar imagem
              </button>
            )}
          </Field>
        )}

        <Field label="Aparência">
          <Chips options={appearanceOptions} value={appearance} onChange={setAppearance} columns={2} />
        </Field>

        <Field label="Proporção">
          <Chips options={aspects.map(({ id, label }) => ({ id, label }))} value={aspect} onChange={setAspect} />
        </Field>

        <Field label="Resolução">
          <Chips
            options={resolutions.map(({ id, label, hint }) => ({ id, label, hint }))}
            value={resolution}
            onChange={setResolution}
          />
        </Field>

        <Field label="Qualidade da imagem">
          <Chips
            options={qualities.map(({ id, label, hint }) => ({ id, label, hint }))}
            value={quality}
            onChange={setQuality}
          />
        </Field>

        <Field label="Enquadramento">
          <Chips
            options={framings.map(({ id, label, hint }) => ({ id, label, hint }))}
            value={framing}
            onChange={setFraming}
            columns={2}
          />
        </Field>

        {/* Adicionais */}
        <div className="rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setAdditionalsOpen((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-3"
          >
            <span className="label-eyebrow">Adicionais</span>
            <ChevronDown className={cn("size-4 transition-transform", additionalsOpen && "rotate-180")} />
          </button>
          {additionalsOpen && (
            <div className="space-y-3 border-t border-border p-3">
              <button
                type="button"
                onClick={() => setCharacterOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between text-sm font-medium"
              >
                <span className="flex items-center gap-2">
                  <User className="size-4" /> 🧍 Personagem
                </span>
                <ChevronDown className={cn("size-4 transition-transform", characterOpen && "rotate-180")} />
              </button>

              {characterOpen && (
                <div className="space-y-3">
                  <input
                    ref={characterInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickCharacter(e.target.files?.[0])}
                  />
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Imagem de referência — Opcional</span>
                    {characterRef ? (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-panel p-2">
                        <img src={characterRef.url} alt="Personagem" className="size-14 rounded-lg object-cover" />
                        <div className="flex flex-1 gap-1.5">
                          <button
                            type="button"
                            onClick={() => characterInput.current?.click()}
                            className="chip cursor-pointer"
                          >
                            Substituir
                          </button>
                          <button type="button" onClick={() => setCharacterRef(null)} className="chip cursor-pointer">
                            <X className="size-3.5" /> Remover
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => characterInput.current?.click()}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary/60"
                      >
                        <ImagePlus className="size-4" /> Adicionar referência
                      </button>
                    )}
                  </div>

                  <Field label="Manter personagem">
                    <Chips
                      options={[
                        { id: "sim", label: "Sim", hint: "Reutiliza a referência" },
                        { id: "nao", label: "Não", hint: "Usa apenas uma vez" },
                      ]}
                      value={keepCharacter ? "sim" : "nao"}
                      onChange={(v) => setKeepCharacter(v === "sim")}
                    />
                  </Field>
                  <p className="text-[0.68rem] leading-snug text-muted-foreground">
                    A referência é usada como imagem de entrada na geração. A semelhança é aproximada, não garantida.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={() => run()}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-display text-sm font-bold tracking-wider text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          {loading ? "GERANDO..." : mode === "create" ? "CRIAR" : "EDITAR"}
        </button>
      </section>

      {/* Resultado + histórico */}
      <section className="flex flex-col gap-4">
        <div className="panel-surface flex min-h-[420px] flex-col gap-4 p-5">
          <div className="grid flex-1 place-items-center overflow-hidden rounded-xl border border-border bg-card">
            {image ? (
              <img
                src={image}
                alt="Imagem gerada"
                className={cn(
                  "max-h-[62vh] w-full object-contain transition-[filter] duration-500",
                  isFinal ? "blur-0" : "blur-2xl",
                )}
              />
            ) : loading ? (
              <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
                <Loader2 className="size-7 animate-spin text-primary" />
                <p className="text-sm">Criando sua imagem…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-24 text-center text-muted-foreground">
                <Sparkles className="size-7 text-primary" />
                <p className="max-w-sm text-sm">
                  Escreva sua ideia, escolha uma aparência e clique em CRIAR. Todas as opções são opcionais.
                </p>
              </div>
            )}
          </div>

          {image && isFinal && (
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => download("png")} className="chip cursor-pointer">
                <Download className="size-3.5" /> PNG
              </button>
              <button type="button" onClick={() => download("jpeg")} className="chip cursor-pointer">
                <Download className="size-3.5" /> JPG
              </button>
              <button type="button" onClick={() => download("webp")} className="chip cursor-pointer">
                <Download className="size-3.5" /> WEBP
              </button>
              <button
                type="button"
                onClick={() => run()}
                disabled={loading}
                className="chip cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className="size-3.5" /> Nova variação
              </button>
            </div>
          )}
        </div>

        <div className="panel-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="label-eyebrow">Histórico</span>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem(HISTORY_KEY);
                }}
                className="chip cursor-pointer"
              >
                <Trash2 className="size-3.5" /> Limpar
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Suas últimas 12 imagens aparecem aqui.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {history.map((url, i) => (
                <button
                  key={`${i}-${url.slice(-12)}`}
                  type="button"
                  onClick={() => useFromHistory(url)}
                  title="Usar esta imagem para editar"
                  className="cursor-pointer overflow-hidden rounded-lg border border-border transition-colors hover:border-primary"
                >
                  <img src={url} alt={`Histórico ${i + 1}`} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
