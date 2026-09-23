import { createFileRoute } from "@tanstack/react-router";
import { generateImage, imageSettings } from "@/lib/image-gateway.server";

const SIZE = /^(auto|\d{2,4}x\d{2,4})$/;
const QUALITIES = new Set(["low", "medium", "high", "xhigh", "max", "auto"]);

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          prompt?: string;
          size?: string;
          quality?: string;
          model?: string;
          stream?: boolean;
        };
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        if (!body.prompt?.trim()) return new Response("Prompt obrigatório", { status: 400 });

        const stream = body.stream !== false;
        const model = body.model?.trim() ? body.model.trim() : imageSettings.model;
        const upstream = await generateImage({ ...imageSettings, model, apiKey }, body.prompt, stream, {
          ...(body.size && SIZE.test(body.size) && body.size !== "auto" ? { size: body.size } : {}),
          ...(body.quality && QUALITIES.has(body.quality) ? { quality: body.quality } : {}),
        });
        return new Response(upstream.body, {
          status: upstream.status,
          headers: {
            "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
