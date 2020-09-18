import { Injectable } from '@nestjs/common';
import puppeteer, { Page, PDFOptions } from 'puppeteer';

@Injectable()
export class AppService {
  async loadTemplate(templateUrl: string, templateData: Object) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    page.on('pageerror', err => console.log('Error: ' + err.toString()));
    page.on('error', err => console.log('Error: ' + err.toString()));

    await page.emulateMediaType('screen');

    await page.exposeFunction('getTemplateData', () => templateData);

    await page.goto(templateUrl);

    await page.waitFor(1000);

    return { browser, page };
  }

  renderTemplateToPdf(page: Page, config: PDFOptions) {
    return page.pdf(config);
  }
}
