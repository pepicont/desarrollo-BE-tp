import {
  Entity,
  ManyToOne,
  Property,
  Rel,
  PrimaryKey,
  ManyToMany,
  Cascade,
  Collection,
  OneToMany,
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
  
  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.servicios, {
  cascade: [Cascade.ALL],
  owner: true,
  })
  categorias = new Collection<any>(this);

  @OneToMany(() => 'Venta', (venta: any) => venta.servicio, { cascade: [Cascade.ALL] })
  ventas = new Collection<any>(this);
}

