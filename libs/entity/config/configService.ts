import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

class SwaggerAdminConfig {
  readonly ADMIN_USER: string;
  readonly ADMIN_PASSWORD: string;
}

@Injectable()
export class ConfigService {
  static appPort(): number {
    const { PORT } = process.env;
    return PORT ? Number(PORT) : 3000;
  }

  static swaggerAdminAuth(): SwaggerAdminConfig {
    const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
    return { ADMIN_USER, ADMIN_PASSWORD };
  }
}
