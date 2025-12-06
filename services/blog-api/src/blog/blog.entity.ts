import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @Column('text')
  content: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @Field(() => [String])
  @Column('simple-array', { default: '' })
  tags: string[];

  @Field({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  publishedAt?: Date;

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
