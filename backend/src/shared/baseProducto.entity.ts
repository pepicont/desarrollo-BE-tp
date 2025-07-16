import {
  Entity,
  ManyToOne,
  Property,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core';
import { Compania } from '../Compania/compania.entity.js';
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
}

