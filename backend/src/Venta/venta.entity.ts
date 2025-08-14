import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';

@Entity()
export class Venta extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => 'Usuario')
  usuario!: any;

  @ManyToOne(() => 'Juego', { nullable: true })
  juego!: any;

  @ManyToOne(() => 'Complemento', { nullable: true })
  complemento?: any;

  @ManyToOne(() => 'Servicio', { nullable: true })
  servicio?: any;

  @Property({ nullable: false })
  fecha!: Date;

  @Property({ nullable: false, unique: true })
  idVenta!: number;

  @Property({ nullable: false, unique: true })
  codActivacion!: string;
}
