import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, Property, OneToMany, ManyToMany, Cascade, Collection, ManyToOne } from '@mikro-orm/core';
import { Complemento } from '../Complemento/complemento.entity.js';

@Entity()
export class Servicio extends BaseProducto {
  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.servicios, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  categorias = new Collection<any>(this);

  @OneToMany(() => 'Venta', (venta: any) => venta.servicio, { cascade: [Cascade.ALL] })
  ventas = new Collection<any>(this);
}
