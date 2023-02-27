import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './primsa.service';
import { UserModule } from './user/user.module';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import grpcOption from './grpcOption';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        MYSQL_URL: Joi.string().required(),
        PORT: Joi.number(),
        insecure: Joi.boolean().required(),
        USER_CERT: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
        USER_KEY: Joi.string().when('insecure', {
          is: false,
          then: Joi.required(),
        }),
      }),
    }),
    OpenTelemetryModule.forRoot({
      serviceName: 'user-api',
      spanProcessor: new SimpleSpanProcessor(
        new ZipkinExporter({
          url: 'localhost:9411',
        }),
      ) as any,
    }),
    GrpcReflectionModule.register(grpcOption()),
    UserModule,
    HealthModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}