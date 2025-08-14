import { Entity, PrimaryKey, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Usuario } from '../Usuario/usuario.entity.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';

@Entity()
export class Venta extends BaseEntity {

  @ManyToOne(() => 'Usuario')
  usuario!: Rel<Usuario>;

  @ManyToOne(() => 'Juego', { nullable: true })
  juego!: Rel<Juego>;

  @ManyToOne(() => 'Complemento', { nullable: true })
  complemento?: Rel<Complemento>;

  @ManyToOne(() => 'Servicio', { nullable: true })
  servicio?: Rel<Servicio>;

  @Property({ nullable: false })
  fecha!: Date;


  @Property({ nullable: false, unique: true })
  codActivacion!: string;
}
