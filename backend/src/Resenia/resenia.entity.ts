import { Entity, Property, ManyToOne, OneToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Usuario } from "../Usuario/usuario.entity.js";
import { Venta } from "../Venta/venta.entity.js";

@Entity()
export class Resenia extends BaseEntity {
  @OneToOne(() => Usuario)
  usuario!: Rel<Usuario>;

  @OneToOne(() => Venta)
  venta!: Rel<Venta>;

  @Property({ nullable: false })
  detalle!: string;

  @Property({ nullable: false })
  puntaje!: number;

  @Property({ nullable: false })
  fecha!: Date;
}