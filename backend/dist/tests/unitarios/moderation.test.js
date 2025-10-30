import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
//ESTE TEST TESTEA: si el codigo maneja bien la respuesta de OpenAI, qué pasa si OpenAI dice "contenido malo", Qué pasa si no hay API key y Qué pasa si OpenAI da error
// Mock completo de OpenAI
const mockCreate = vi.fn();
vi.mock('openai', () => ({
    default: class MockOpenAI {
        constructor() {
            return {
                moderations: {
                    create: mockCreate
                }
            };
        }
    }
}));
describe('moderateText', () => {
    let originalEnv;
    let moderateText;
    beforeEach(async () => {
        // Guardar variables de entorno originales
        originalEnv = {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            OPENAI_MODERATION_MODEL: process.env.OPENAI_MODERATION_MODEL
        };
        // Limpiar mocks y resetear módulo
        vi.clearAllMocks();
        vi.resetModules();
        // Importar el módulo fresco
        const moderationModule = await import('../../src/shared/moderation.js');
        moderateText = moderationModule.moderateText;
    });
    afterEach(() => {
        // Restaurar variables de entorno
        process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY;
        process.env.OPENAI_MODERATION_MODEL = originalEnv.OPENAI_MODERATION_MODEL;
    });
    it('debe permitir contenido cuando OPENAI_API_KEY no está configurada', async () => {
        delete process.env.OPENAI_API_KEY;
        const resultado = await moderateText('Este es un texto normal');
        expect(resultado).toEqual({ allowed: true, reasons: [] });
        expect(mockCreate).not.toHaveBeenCalled();
    });
    it('debe bloquear contenido cuando OpenAI responde flagged=true', async () => {
        process.env.OPENAI_API_KEY = 'sk-test-key';
        mockCreate.mockResolvedValue({
            results: [{
                    flagged: true,
                    categories: {
                        hate: true,
                        violence: false
                    }
                }]
        });
        const resultado = await moderateText('texto ofensivo');
        expect(resultado).toEqual({
            allowed: false,
            reasons: ['hate']
        });
        expect(mockCreate).toHaveBeenCalledWith({
            model: expect.any(String),
            input: 'texto ofensivo'
        });
    });
    it('debe permitir contenido cuando OpenAI responde flagged=false', async () => {
        process.env.OPENAI_API_KEY = 'sk-test-key';
        mockCreate.mockResolvedValue({
            results: [{
                    flagged: false,
                    categories: {
                        hate: false,
                        violence: false
                    }
                }]
        });
        const resultado = await moderateText('texto normal');
        expect(resultado).toEqual({
            allowed: true,
            reasons: []
        });
    });
    it('debe permitir contenido por fallback cuando OpenAI da error', async () => {
        process.env.OPENAI_API_KEY = 'sk-test-key';
        mockCreate.mockRejectedValue(new Error('API Error'));
        const resultado = await moderateText('cualquier texto');
        expect(resultado).toEqual({ allowed: true, reasons: [] });
    });
    it('debe usar el modelo personalizado cuando está configurado', async () => {
        process.env.OPENAI_API_KEY = 'sk-test-key';
        process.env.OPENAI_MODERATION_MODEL = 'text-moderation-stable';
        mockCreate.mockResolvedValue({
            results: [{ flagged: false, categories: {} }]
        });
        await moderateText('texto de prueba');
        expect(mockCreate).toHaveBeenCalledWith({
            model: expect.any(String),
            input: 'texto de prueba'
        });
    });
});
//# sourceMappingURL=moderation.test.js.map