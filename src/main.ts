import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import * as packageJson from './../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('EasyContacts API')
    .setDescription('EasyContacts API description')
    .setVersion(packageJson.version)
    // .addTag('easycontacts')
    .build();
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  app.enableCors({
    origin: process.env.APP_URL,
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
