import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreatorSettingsService } from '../services/creator-settings.service';
import { 
  CreateCreatorSettingsDto, 
  UpdateCreatorSettingsDto 
} from '../dto/creator-settings.dto';
import { 
  CreatePayoutSettingsDto, 
  UpdatePayoutSettingsDto, 
  PayoutSettingsQueryDto 
} from '../dto/creator-payout-settings.dto';

@Controller('creator-settings')
@UseGuards(JwtAuthGuard)
export class CreatorSettingsController {
  constructor(
    private readonly creatorSettingsService: CreatorSettingsService,
  ) {}

  // General Creator Settings
  @Get()
  async getCreatorSettings(@Request() req) {
    const settings = await this.creatorSettingsService.getCreatorSettings(req.user.userId);
    
    return {
      message: 'Creator settings retrieved successfully',
      settings: {
        id: settings.id,
        theme: settings.theme,
        language: settings.language,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        pushNotifications: settings.pushNotifications,
        marketingEmails: settings.marketingEmails,
        publicProfile: settings.publicProfile,
        showEmail: settings.showEmail,
        showPhone: settings.showPhone,
        allowMessages: settings.allowMessages,
        allowComments: settings.allowComments,
        payoutFrequency: settings.payoutFrequency,
        minimumPayoutThreshold: settings.minimumPayoutThreshold,
        autoPayout: settings.autoPayout,
        preferredCurrency: settings.preferredCurrency,
        taxCountry: settings.taxCountry,
        taxId: settings.taxId,
        businessName: settings.businessName,
        businessAddress: settings.businessAddress,
        businessCity: settings.businessCity,
        businessState: settings.businessState,
        businessZipCode: settings.businessZipCode,
        customSettings: settings.customSettings,
        bio: settings.bio,
        website: settings.website,
        socialLinks: settings.socialLinks ? JSON.parse(settings.socialLinks) : null,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt
      }
    };
  }

  @Put()
  async updateCreatorSettings(
    @Request() req,
    @Body() updateDto: UpdateCreatorSettingsDto
  ) {
    const settings = await this.creatorSettingsService.updateCreatorSettings(
      req.user.userId, 
      updateDto
    );

    return {
      message: 'Creator settings updated successfully',
      settings: {
        id: settings.id,
        theme: settings.theme,
        language: settings.language,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        pushNotifications: settings.pushNotifications,
        marketingEmails: settings.marketingEmails,
        publicProfile: settings.publicProfile,
        showEmail: settings.showEmail,
        showPhone: settings.showPhone,
        allowMessages: settings.allowMessages,
        allowComments: settings.allowComments,
        payoutFrequency: settings.payoutFrequency,
        minimumPayoutThreshold: settings.minimumPayoutThreshold,
        autoPayout: settings.autoPayout,
        preferredCurrency: settings.preferredCurrency,
        taxCountry: settings.taxCountry,
        taxId: settings.taxId,
        businessName: settings.businessName,
        businessAddress: settings.businessAddress,
        businessCity: settings.businessCity,
        businessState: settings.businessState,
        businessZipCode: settings.businessZipCode,
        customSettings: settings.customSettings,
        bio: settings.bio,
        website: settings.website,
        socialLinks: settings.socialLinks ? JSON.parse(settings.socialLinks) : null,
        updatedAt: settings.updatedAt
      }
    };
  }

  // Payout Settings
  @Get('payouts')
  async getPayoutSettings(
    @Request() req,
    @Query() query: PayoutSettingsQueryDto
  ) {
    const result = await this.creatorSettingsService.getPayoutSettings(
      req.user.userId, 
      query
    );

    return {
      message: 'Payout settings retrieved successfully',
      settings: result.settings.map(setting => ({
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        bankName: setting.bankName,
        accountHolderName: setting.accountHolderName,
        paypalEmail: setting.paypalEmail,
        cryptoCurrency: setting.cryptoCurrency,
        country: setting.country,
        verifiedAt: setting.verifiedAt,
        isActive: setting.isActive,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt
      })),
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        total: result.total,
        totalPages: Math.ceil(result.total / (query.limit || 20))
      }
    };
  }

  @Get('payouts/:payoutId')
  async getPayoutSettingById(
    @Request() req,
    @Param('payoutId') payoutId: string
  ) {
    const setting = await this.creatorSettingsService.getPayoutSettingById(
      req.user.userId, 
      payoutId
    );

    return {
      message: 'Payout setting retrieved successfully',
      setting: {
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        bankName: setting.bankName,
        accountNumber: setting.accountNumber,
        routingNumber: setting.routingNumber,
        swiftCode: setting.swiftCode,
        iban: setting.iban,
        accountType: setting.accountType,
        accountHolderName: setting.accountHolderName,
        country: setting.country,
        address: setting.address,
        city: setting.city,
        state: setting.state,
        zipCode: setting.zipCode,
        paypalEmail: setting.paypalEmail,
        paypalMerchantId: setting.paypalMerchantId,
        stripeAccountId: setting.stripeAccountId,
        stripeConnectId: setting.stripeConnectId,
        wiseAccountId: setting.wiseAccountId,
        wiseEmail: setting.wiseEmail,
        cryptoCurrency: setting.cryptoCurrency,
        cryptoAddress: setting.cryptoAddress,
        cryptoNetwork: setting.cryptoNetwork,
        verificationDocument: setting.verificationDocument,
        verifiedAt: setting.verifiedAt,
        verificationNotes: setting.verificationNotes,
        verifiedBy: setting.verifiedBy,
        metadata: setting.metadata,
        externalId: setting.externalId,
        isActive: setting.isActive,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt
      }
    };
  }

  @Post('payouts')
  async createPayoutSetting(
    @Request() req,
    @Body() createDto: CreatePayoutSettingsDto
  ) {
    const setting = await this.creatorSettingsService.createPayoutSetting(
      req.user.userId, 
      createDto
    );

    return {
      message: 'Payout setting created successfully',
      setting: {
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        bankName: setting.bankName,
        accountHolderName: setting.accountHolderName,
        paypalEmail: setting.paypalEmail,
        cryptoCurrency: setting.cryptoCurrency,
        country: setting.country,
        isActive: setting.isActive,
        createdAt: setting.createdAt
      }
    };
  }

  @Put('payouts/:payoutId')
  async updatePayoutSetting(
    @Request() req,
    @Param('payoutId') payoutId: string,
    @Body() updateDto: UpdatePayoutSettingsDto
  ) {
    const setting = await this.creatorSettingsService.updatePayoutSetting(
      req.user.userId, 
      payoutId, 
      updateDto
    );

    return {
      message: 'Payout setting updated successfully',
      setting: {
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        bankName: setting.bankName,
        accountHolderName: setting.accountHolderName,
        paypalEmail: setting.paypalEmail,
        cryptoCurrency: setting.cryptoCurrency,
        country: setting.country,
        isActive: setting.isActive,
        updatedAt: setting.updatedAt
      }
    };
  }

  @Delete('payouts/:payoutId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayoutSetting(
    @Request() req,
    @Param('payoutId') payoutId: string
  ) {
    await this.creatorSettingsService.deletePayoutSetting(
      req.user.userId, 
      payoutId
    );

    return {
      message: 'Payout setting deleted successfully'
    };
  }

  @Put('payouts/:payoutId/default')
  async setDefaultPayoutSetting(
    @Request() req,
    @Param('payoutId') payoutId: string
  ) {
    const setting = await this.creatorSettingsService.setDefaultPayoutSetting(
      req.user.userId, 
      payoutId
    );

    return {
      message: 'Default payout setting updated successfully',
      setting: {
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        updatedAt: setting.updatedAt
      }
    };
  }

  // Utility endpoints
  @Get('payouts/default')
  async getDefaultPayoutSetting(@Request() req) {
    const setting = await this.creatorSettingsService.getDefaultPayoutSetting(
      req.user.userId
    );

    if (!setting) {
      return {
        message: 'No default payout setting found',
        setting: null
      };
    }

    return {
      message: 'Default payout setting retrieved successfully',
      setting: {
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        bankName: setting.bankName,
        accountHolderName: setting.accountHolderName,
        paypalEmail: setting.paypalEmail,
        cryptoCurrency: setting.cryptoCurrency,
        country: setting.country,
        isActive: setting.isActive
      }
    };
  }

  @Get('payouts/verified')
  async getVerifiedPayoutSettings(@Request() req) {
    const settings = await this.creatorSettingsService.getVerifiedPayoutSettings(
      req.user.userId
    );

    return {
      message: 'Verified payout settings retrieved successfully',
      settings: settings.map(setting => ({
        id: setting.id,
        method: setting.method,
        isDefault: setting.isDefault,
        status: setting.status,
        bankName: setting.bankName,
        accountHolderName: setting.accountHolderName,
        paypalEmail: setting.paypalEmail,
        cryptoCurrency: setting.cryptoCurrency,
        country: setting.country,
        verifiedAt: setting.verifiedAt,
        isActive: setting.isActive
      }))
    };
  }
}
