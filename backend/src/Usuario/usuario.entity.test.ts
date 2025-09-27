
import { describe, it, expect, beforeEach } from 'vitest'
import { Usuario } from './usuario.entity.js'
import * as bcrypt from 'bcrypt'

describe('Usuario Entity - Hasheo de Contraseñas', () => {
  let usuario: Usuario

  beforeEach(() => {
    usuario = new Usuario()
    usuario.nombreUsuario = 'testuser'
    usuario.nombre = 'Test User'
    usuario.mail = 'test@example.com'
    usuario.tipoUsuario = 'cliente'
    usuario.fechaNacimiento = new Date('1990-01-01')
    usuario.fechaCreacion = new Date()
    usuario.urlFoto = 'https://example.com/foto.jpg'
  })

  it('debe hashear la contraseña al crear el usuario', async () => {
    // Arrange
    const contraseniaPlana = 'miPasswordSegura123'
    usuario.contrasenia = contraseniaPlana

    // Act
    await usuario.hashPasswordOnCreate()

    // Assert
    expect(usuario.contrasenia).not.toBe(contraseniaPlana)
    expect(usuario.contrasenia.startsWith('$2b$')).toBe(true)
    const match = await bcrypt.compare(contraseniaPlana, usuario.contrasenia)
    expect(match).toBe(true)
  })

  it('debe hashear la contraseña al actualizar si cambió', async () => {
    // Arrange
    const contraseniaOriginal = 'original123'
    usuario.contrasenia = contraseniaOriginal
    await usuario.hashPasswordOnCreate()
    const nuevaContrasenia = 'nuevaPassword456'
    usuario.contrasenia = nuevaContrasenia

    // Act
    await usuario.hashPasswordOnUpdate()

    // Assert
    expect(usuario.contrasenia).not.toBe(nuevaContrasenia)
    expect(usuario.contrasenia.startsWith('$2b$')).toBe(true)
    const match = await bcrypt.compare(nuevaContrasenia, usuario.contrasenia)
    expect(match).toBe(true)
  })

  it('no debe volver a hashear si la contraseña ya está hasheada', async () => {
    // Arrange
    const contraseniaPlana = 'yaHasheada123'
    usuario.contrasenia = await bcrypt.hash(contraseniaPlana, 10)
    const contraseniaHasheadaAntes = usuario.contrasenia

    // Act
    await usuario.hashPasswordOnUpdate()

    // Assert
    expect(usuario.contrasenia).toBe(contraseniaHasheadaAntes)
  })
})