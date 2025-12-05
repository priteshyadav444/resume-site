import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class PortfolioItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  content?: string;

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  images: string[];

  @Field()
  @Column({ default: false })
  featured: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  externalUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  metaDescription?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ogImage?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
