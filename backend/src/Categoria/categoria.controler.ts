import { Request, Response, NextFunction } from 'express';
import { Categoria } from './categoria.entity.js';
import {orm} from '../shared/orm.js'

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const categorias = await em.find(Categoria, {});
    res
      .status(200)
      .json({ message: 'found all categories', data: categorias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, { id });
    res
      .status(200)
      .json({ message: 'found category', data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

function sanitizeCategoriaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    detalle: req.body.detalle, 
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(Categoria, req.body);
    await em.flush();
    res
      .status(201)
      .json({ message: 'category created', data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoriaToUpdate = await em.findOneOrFail(Categoria, {id});
    em.assign(categoriaToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'category updated',data: categoriaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = em.getReference(Categoria, id);
    await em.removeAndFlush(categoria);
    res.status(200).send({ message: 'category deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//NUEVA FUNCIÓN: Obtener todas las categorías para administradores
async function getAllCategoriesAdmin(req: any, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const userTipo = req.userTipo;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Verificar que el usuario es administrador
    if (userTipo !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
      return;
    }

    const categorias = await em.find(
      Categoria,
      {},
      { orderBy: { nombre: 'ASC' } }
    );

    res.status(200).json({ message: "found all categories for admin", data: categorias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//NUEVA FUNCIÓN: Eliminar cualquier categoría como administrador
async function removeCategoryAsAdmin(req: any, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const userTipo = req.userTipo;
    const categoriaId = Number.parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Verificar que el usuario es administrador
    if (userTipo !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para eliminar categorías' });
      return;
    }

    const categoria = em.getReference(Categoria, categoriaId);
    await em.removeAndFlush(categoria);

    res.status(200).json({ message: "category removed by admin" });
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    
    // Manejar errores de integridad referencial
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      res.status(409).json({ 
        message: 'No se puede eliminar la categoría porque tiene productos asociados' 
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeCategoriaInput, findAll, findOne, add, update, remove, getAllCategoriesAdmin, removeCategoryAsAdmin };