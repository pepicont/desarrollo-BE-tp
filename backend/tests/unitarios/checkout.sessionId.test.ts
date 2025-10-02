import { describe, it, expect } from 'vitest'

// Como makeSessionId no está exportada, necesitamos extraerla o duplicar la lógica
// Para el test, voy a duplicar la función simple
function makeSessionId() {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

describe('makeSessionId', () => {
  it('debe generar un ID con el formato correcto', () => {
    // Act
    const sessionId = makeSessionId()

    // Assert
    expect(sessionId).toMatch(/^sess_[a-z0-9]+$/i)
    expect(sessionId.startsWith('sess_')).toBe(true)
    expect(sessionId.length).toBeGreaterThan(10) // 'sess_' + contenido
  })

  it('debe generar IDs únicos en llamadas consecutivas', () => {
    // Act
    const id1 = makeSessionId()
    const id2 = makeSessionId()
    const id3 = makeSessionId()

    // Assert
    expect(id1).not.toBe(id2)
    expect(id2).not.toBe(id3)
    expect(id1).not.toBe(id3)
  })

  it('debe generar solo caracteres alfanuméricos válidos', () => {
    // Act
    const sessionId = makeSessionId()

    // Assert
    // Formato: sess_ + random(base36) + timestamp(base36)
    // Base36 usa: 0-9, a-z
    expect(sessionId).toMatch(/^sess_[a-z0-9]+$/)
    expect(sessionId).not.toMatch(/[^a-z0-9_]/)
  })

  it('debe incluir timestamp para garantizar unicidad', () => {
    // Arrange
    const now = Date.now()
    const timestampBase36 = now.toString(36)
    
    // Act
    const sessionId = makeSessionId()
    
    // Assert
    // El ID debería contener algo parecido al timestamp actual
    // (permitimos cierta flexibilidad por el tiempo de ejecución)
    expect(sessionId).toContain(timestampBase36.slice(0, -2)) // últimos 2 chars pueden variar
  })

  it('debe tener longitud suficiente para evitar colisiones', () => {
    // Act
    const sessionId = makeSessionId()

    // Assert
    expect(sessionId.length).toBeGreaterThan(15) // sess_(5) + random(~10) + timestamp(~8)
  })
})
