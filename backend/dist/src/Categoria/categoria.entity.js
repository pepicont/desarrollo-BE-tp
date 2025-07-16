var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToMany, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
let Categoria = class Categoria extends BaseEntity {
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
], Categoria.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Categoria.prototype, "detalle", void 0);
__decorate([
    ManyToMany(() => 'Juego', 'categoria'),
    __metadata("design:type", Object)
], Categoria.prototype, "juegos", void 0);
__decorate([
    ManyToMany(() => 'Complemento', 'categoria'),
    __metadata("design:type", Object)
], Categoria.prototype, "complementos", void 0);
__decorate([
    ManyToMany(() => 'Servicio', 'categoria'),
    __metadata("design:type", Object)
], Categoria.prototype, "servicios", void 0);
Categoria = __decorate([
    Entity()
], Categoria);
export { Categoria };
//# sourceMappingURL=categoria.entity.js.map