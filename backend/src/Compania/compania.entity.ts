import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
//import {Juego} from '../Producto/Juego/juego.entity.js'
//import {Complemento} from '../Producto/Complemento/complemento.entity.js'
//import {Servicio} from '../Producto/Servicio/servicio.entity.js';

@Entity()
export class Compania extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  detalle!: string;

  /*@OneToMany(() => Juego, (juego) => juego.compania, {
    cascade: [Cascade.ALL],
  })
  juegos = new Collection<Juego>(this);
  
  @OneToMany(() => Complemento, (complemento) => complemento.compania, {
    cascade: [Cascade.ALL],
  })
  complementos = new Collection<Complemento>(this);
  
  @OneToMany(() => Servicio, (servicio) => servicio.compania, {
    cascade: [Cascade.ALL],
  })
  servicios = new Collection<Servicio>(this);*/
}
