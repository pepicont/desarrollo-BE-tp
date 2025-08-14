var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
export let Venta = class Venta extends BaseEntity {
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Venta.prototype, "id", void 0);
__decorate([
    ManyToOne(() => 'Usuario'),
    __metadata("design:type", Object)
], Venta.prototype, "usuario", void 0);
__decorate([
    ManyToOne(() => 'Juego', { nullable: true }),
    __metadata("design:type", Object)
], Venta.prototype, "juego", void 0);
__decorate([
    ManyToOne(() => 'Complemento', { nullable: true }),
    __metadata("design:type", Object)
], Venta.prototype, "complemento", void 0);
__decorate([
    ManyToOne(() => 'Servicio', { nullable: true }),
    __metadata("design:type", Object)
], Venta.prototype, "servicio", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Venta.prototype, "fecha", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", Number)
], Venta.prototype, "idVenta", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Venta.prototype, "codActivacion", void 0);
Venta = __decorate([
    Entity()
], Venta);
//# sourceMappingURL=venta.entity.js.map