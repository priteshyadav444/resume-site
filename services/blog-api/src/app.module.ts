import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('ADMIN_DB_HOST', 'localhost'),
        port: configService.get<number>('ADMIN_DB_PORT', 5432),
        username: configService.get<string>('ADMIN_DB_USERNAME', 'pritesh'),
        password: configService.get<string>('ADMIN_DB_PASSWORD', 'pritesh'),
        database: configService.get<string>('ADMIN_DB_DATABASE', 'blogs'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
        synchronize: configService.get<string>('NODE_ENV') === 'development' && configService.get<string>('USE_SYNC') === 'true', // Only sync if explicitly enabled
        migrationsRun: configService.get<string>('RUN_MIGRATIONS') === 'true', // Run migrations on startup if enabled
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    BlogModule,
    AuthModule,
    PortfolioModule,
    MenuModule,
  ],
})
export class AppModule { }
