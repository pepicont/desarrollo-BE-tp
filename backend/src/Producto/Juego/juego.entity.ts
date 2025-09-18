import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, Property, OneToMany, Cascade, Collection, ManyToMany } from '@mikro-orm/core';
import { Complemento } from '../Complemento/complemento.entity.js';
import { FotoProducto } from '../FotoProducto/fotoProducto.entity.js';

@Entity()
export class Juego extends BaseProducto {
  @Property({ nullable: false })
  fechaLanzamiento!: Date;

  @Property({ nullable: false })
  edadPermitida!: number;

  @OneToMany(() => Complemento, (complemento) => complemento.juego, {
    cascade: [Cascade.ALL],
  })
  complementos = new Collection<any>(this);

  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.juegos, {
    owner: true,
  })
  categorias = new Collection<any>(this);

  @OneToMany(() => 'Venta', (venta: any) => venta.juego, { cascade: [Cascade.ALL] })
  ventas = new Collection<any>(this);

  @OneToMany(() => FotoProducto, (foto) => foto.juego, { cascade: [Cascade.ALL] })
  fotos = new Collection<FotoProducto>(this);
 
  
}
