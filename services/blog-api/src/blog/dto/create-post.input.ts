import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  slug: string;

  @Field()
  @IsNotEmpty()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  excerpt?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  publishedAt?: Date;

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
