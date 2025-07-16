import {
  Entity,
  ManyToOne,
  Property,
  ManyToMany,
  Rel,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';

@Entity()
export class Categoria extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  detalle!: string;

  @ManyToMany(() => 'Juego', 'categorias') 
  juegos = new Collection<any>(this);

  @ManyToMany(() => 'Complemento', 'categorias')
  complementos = new Collection<any>(this);
  
  @ManyToMany(() => 'Servicio', 'categorias')
  servicios = new Collection<any>(this);
}
