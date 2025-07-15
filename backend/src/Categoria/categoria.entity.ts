import {
  Entity,
  ManyToOne,
  Property,
  ManyToMany,
  Rel,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
/*import { Juego } from '../Producto/Juego/juego.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';*/
@Entity()
export class Categoria extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  detalle!: string;

  /*@ManyToMany(() => Juego, (juego) => juego.categoria, {})
  juegos = new Collection<Juego>(this);

  @ManyToMany(() => Complemento, (complemento) => complemento.categoria, {})
  productos = new Collection<Complemento>(this);
  
  @ManyToMany(() => Servicio, (servicio) => servicio.categoria, {})
  servicios = new Collection<Servicio>(this);*/
}
