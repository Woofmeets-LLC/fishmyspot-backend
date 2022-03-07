import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

const EVERY_THIRTY_MINUTES = '*/1 * * * *';

@Injectable()
export class TaskService {
  @Cron(EVERY_THIRTY_MINUTES, {
    name: 'reminders',
  })
  async eventReminder() {
    console.log('Hello');
    return 'Hello';
  }
}
