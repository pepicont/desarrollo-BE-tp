import { Compania } from './compania.entity.js';
const companias = [
    new Compania('Steam', 'La mejor de todas', 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
    new Compania('Origin', 'La peor de todas', 'a02b91bc-3769-4221-beb1-d7a3aeba7das'),
];
export class companiaRepository {
    findAll() {
        return companias;
    }
    findOne(item) {
        return companias.find((compania) => compania.id === item.id);
    }
    add(item) {
        companias.push(item);
        return item;
    }
    update(item) {
        const companiaIdx = companias.findIndex((compania) => compania.id === item.id);
        if (companiaIdx !== -1) {
            companias[companiaIdx] = { ...companias[companiaIdx], ...item };
        }
        return companias[companiaIdx];
    }
    delete(item) {
        const companiaIdx = companias.findIndex((compania) => compania.id === item.id);
        if (companiaIdx !== -1) {
            const deletedCompania = companias[companiaIdx];
            companias.splice(companiaIdx, 1);
            return deletedCompania;
        }
    }
}
//# sourceMappingURL=compania.repository.js.map