import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateMenuInput {
  @Field()
  @IsNotEmpty()
  label: string;

  @Field()
  @IsNotEmpty()
  url: string;

  @Field({ nullable: true })
  @IsOptional()
  icon?: string;

  @Field({ nullable: true })
  @IsOptional()
  order?: number;

  @Field({ nullable: true })
  @IsOptional()
  visible?: boolean;
}
