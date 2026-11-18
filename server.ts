import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const CREATOR_SYSTEM_INSTRUCTION = `# NOMBRE DEL ASISTENTE: PlanetaBot - Asistente Oficial de Agencia Planeta

## ROL Y OBJETIVO
Eres el Asistente Virtual de Bienvenida e Información de **Agencia Planeta**. Hablas DIRECTAMENTE con creadores de contenido (de TikTok, Instagram, transmisiones en vivo, etc.) que están evaluando unirse a la agencia o tienen dudas sobre cómo trabajamos.

Tu objetivo es brindar información clara, honesta, empática y entusiasta sobre Agencia Planeta, eliminar cualquier miedo o mito sobre las agencias de creadores, transmitir total confianza y guiar al creador para que se anime a unirse gratis.

## BASE DE CONOCIMIENTO CENTRAL (POLÍTICAS DE AGENCIA PLANETA)
Utiliza SIEMPRE estas políticas como la verdad absoluta. Nunca inventes porcentajes, requisitos ocultos ni condiciones fuera de esta base:

1. GANANCIAS Y COMISIONES (Cero cobros para ti):
   - Agencia Planeta NO te quita ningún porcentaje de tus diamantes, regalos ni ganancias. El 100% de lo que generas es tuyo.
   - A la agencia le paga directamente la plataforma (por ejemplo, TikTok) a través de bonos de rendimiento y metas alcanzadas como equipo.
   - Unirse a Agencia Planeta es 100% GRATIS, sin cuotas ni pagos ocultos.

2. HORARIOS Y LIBERTAD:
   - NO hay horarios obligatorios ni jefes. Tú manejas tu tiempo y tu contenido con total libertad.
   - Recomendamos constancia (un mínimo de 10 a 15 horas al mes para ver mejores resultados y crecer en la plataforma), pero la decisión final siempre es tuya.

3. PROPIEDAD DE LA CUENTA:
   - Tu cuenta es 100% tuya. La agencia NUNCA pide contraseñas, accesos privados ni se adueña de tu perfil.
   - Si en el futuro decides irte de la agencia, conservas tu cuenta intacta y sin ningún tipo de penalización.

4. BENEFICIOS DE AGENCIA PLANETA:
   - Soporte Técnico 24/7: Ayuda directa si sufres baneos injustos, sombras (shadowban) o problemas de cobro.
   - Academia y Capacitación: Asesoría personalizada para mejorar tu iluminación, calidad de contenido y retención de audiencia.
   - Eventos y Retos de Graduación: Acceso a batallas oficiales, eventos globales de la plataforma y bonos extra de dinero o tráfico por cumplir retos internos de la agencia.

5. CÓMO UNIRSE (PROCESO DE INGRESO):
   - El proceso es 100% gratuito y sin compromiso.
   - Solo necesitamos revisar tu @usuario público para enviarte la invitación oficial directamente dentro de la plataforma (nunca te pediremos contraseña).
   - Puedes usar el botón "Unirme gratis" en esta página para dejar tu @usuario y medio de contacto y que nuestro equipo te envíe tu invitación oficial.

## REGLAS DE COMUNICACIÓN CON EL CREADOR
- Habla siempre en segunda persona directamente al creador (tuteo cercano, respetuoso, cálido y profesional).
- Nunca redactes mensajes como "guiones para un reclutador" ni digas "opción 1 / opción 2"; tú eres el asistente hablando cara a cara con el creador.
- Estructura tus respuestas con claridad: valida la duda con empatía, responde de forma directa usando las políticas reales de Agencia Planeta, destaca el beneficio relevante y cierra invitando a hacer otra pregunta o a dar el paso para unirse.
- Usa párrafos cortos (2 a 4 párrafos breves o viñetas simples cuando listes beneficios) y emoticonos moderados y naturales (máximo 2 a 4 por mensaje) para que se sienta cercano y humano.
- Si el creador pregunta algo que no está en las políticas (por ejemplo, temas legales específicos o montos exactos de premios privados), responde con honestidad lo que sí garantiza Agencia Planeta e invítalo a dejar su contacto en "Unirme gratis" para que un asesor humano revise su perfil específico.`;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_GEMINI_API_KEY");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

interface IncomingMessage {
  role: "user" | "model";
  text: string;
}

interface ChatRequestBody {
  messages?: IncomingMessage[];
  creatorPlatform?: string;
}

interface ApplyRequestBody {
  handle?: string;
  platform?: string;
  contact?: string;
  notes?: string;
}

const recentApplications: Array<{
  id: string;
  handle: string;
  platform: string;
  contact: string;
  notes: string;
  submittedAt: string;
}> = [];

async function generateCreatorReplyWithRetry(
  messages: IncomingMessage[],
  creatorPlatform?: string
) {
  const ai = getAiClient();
  const maxAttempts = 2;
  let lastError: unknown;

  const contents = messages.map((msg, index) => {
    const prefix =
      index === 0 && msg.role === "user" && creatorPlatform
        ? `[Plataforma principal del creador: ${creatorPlatform}]\n`
        : "";
    return {
      role: msg.role,
      parts: [{ text: `${prefix}${msg.text}` }],
    };
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents,
        config: {
          systemInstruction: CREATOR_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  "Respuesta directa, cálida, clara y transparente para el creador en español, usando párrafos cortos.",
              },
              policyTopic: {
                type: Type.STRING,
                description:
                  "Tema principal tratado: Ganancias y Comisiones, Horarios y Libertad, Propiedad de la Cuenta, Beneficios y Soporte, Proceso de Ingreso, o Información General.",
              },
              suggestedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "2 o 3 preguntas breves y naturales que el creador podría querer hacer a continuación.",
              },
            },
            required: ["reply", "policyTopic", "suggestedQuestions"],
          },
        },
      });

      const raw = (response.text ?? "").trim();
      if (!raw) {
        throw new Error("La respuesta del modelo llegó vacía.");
      }

      return JSON.parse(raw);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg === "MISSING_GEMINI_API_KEY" ||
        msg.includes("403") ||
        msg.includes("400") ||
        msg.includes("API_KEY_INVALID") ||
        msg.includes("PERMISSION_DENIED")
      ) {
        throw err;
      }
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const body = (req.body ?? {}) as ChatRequestBody;
      const rawMessages = Array.isArray(body.messages) ? body.messages : [];
      const sanitizedMessages: IncomingMessage[] = rawMessages
        .filter(
          (m): m is IncomingMessage =>
            Boolean(m) &&
            (m.role === "user" || m.role === "model") &&
            typeof m.text === "string" &&
            m.text.trim().length > 0
        )
        .slice(-20);

      if (sanitizedMessages.length === 0) {
        res.status(400).json({
          error: "Escribe tu pregunta para que PlanetaBot pueda ayudarte.",
        });
        return;
      }

      const lastMsg = sanitizedMessages[sanitizedMessages.length - 1];
      if (lastMsg.role !== "user") {
        res.status(400).json({
          error: "El último mensaje de la conversación debe ser del creador.",
        });
        return;
      }

      const result = await generateCreatorReplyWithRetry(
        sanitizedMessages,
        body.creatorPlatform?.trim()
      );
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[PlanetaBot Chat Error]", message);

      if (message === "MISSING_GEMINI_API_KEY") {
        res.status(503).json({
          error:
            "Falta configurar GEMINI_API_KEY en los secretos del entorno para conectar con el asistente.",
        });
        return;
      }

      if (
        message.includes("PERMISSION_DENIED") ||
        message.includes("API_KEY_INVALID") ||
        message.includes("403")
      ) {
        res.status(403).json({
          error:
            "La clave de Gemini API no es válida o no tiene permisos. Verifica la configuración en Settings > Secrets.",
        });
        return;
      }

      if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) {
        res.status(429).json({
          error:
            "Se alcanzó el límite temporal de solicitudes de la API. Espera unos segundos e intenta de nuevo.",
        });
        return;
      }

      res.status(500).json({
        error:
          "No pudimos responder en este momento. Intenta nuevamente en unos segundos.",
      });
    }
  });

  app.post("/api/creators/apply", (req, res) => {
    const body = (req.body ?? {}) as ApplyRequestBody;
    const handle = typeof body.handle === "string" ? body.handle.trim() : "";
    const platform =
      typeof body.platform === "string" ? body.platform.trim() : "";
    const contact = typeof body.contact === "string" ? body.contact.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!handle || !platform || !contact) {
      res.status(400).json({
        error:
          "Por favor completa tu usuario, plataforma y un medio de contacto.",
      });
      return;
    }

    const entry = {
      id: `PL-${Date.now().toString(36).toUpperCase()}`,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      platform,
      contact,
      notes,
      submittedAt: new Date().toISOString(),
    };

    recentApplications.unshift(entry);
    if (recentApplications.length > 100) {
      recentApplications.pop();
    }

    res.status(201).json({
      application: entry,
      message:
        "Solicitud registrada. Un asesor de Agencia Planeta revisará tu perfil público y te enviará la invitación oficial sin pedir contraseñas.",
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PlanetaBot server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start PlanetaBot server:", err);
  process.exit(1);
});
