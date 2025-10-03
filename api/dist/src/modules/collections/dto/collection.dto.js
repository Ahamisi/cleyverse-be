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
exports.CollectionSettingsDto = exports.CollectionStyleDto = exports.CollectionLayoutDto = exports.ArchiveCollectionDto = exports.ReorderLinksInCollectionDto = exports.RemoveLinksFromCollectionDto = exports.AddLinksToCollectionDto = exports.ReorderCollectionsDto = exports.UpdateCollectionDto = exports.CreateCollectionDto = void 0;
const class_validator_1 = require("class-validator");
const collection_entity_1 = require("../entities/collection.entity");
class CreateCollectionDto {
    title;
    description;
    layout;
    isActive;
    displayOrder;
    backgroundColor;
    textColor;
    borderRadius;
    showTitle;
    showCount;
    allowReorder;
}
exports.CreateCollectionDto = CreateCollectionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(collection_entity_1.CollectionLayout),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "backgroundColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "textColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "borderRadius", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionDto.prototype, "showTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionDto.prototype, "showCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCollectionDto.prototype, "allowReorder", void 0);
class UpdateCollectionDto {
    title;
    description;
    layout;
    isActive;
    displayOrder;
    backgroundColor;
    textColor;
    borderRadius;
    showTitle;
    showCount;
    allowReorder;
}
exports.UpdateCollectionDto = UpdateCollectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(collection_entity_1.CollectionLayout),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "layout", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateCollectionDto.prototype, "displayOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "backgroundColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "textColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCollectionDto.prototype, "borderRadius", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionDto.prototype, "showTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionDto.prototype, "showCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCollectionDto.prototype, "allowReorder", void 0);
class ReorderCollectionsDto {
    collectionIds;
}
exports.ReorderCollectionsDto = ReorderCollectionsDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], ReorderCollectionsDto.prototype, "collectionIds", void 0);
class AddLinksToCollectionDto {
    linkIds;
}
exports.AddLinksToCollectionDto = AddLinksToCollectionDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], AddLinksToCollectionDto.prototype, "linkIds", void 0);
class RemoveLinksFromCollectionDto {
    linkIds;
}
exports.RemoveLinksFromCollectionDto = RemoveLinksFromCollectionDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], RemoveLinksFromCollectionDto.prototype, "linkIds", void 0);
class ReorderLinksInCollectionDto {
    linkIds;
}
exports.ReorderLinksInCollectionDto = ReorderLinksInCollectionDto;
__decorate([
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], ReorderLinksInCollectionDto.prototype, "linkIds", void 0);
class ArchiveCollectionDto {
    status;
}
exports.ArchiveCollectionDto = ArchiveCollectionDto;
__decorate([
    (0, class_validator_1.IsEnum)(collection_entity_1.CollectionStatus),
    __metadata("design:type", String)
], ArchiveCollectionDto.prototype, "status", void 0);
class CollectionLayoutDto {
    layout;
}
exports.CollectionLayoutDto = CollectionLayoutDto;
__decorate([
    (0, class_validator_1.IsEnum)(collection_entity_1.CollectionLayout),
    __metadata("design:type", String)
], CollectionLayoutDto.prototype, "layout", void 0);
class CollectionStyleDto {
    backgroundColor;
    textColor;
    borderRadius;
}
exports.CollectionStyleDto = CollectionStyleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CollectionStyleDto.prototype, "backgroundColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CollectionStyleDto.prototype, "textColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionStyleDto.prototype, "borderRadius", void 0);
class CollectionSettingsDto {
    showTitle;
    showCount;
    allowReorder;
}
exports.CollectionSettingsDto = CollectionSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CollectionSettingsDto.prototype, "showTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CollectionSettingsDto.prototype, "showCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CollectionSettingsDto.prototype, "allowReorder", void 0);
//# sourceMappingURL=collection.dto.js.map