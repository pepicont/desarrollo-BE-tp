import { orm } from '../../shared/orm.js';
import { FotoProducto } from './fotoProducto.entity.js';
const em = orm.em;
async function list(req, res) {
    try {
        const tipo = req.params.tipo;
        const id = Number(req.params.id);
        if (!['juego', 'complemento', 'servicio'].includes(tipo) || Number.isNaN(id)) {
            res.status(400).json({ message: 'Parámetros inválidos' });
            return;
        }
        const where = {};
        where[`${tipo}`] = id;
        const fotos = await em.find(FotoProducto, where);
        res.status(200).json({ message: 'ok', data: fotos });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { list };
//# sourceMappingURL=fotoProducto.controller.js.map