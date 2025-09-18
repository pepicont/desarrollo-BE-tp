var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, OneToMany, Collection, BeforeCreate, BeforeUpdate, Cascade, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import * as bcrypt from 'bcrypt';
let Usuario = class Usuario extends BaseEntity {
    constructor() {
        super(...arguments);
        this.ventas = new Collection(this);
        this.resenias = new Collection(this);
    }
    // Hook para hashear contraseña antes de crear
    async hashPasswordOnCreate() {
        if (this.contrasenia) {
            const saltRounds = 10;
            this.contrasenia = await bcrypt.hash(this.contrasenia, saltRounds);
        }
    }
    // Hook para hashear contraseña antes de actualizar (solo si cambió)
    async hashPasswordOnUpdate() {
        // Solo hashear si la contraseña cambió (no está ya hasheada)
        if (this.contrasenia && !this.contrasenia.startsWith('$2b$')) {
            const saltRounds = 10;
            this.contrasenia = await bcrypt.hash(this.contrasenia, saltRounds);
        }
    }
    // Método para verificar contraseña
    async verificarContrasenia(contraseniaPlana) {
        return await bcrypt.compare(contraseniaPlana, this.contrasenia);
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombreUsuario", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "contrasenia", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "tipoUsuario", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaNacimiento", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaCreacion", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "mail", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "urlFoto", void 0);
__decorate([
    OneToMany(() => 'Venta', (venta) => venta.usuario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Usuario.prototype, "ventas", void 0);
__decorate([
    OneToMany(() => 'Resenia', (resenia) => resenia.usuario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Usuario.prototype, "resenias", void 0);
__decorate([
    BeforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Usuario.prototype, "hashPasswordOnCreate", null);
__decorate([
    BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Usuario.prototype, "hashPasswordOnUpdate", null);
Usuario = __decorate([
    Entity()
], Usuario);
export { Usuario };
//# sourceMappingURL=usuario.entity.js.map