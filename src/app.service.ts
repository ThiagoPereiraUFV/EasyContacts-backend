import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRunningMessage(): string {
    return `App is running on port ${process.env.PORT || 4000}`;
  }
}
