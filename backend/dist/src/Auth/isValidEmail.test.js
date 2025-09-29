import { describe, it, expect, vi } from 'vitest';
// Mock del ORM para evitar problemas de inicialización en tests unitarios
vi.mock('../shared/orm.js', () => ({
    orm: { em: {} }
}));
// Mock de la entidad Usuario
vi.mock('../Usuario/usuario.entity.js', () => ({
    Usuario: vi.fn()
}));
import { isValidEmail } from './auth.controller.js';
describe('isValidEmail - Validación de formato de email', () => {
    it('debe validar emails correctos', () => {
        const emailsValidos = [
            'usuario@example.com',
            'test123@gmail.com',
            'admin@empresa.co.ar',
            'nombre.apellido@dominio.org',
            'user+tag@subdomain.company.com',
            'simple@domain.co',
            'x@y.z'
        ];
        emailsValidos.forEach(email => {
            expect(isValidEmail(email)).toBe(true);
        });
    });
    it('debe rechazar emails sin @', () => {
        const emailsInvalidos = [
            'usuarioexample.com',
            'admin.dominio.com',
            'nombre.apellido',
            'test123gmail.com'
        ];
        emailsInvalidos.forEach(email => {
            expect(isValidEmail(email)).toBe(false);
        });
    });
    it('debe rechazar emails sin dominio', () => {
        const emailsInvalidos = [
            'usuario@',
            'admin@.',
            'test@',
            'email@.'
        ];
        emailsInvalidos.forEach(email => {
            expect(isValidEmail(email)).toBe(false);
        });
    });
    it('debe rechazar emails sin parte local', () => {
        const emailsInvalidos = [
            '@example.com',
            '@gmail.com',
            '@dominio.org',
            '@test.co'
        ];
        emailsInvalidos.forEach(email => {
            expect(isValidEmail(email)).toBe(false);
        });
    });
    it('debe rechazar emails con espacios', () => {
        const emailsInvalidos = [
            'usuario con espacios@example.com',
            'usuario@example .com',
            'usuario@exam ple.com',
            ' usuario@example.com',
            'usuario@example.com ',
            'usuario @example.com',
            'usuario@ example.com'
        ];
        emailsInvalidos.forEach(email => {
            expect(isValidEmail(email)).toBe(false);
        });
    });
    it('debe rechazar emails sin punto en el dominio', () => {
        const emailsInvalidos = [
            'usuario@example',
            'test@gmail',
            'admin@domain',
            'email@localhost'
        ];
        emailsInvalidos.forEach(email => {
            expect(isValidEmail(email)).toBe(false);
        });
    });
    it('debe rechazar strings vacíos y null/undefined', () => {
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail(' ')).toBe(false);
        expect(isValidEmail('   ')).toBe(false);
    });
    it('debe rechazar emails con múltiples @', () => {
        const emailsInvalidos = [
            'usuario@@example.com',
            'usuario@exam@ple.com',
            'us@uario@example.com',
            '@@example.com'
        ];
        emailsInvalidos.forEach(email => {
            expect(isValidEmail(email)).toBe(false);
        });
    });
    it('debe manejar caracteres especiales válidos', () => {
        const emailsValidos = [
            'user.name@example.com',
            'user_name@example.com',
            'user-name@example.com',
            'user+tag@example.com',
            '123456@example.com',
            'a@b.co'
        ];
        emailsValidos.forEach(email => {
            expect(isValidEmail(email)).toBe(true);
        });
    });
    it('debe validar dominios con múltiples niveles', () => {
        const emailsValidos = [
            'usuario@mail.google.com',
            'test@subdomain.empresa.com.ar',
            'admin@portal.universidad.edu.co',
            'contact@deep.sub.domain.org'
        ];
        emailsValidos.forEach(email => {
            expect(isValidEmail(email)).toBe(true);
        });
    });
});
//# sourceMappingURL=isValidEmail.test.js.map