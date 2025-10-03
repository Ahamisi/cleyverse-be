"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = exports.CollectionStatus = exports.CollectionLayout = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/base/base.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var CollectionLayout;
(function (CollectionLayout) {
    CollectionLayout["STACK"] = "stack";
    CollectionLayout["GRID"] = "grid";
    CollectionLayout["CAROUSEL"] = "carousel";
})(CollectionLayout || (exports.CollectionLayout = CollectionLayout = {}));
var CollectionStatus;
(function (CollectionStatus) {
    CollectionStatus["ACTIVE"] = "active";
    CollectionStatus["ARCHIVED"] = "archived";
})(CollectionStatus || (exports.CollectionStatus = CollectionStatus = {}));
let Collection = class Collection extends base_entity_1.BaseEntity {
    userId;
    user;
    title;
    description;
    layout;
    isActive;
    displayOrder;
    status;
    linkCount;
    backgroundColor;
    textColor;
    borderRadius;
    showTitle;
    showCount;
    allowReorder;
    links;
    archivedAt;
};
exports.Collection = Collection;
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Collection.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.collections, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Collection.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Collection.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Collection.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CollectionLayout,
        default: CollectionLayout.STACK
    }),
    __metadata("design:type", String)
], Collection.prototype, "layout", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Collection.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_order', default: 0 }),
    __metadata("design:type", Number)
], Collection.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CollectionStatus,
        default: CollectionStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Collection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'link_count', default: 0 }),
    __metadata("design:type", Number)
], Collection.prototype, "linkCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'background_color', nullable: true }),
    __metadata("design:type", String)
], Collection.prototype, "backgroundColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'text_color', nullable: true }),
    __metadata("design:type", String)
], Collection.prototype, "textColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'border_radius', nullable: true }),
    __metadata("design:type", String)
], Collection.prototype, "borderRadius", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_title', default: true }),
    __metadata("design:type", Boolean)
], Collection.prototype, "showTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'show_count', default: true }),
    __metadata("design:type", Boolean)
], Collection.prototype, "showCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allow_reorder', default: true }),
    __metadata("design:type", Boolean)
], Collection.prototype, "allowReorder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Collection.prototype, "archivedAt", void 0);
exports.Collection = Collection = __decorate([
    (0, typeorm_1.Entity)('collections'),
    (0, typeorm_1.Index)(['userId', 'displayOrder'])
], Collection);
//# sourceMappingURL=collection.entity.js.map