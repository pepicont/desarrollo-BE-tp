import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';
import { Juego } from '../Juego/juego.entity.js';
import { Complemento } from '../Complemento/complemento.entity.js';
import { Servicio } from '../Servicio/servicio.entity.js';

@Entity()
export class FotoProducto extends BaseEntity {
  @Property({ nullable: false, length: 2048 })
  url!: string;

  @Property({ nullable: false, default: false })
  esPrincipal: boolean = false;

  @ManyToOne(() => 'Juego', { nullable: true })
  juego?: Rel<Juego>;

  @ManyToOne(() => 'Complemento', { nullable: true })
  complemento?: Rel<Complemento>;

  @ManyToOne(() => 'Servicio', { nullable: true })
  servicio?: Rel<Servicio>;
}
