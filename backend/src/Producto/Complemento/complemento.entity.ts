import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, Property, ManyToOne, OneToMany, ManyToMany, Collection } from '@mikro-orm/core';
import { Categoria } from '../../Categoria/categoria.entity.js';

@Entity()
export class Complemento extends BaseProducto {
  @ManyToOne(() => 'Juego', { nullable: false })
  juego!: any;

  @OneToMany(() => 'Venta', (venta: any) => venta.complemento)
  ventas = new Collection<any>(this);

  @ManyToMany(() => Categoria, categoria => categoria.complementos, { owner: true })
  categorias = new Collection<Categoria>(this);
}
