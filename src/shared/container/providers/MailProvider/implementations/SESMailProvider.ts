import { injectable, inject } from 'tsyringe';
import IMailProvider from "../models/IMailProvider";
import nodemailer, { Transporter } from 'nodemailer';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from "../../MailTemplateProvider/models/IMailTemplateProvider";
import aws from 'aws-sdk';
import mailConfig from '@config/mail';

@injectable()
class SESMailProvider implements IMailProvider {

  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
      }),
    });
  }
  public async sendMail({
    to,
    subject,
    from,
    templateData }: ISendMailDTO): Promise<void> {

    try {
      const { name, email } = mailConfig.defauts.from;
      await this.client.sendMail({
        from: {
          name: name,
          address: email,
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject: subject,
        text: 'Hello to myself!',
        html: await this.mailTemplateProvider.parse(templateData),
      });
    } catch (error) {
      console.log(error);
    }



  }
}

export default SESMailProvider;
