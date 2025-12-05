import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'blog.sqlite',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    BlogModule,
    AuthModule,
    PortfolioModule,
    MenuModule,
  ],
})
export class AppModule {}
