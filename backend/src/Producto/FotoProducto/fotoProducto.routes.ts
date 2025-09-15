import { Router } from 'express'
import { sanitizeFotoInput, list, create, setPrincipal, remove } from './fotoProducto.controller.js'

export const fotoProductoRouter = Router()

fotoProductoRouter.get('/:tipo/:id', list)

fotoProductoRouter.post('/:tipo/:id', sanitizeFotoInput, create)

fotoProductoRouter.put('/:tipo/:id/:fotoId/principal', setPrincipal)

fotoProductoRouter.delete('/:tipo/:id/:fotoId', remove)
