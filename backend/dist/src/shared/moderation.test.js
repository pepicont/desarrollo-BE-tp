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
        const moderationModule = await import('./moderation.js');
        moderateText = moderationModule.moderateText;
    });
    afterEach(() => {
        // Restaurar variables de entorno
        process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY;
        process.env.OPENAI_MODERATION_MODEL = originalEnv.OPENAI_MODERATION_MODEL;
    });
    it('debe permitir contenido cuando OPENAI_API_KEY no está configurada', async () => {
        // Arrange
        delete process.env.OPENAI_API_KEY;
        // Act
        const resultado = await moderateText('Este es un texto normal');
        // Assert
        expect(resultado).toEqual({ allowed: true, reasons: [] });
        expect(mockCreate).not.toHaveBeenCalled();
    });
    it('debe bloquear contenido cuando OpenAI responde flagged=true', async () => {
        // Arrange
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
        // Act
        const resultado = await moderateText('texto ofensivo');
        // Assert
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
        // Arrange
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
        // Act
        const resultado = await moderateText('texto normal');
        // Assert
        expect(resultado).toEqual({
            allowed: true,
            reasons: []
        });
    });
    it('debe permitir contenido por fallback cuando OpenAI da error', async () => {
        // Arrange
        process.env.OPENAI_API_KEY = 'sk-test-key';
        mockCreate.mockRejectedValue(new Error('API Error'));
        // Act
        const resultado = await moderateText('cualquier texto');
        // Assert
        expect(resultado).toEqual({ allowed: true, reasons: [] });
    });
    it('debe usar el modelo personalizado cuando está configurado', async () => {
        // Arrange
        process.env.OPENAI_API_KEY = 'sk-test-key';
        process.env.OPENAI_MODERATION_MODEL = 'text-moderation-stable';
        mockCreate.mockResolvedValue({
            results: [{ flagged: false, categories: {} }]
        });
        // Act
        await moderateText('texto de prueba');
        // Assert
        expect(mockCreate).toHaveBeenCalledWith({
            model: expect.any(String),
            input: 'texto de prueba'
        });
    });
});
//# sourceMappingURL=moderation.test.js.map