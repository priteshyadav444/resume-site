import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class MenuItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  label: string;

  @Field()
  @Column()
  url: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  icon?: string;

  @Field()
  @Column({ default: 0 })
  order: number;

  @Field()
  @Column({ default: true })
  visible: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
