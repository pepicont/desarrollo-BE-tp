var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseProducto } from '../../shared/baseProducto.entity.js';
import { Entity, ManyToMany, Cascade, Collection } from '@mikro-orm/core';
export let Servicio = class Servicio extends BaseProducto {
    constructor() {
        super(...arguments);
        this.categorias = new Collection(this);
    }
};
__decorate([
    ManyToMany(() => 'Categoria', (categoria) => categoria.servicios, {
        cascade: [Cascade.ALL],
        owner: true,
    }),
    __metadata("design:type", Object)
], Servicio.prototype, "categorias", void 0);
Servicio = __decorate([
    Entity()
], Servicio);
//# sourceMappingURL=servicio.entity.js.map