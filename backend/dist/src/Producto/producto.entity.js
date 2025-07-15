var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, Property, ManyToMany, Cascade, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Compania } from '../Compania/compania.entity.js';
import { Categoria } from '../Categoria/categoria.entity.js';
export let Producto = class Producto extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Producto.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Producto.prototype, "detalle", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Producto.prototype, "monto", void 0);
__decorate([
    ManyToOne(() => Compania, { nullable: false }),
    __metadata("design:type", Object)
], Producto.prototype, "compania", void 0);
__decorate([
    ManyToMany(() => Categoria, (categoria) => categoria.productos, {
        cascade: [Cascade.ALL],
        owner: true,
    }),
    __metadata("design:type", Array)
], Producto.prototype, "categoria", void 0);
Producto = __decorate([
    Entity()
], Producto);
//# sourceMappingURL=producto.entity.js.map