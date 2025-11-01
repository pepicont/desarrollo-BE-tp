import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODERATION_MODEL = process.env.OPENAI_MODERATION_MODEL || 'omni-moderation-latest';
export const MODERATION_ENABLED = Boolean(OPENAI_API_KEY);
let client = null;
function getClient() {
    if (!MODERATION_ENABLED)
        return null;
    if (!client) {
        client = new OpenAI({ apiKey: OPENAI_API_KEY });
    }
    return client;
}
export async function moderateText(text) {
    const openai = getClient();
    if (!openai) {
        return { allowed: true, reasons: [] };
    }
    try {
        const resp = await openai.moderations.create({
            model: OPENAI_MODERATION_MODEL,
            input: text,
        });
        const anyResp = resp;
        const result = anyResp?.results?.[0];
        const flagged = Boolean(result?.flagged);
        const categories = result?.categories ?? {};
        const reasons = Object.keys(categories).filter((k) => categories[k]);
        return { allowed: !flagged, reasons };
    }
    catch (err) {
        console.warn('[moderation] error al llamar a OpenAI, permitiendo contenido por fallback (modo tolerante):', err);
        return { allowed: true, reasons: [] };
    }
}
//# sourceMappingURL=moderation.js.map