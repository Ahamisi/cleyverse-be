import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { UserCategory, UserGoal } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdatePersonalInfoDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsEnum(UserCategory)
  category?: UserCategory;
}

export class UpdateUsernameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;
}

export class UpdateGoalDto {
  @IsEnum(UserGoal)
  goal: UserGoal;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  profileTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class CompleteOnboardingDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  profileTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}

export class CheckUsernameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;
}
