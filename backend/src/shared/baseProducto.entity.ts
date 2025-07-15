import {
  Entity,
  ManyToOne,
  Property,
  ManyToMany,
  Rel,
  Cascade,
  Collection,
  PrimaryKey,
} from '@mikro-orm/core';
import { Compania } from '../Compania/compania.entity.js';
import { Categoria } from '../Categoria/categoria.entity.js';
export abstract class BaseProducto {
  @PrimaryKey()
  id?: number;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  detalle!: string;

  @Property({ nullable: false })
  monto!: number;

  @ManyToOne(() => Compania, { nullable: false })
  compania!: Rel<Compania>;

  /*@ManyToMany(() => Categoria, (categoria) => categoria.productos, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  categoria!: Categoria[];*/
}

