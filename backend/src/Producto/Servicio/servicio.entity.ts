import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, OneToMany, ManyToMany, Cascade, Collection, ManyToOne } from '@mikro-orm/core';


@Entity()
export class Servicio extends BaseProducto {
//queda vacío por practicidad
}
