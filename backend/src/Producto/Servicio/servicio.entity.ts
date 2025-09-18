import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Cascade, Collection, Entity, ManyToMany, OneToMany} from '@mikro-orm/core';
import { FotoProducto } from '../FotoProducto/fotoProducto.entity.js';


@Entity()
export class Servicio extends BaseProducto {
  @ManyToMany(() => 'Categoria', (categoria: any) => categoria.servicios, {
  owner: true,
  })
  categorias = new Collection<any>(this);

  @OneToMany(() => 'Venta', (venta: any) => venta.servicio, { cascade: [Cascade.ALL] })
  ventas = new Collection<any>(this);

  @OneToMany(() => FotoProducto, (foto) => foto.servicio, { cascade: [Cascade.ALL] })
  fotos = new Collection<FotoProducto>(this);
}
