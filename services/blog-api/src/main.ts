import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(4000);
  console.log('Blog API running on http://localhost:4000');
  console.log('REST API: http://localhost:4000/api');
  console.log('GraphQL: http://localhost:4000/graphql');
}
bootstrap();
