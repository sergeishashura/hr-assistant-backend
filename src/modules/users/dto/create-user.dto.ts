import { IsString, IsArray, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  position: number;

  @IsArray()
  @IsNumber({}, { each: true })
  techStack: number[];

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
