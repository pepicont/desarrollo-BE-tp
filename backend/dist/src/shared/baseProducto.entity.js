var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ManyToOne, Property, PrimaryKey, } from '@mikro-orm/core';
import { Compania } from '../Compania/compania.entity.js';
export class BaseProducto {
}
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], BaseProducto.prototype, "id", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], BaseProducto.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], BaseProducto.prototype, "detalle", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], BaseProducto.prototype, "monto", void 0);
__decorate([
    ManyToOne(() => Compania, { nullable: false }),
    __metadata("design:type", Object)
], BaseProducto.prototype, "compania", void 0);
//# sourceMappingURL=baseProducto.entity.js.map