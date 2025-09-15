import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany, Rel } from '@mikro-orm/core';
import { Juego } from '../Juego/juego.entity.js';
import { FotoProducto } from '../FotoProducto/fotoProducto.entity.js';
@Entity()
export class Complemento extends BaseProducto {
  @ManyToOne(() => 'Juego')
  juego!: Rel<Juego>;

  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.complementos, {
  cascade: [Cascade.ALL],
  owner: true,
  })
  categorias = new Collection<any>(this);

  @OneToMany(() => 'Venta', (venta: any) => venta.complemento, { cascade: [Cascade.ALL] })
  ventas = new Collection<any>(this);

  @OneToMany(() => FotoProducto, (foto) => foto.complemento, { cascade: [Cascade.ALL] })
  fotos = new Collection<FotoProducto>(this);
}
