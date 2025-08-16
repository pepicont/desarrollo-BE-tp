import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Cascade, Collection, Entity, ManyToMany, OneToMany} from '@mikro-orm/core';


@Entity()
export class Servicio extends BaseProducto {
  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.servicios, {
  cascade: [Cascade.ALL],
  owner: true,
  })
  categorias = new Collection<any>(this);

  @OneToMany(() => 'Venta', (venta: any) => venta.servicio, { cascade: [Cascade.ALL] })
  ventas = new Collection<any>(this);
}
