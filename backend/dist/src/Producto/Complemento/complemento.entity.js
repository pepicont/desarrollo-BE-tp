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
import { Entity, ManyToOne, ManyToMany, Cascade, Collection } from '@mikro-orm/core';
import { Juego } from '../Juego/juego.entity.js';
let Complemento = class Complemento extends BaseProducto {
    constructor() {
        super(...arguments);
        this.categoria = new Collection(this);
    }
};
__decorate([
    ManyToOne(() => Juego, { nullable: false }),
    __metadata("design:type", Object)
], Complemento.prototype, "juego", void 0);
__decorate([
    ManyToMany(() => 'Categoria', (categoria) => categoria.complementos, {
        cascade: [Cascade.ALL],
        owner: true,
    }),
    __metadata("design:type", Object)
], Complemento.prototype, "categoria", void 0);
Complemento = __decorate([
    Entity()
], Complemento);
export { Complemento };
//# sourceMappingURL=complemento.entity.js.map