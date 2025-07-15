/*import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, Property, OneToMany, Cascade, Collection } from '@mikro-orm/core';
import { Complemento } from '../Complemento/complemento.entity.js';

@Entity()
export class Juego extends BaseProducto {
  @Property({ nullable: false })
  fechaLanzamiento!: Date;

  @Property({ nullable: false })
  edadPermitida!: number;

  @OneToMany(() => Complemento, (complemento) => complemento.juego, {
    cascade: [Cascade.ALL],
  })
  complementos = new Collection<Complemento>(this);
}
*/