import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreatePortfolioInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  slug: string;

  @Field({ nullable: true })
  @IsOptional()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  shortDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  content?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  images?: string[];

  @Field({ nullable: true })
  @IsOptional()
  featured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  externalUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  metaTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  metaDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  ogImage?: string;
}
