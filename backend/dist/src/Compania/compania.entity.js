var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Juego } from '../Producto/Juego/juego.entity.js';
import { Complemento } from '../Producto/Complemento/complemento.entity.js';
import { Servicio } from '../Producto/Servicio/servicio.entity.js';
let Compania = class Compania extends BaseEntity {
    constructor() {
        super(...arguments);
        this.juegos = new Collection(this);
        this.complementos = new Collection(this);
        this.servicios = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Compania.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Compania.prototype, "detalle", void 0);
__decorate([
    OneToMany(() => Juego, (juego) => juego.compania, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Compania.prototype, "juegos", void 0);
__decorate([
    OneToMany(() => Complemento, (complemento) => complemento.compania, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Compania.prototype, "complementos", void 0);
__decorate([
    OneToMany(() => Servicio, (servicio) => servicio.compania, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Compania.prototype, "servicios", void 0);
Compania = __decorate([
    Entity()
], Compania);
export { Compania };
//# sourceMappingURL=compania.entity.js.map