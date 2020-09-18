import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Header,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthcheck')
  healthcheck(): string {
    return 'OK';
  }

  @Post()
  @Header('Cache-Control', 'none')
  async renderFile(
    @Headers('Template-Url') templateUrl: string,
    @Body() body: Object,
    @Res() response,
  ) {
    if (!templateUrl) {
      throw new BadRequestException('No template url header specified.');
    }

    const { browser, page } = await this.appService.loadTemplate(
      templateUrl,
      body,
    );

    const pdf = await this.appService.renderTemplateToPdf(page, {
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      printBackground: true,
      width: '210mm',
      height: '297mm',
      format: 'A4',
    });

    await browser.close();

    response.set({ 'Content-Type': 'application/pdf' });

    response.send(pdf);
  }
}
