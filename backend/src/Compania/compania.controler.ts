import { Request, Response, NextFunction } from 'express';
import { Compania } from './compania.entity.js';
import {orm} from '../shared/orm.js'

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const companias = await em.find(Compania, {});
    res
      .status(200)
      .json({ message: 'found all companies', data: companias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const compania = await em.findOneOrFail(Compania, { id });
    res
      .status(200)
      .json({ message: 'found company', data: compania });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

function sanitizeCompaniaInput(
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
    const compania = em.create(Compania, req.body);
    await em.flush();
    res
      .status(201)
      .json({ message: 'company created', data: compania });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const companiaToUpdate = await em.findOneOrFail(Compania, {id});
    em.assign(companiaToUpdate, req.body);
    await em.flush();
    res.status(200).json({ message: 'company updated',data: companiaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const compania = em.getReference(Compania, id);
    await em.removeAndFlush(compania);
    res.status(200).send({ message: 'company class deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
//NUEVA FUNCIÓN: Obtener todas las compañías para administradores
async function getAllCompaniesAdmin(req: any, res: Response): Promise<void> {
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

    const companias = await em.find(
      Compania,
      {},
      { orderBy: { nombre: 'ASC' } }
    );

    res.status(200).json({ message: "found all companies for admin", data: companias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//NUEVA FUNCIÓN: Eliminar cualquier compañía como administrador
async function removeCompanyAsAdmin(req: any, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const userTipo = req.userTipo;
    const companiaId = Number.parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Verificar que el usuario es administrador
    if (userTipo !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para eliminar compañías' });
      return;
    }

    const compania = em.getReference(Compania, companiaId);
    await em.removeAndFlush(compania);

    res.status(200).json({ message: "company removed by admin" });
  } catch (error: any) {
    console.error('Error al eliminar compañía:', error);
    
    // Manejar errores de integridad referencial
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
      res.status(409).json({ 
        message: 'No se puede eliminar la compañía porque tiene productos asociados' 
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export { sanitizeCompaniaInput, findAll, findOne, add, update, remove, getAllCompaniesAdmin, removeCompanyAsAdmin };
