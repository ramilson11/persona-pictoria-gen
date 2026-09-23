import { createFileRoute } from "@tanstack/react-router";

type Body = {
  prompt?: string;
  token?: string;
  model?: string;
  width?: number;
  height?: number;
};

const DEFAULT_MODEL = "black-forest-labs/FLUX.1-schnell";

export const Route = createFileRoute("/api/hf-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return Response.json({ error: "Corpo inválido." }, { status: 400 });
        }

        const prompt = (body.prompt ?? "").trim();
        const token = (body.token ?? "").trim();
        if (!prompt) return Response.json({ error: "Prompt obrigatório." }, { status: 400 });
        if (!token) return Response.json({ error: "Token do Hugging Face obrigatório." }, { status: 400 });

        const model = (body.model ?? "").trim() || DEFAULT_MODEL;
        const parameters: Record<string, number> = {};
        if (body.width && body.height) {
          parameters.width = body.width;
          parameters.height = body.height;
        }

        const res = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "image/png",
          },
          body: JSON.stringify({
            inputs: prompt,
            ...(Object.keys(parameters).length ? { parameters } : {}),
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          return Response.json(
            { error: text.slice(0, 500) || `Hugging Face respondeu ${res.status}.` },
            { status: res.status },
          );
        }

        const type = res.headers.get("content-type") ?? "";
        if (type.includes("application/json")) {
          const data = (await res.json()) as { image?: string; images?: string[]; error?: string };
          const b64 = data.image ?? data.images?.[0];
          if (!b64) return Response.json({ error: data.error ?? "Resposta sem imagem." }, { status: 502 });
          return Response.json({ image: b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}` });
        }

        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
        const b64 = btoa(binary);
        return Response.json({ image: `data:${type || "image/png"};base64,${b64}` });
      },
    },
  },
});
