import { Compania } from './compania.entity.js';

const companias = [
  new Compania(
    'Steam',
    'La mejor de todas',
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
  new Compania(
    'Origin',
    'La peor de todas',
    'a02b91bc-3769-4221-beb1-d7a3aeba7das'
  ),
];

export class companiaRepository {
  
  public findAll(): Compania[] | undefined {
    return companias;
  }
  
  public findOne(item: { id: string }): Compania | undefined {
    return companias.find((compania) => compania.id === item.id);
  }
  
  public add(item: Compania): Compania | undefined {
    companias.push(item);
    return item;
  }

  public update(item: Compania): Compania | undefined {
    const companiaIdx = companias.findIndex(
      (compania) => compania.id === item.id
    );

    if (companiaIdx !== -1) {
      companias[companiaIdx] = { ...companias[companiaIdx], ...item };
    }
    return companias[companiaIdx];
  }
  public delete(item: { id: string }): Compania | undefined {
    const companiaIdx = companias.findIndex(
      (compania) => compania.id === item.id
    );

    if (companiaIdx !== -1) {
      const deletedCompania = companias[companiaIdx];
      companias.splice(companiaIdx, 1);
      return deletedCompania;
    }
  }
}
  
  

 



 
