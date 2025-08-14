import {
  Entity,
  Property,
  ManyToMany,
  Collection,
  Cascade,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import * as bcrypt from 'bcrypt';

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombreUsuario!: string;

  @Property({ nullable: false })
  contrasenia!: string;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  fechaNacimiento!: Date;

  @Property({ nullable: false })
  fechaCreacion!: Date;

  @Property({ nullable: false, unique: true })
  mail!: string;

  // Hook para hashear contraseña antes de crear
  @BeforeCreate()
  async hashPasswordOnCreate() {
    if (this.contrasenia) {
      const saltRounds = 10;
      this.contrasenia = await bcrypt.hash(this.contrasenia, saltRounds);
    }
  }

  // Hook para hashear contraseña antes de actualizar (solo si cambió)
  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // Solo hashear si la contraseña cambió (no está ya hasheada)
    if (this.contrasenia && !this.contrasenia.startsWith('$2b$')) {
      const saltRounds = 10;
      this.contrasenia = await bcrypt.hash(this.contrasenia, saltRounds);
    }
  }

  // Método para verificar contraseña
  async verificarContrasenia(contraseniaPlana: string): Promise<boolean> {
    return await bcrypt.compare(contraseniaPlana, this.contrasenia);
  }
}