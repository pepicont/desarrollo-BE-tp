import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, ManyToOne, ManyToMany, Rel, Cascade, Collection } from '@mikro-orm/core';
import { Juego } from '../Juego/juego.entity.js';

@Entity()
export class Complemento extends BaseProducto {
  @ManyToOne(() => Juego, { nullable: false })
  juego!: Rel<Juego>;

  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.complementos, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  categorias = new Collection<any>(this);
}
