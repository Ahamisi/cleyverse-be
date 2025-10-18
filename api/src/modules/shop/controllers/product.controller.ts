import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto, UpdateProductStatusDto, PublishProductDto } from '../dto/product.dto';
import { SearchProductsDto, BulkUpdateTagsDto, BulkUpdatePriceDto } from '../dto/search.dto';
import { CreateDigitalProductDto, UpdateDigitalProductDto } from '../dto/digital-product.dto';
import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

@Controller('stores/:storeId/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Param('storeId') storeId: string, @Body() createProductDto: CreateProductDto) {
    const product = await this.productService.createProduct(req.user.userId, storeId, createProductDto);
    return { message: 'Product created successfully', product };
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchProducts(@Request() req, @Param('storeId') storeId: string, @Query() searchDto: SearchProductsDto) {
    const result = await this.productService.searchProducts(req.user.userId, storeId, searchDto);
    return { message: 'Products searched successfully', ...result };
  }

  @Get('tags')
  @UseGuards(JwtAuthGuard)
  async getAllTags(@Request() req, @Param('storeId') storeId: string) {
    const tags = await this.productService.getAllTags(req.user.userId, storeId);
    return { message: 'Tags retrieved successfully', tags };
  }

  @Get('tags/:tag')
  @UseGuards(JwtAuthGuard)
  async getProductsByTag(@Request() req, @Param('storeId') storeId: string, @Param('tag') tag: string) {
    const products = await this.productService.getProductsByTag(req.user.userId, storeId, tag);
    return { message: 'Products by tag retrieved successfully', products, total: products.length };
  }

  @Put('bulk/tags')
  @UseGuards(JwtAuthGuard)
  async bulkUpdateTags(@Request() req, @Param('storeId') storeId: string, @Body() bulkUpdateDto: BulkUpdateTagsDto) {
    const result = await this.productService.bulkUpdateTags(req.user.userId, storeId, bulkUpdateDto);
    return { message: 'Products tags updated successfully', ...result };
  }

  @Put('bulk/price')
  @UseGuards(JwtAuthGuard)
  async bulkUpdatePrice(@Request() req, @Param('storeId') storeId: string, @Body() bulkUpdateDto: BulkUpdatePriceDto) {
    const result = await this.productService.bulkUpdatePrice(req.user.userId, storeId, bulkUpdateDto);
    return { message: 'Products price updated successfully', ...result };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Param('storeId') storeId: string, @Query('includeInactive') includeInactive: string = 'false') {
    const products = await this.productService.getStoreProducts(req.user.userId, storeId, includeInactive === 'true');
    return { message: 'Products retrieved successfully', products, total: products.length };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string) {
    const product = await this.productService.getProductById(req.user.userId, storeId, id);
    return { message: 'Product retrieved successfully', product };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productService.updateProduct(req.user.userId, storeId, id, updateProductDto);
    return { message: 'Product updated successfully', product };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string, @Body() updateStatusDto: UpdateProductStatusDto) {
    const product = await this.productService.updateProductStatus(req.user.userId, storeId, id, updateStatusDto);
    return { message: 'Product status updated successfully', product };
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string, @Body() publishDto: PublishProductDto) {
    const product = await this.productService.publishProduct(req.user.userId, storeId, id, publishDto);
    return { message: 'Product publish status updated successfully', product };
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  async duplicate(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string) {
    const product = await this.productService.duplicateProduct(req.user.userId, storeId, id);
    return { message: 'Product duplicated successfully', product };
  }

  @Put(':id/variants/:variantId')
  @UseGuards(JwtAuthGuard)
  async updateVariant(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string, @Param('variantId') variantId: string, @Body() updateVariantDto: any) {
    const variant = await this.productService.updateProductVariant(req.user.userId, storeId, id, variantId, updateVariantDto);
    return { message: 'Product variant updated successfully', variant };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('storeId') storeId: string, @Param('id') id: string) {
    await this.productService.deleteProduct(req.user.userId, storeId, id);
    return { message: 'Product deleted successfully' };
  }

  // Digital Product Endpoints
  @Post(':id/digital/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.env.DIGITAL_FILES_PATH || './uploads/digital');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    }),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/mobi',
        'audio/mpeg',
        'audio/wav',
        'video/mp4',
        'video/avi',
        'application/zip',
        'application/x-zip-compressed'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('File type not allowed'), false);
      }
    }
  }))
  async uploadDigitalFile(
    @Param('storeId') storeId: string,
    @Param('id') productId: string,
    @UploadedFile() file: any,
    @Body() createDto: CreateDigitalProductDto,
    @Request() req
  ) {
    const result = await this.productService.uploadDigitalFile(req.user.userId, storeId, productId, file, createDto);
    return { message: 'Digital file uploaded successfully', ...result };
  }

  @Get(':id/digital')
  @UseGuards(JwtAuthGuard)
  async getDigitalProduct(
    @Param('storeId') storeId: string,
    @Param('id') productId: string,
    @Request() req
  ) {
    const digitalProduct = await this.productService.getDigitalProduct(req.user.userId, storeId, productId);
    return { message: 'Digital product retrieved successfully', digitalProduct };
  }

  @Put(':id/digital')
  @UseGuards(JwtAuthGuard)
  async updateDigitalProduct(
    @Param('storeId') storeId: string,
    @Param('id') productId: string,
    @Body() updateDto: UpdateDigitalProductDto,
    @Request() req
  ) {
    const digitalProduct = await this.productService.updateDigitalProduct(req.user.userId, storeId, productId, updateDto);
    return { message: 'Digital product updated successfully', digitalProduct };
  }

  @Get(':id/digital/analytics')
  @UseGuards(JwtAuthGuard)
  async getDigitalProductAnalytics(
    @Param('storeId') storeId: string,
    @Param('id') productId: string,
    @Request() req
  ) {
    const analytics = await this.productService.getDigitalProductAnalytics(req.user.userId, storeId, productId);
    return { message: 'Digital product analytics retrieved successfully', analytics };
  }

  @Get(':id/digital/access')
  @UseGuards(JwtAuthGuard)
  async getDigitalProductAccess(
    @Param('storeId') storeId: string,
    @Param('id') productId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Request() req
  ) {
    const result = await this.productService.getDigitalProductAccess(req.user.userId, storeId, productId, page, limit);
    return { message: 'Digital product access records retrieved successfully', ...result };
  }
}

// Public product controller for storefront
@Controller('public')
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':storeUrl/products/:productHandle')
  async getPublicProduct(@Param('storeUrl') storeUrl: string, @Param('productHandle') productHandle: string) {
    const product = await this.productService.getPublicProduct(storeUrl, productHandle);
    return { message: 'Product retrieved successfully', product };
  }
}
