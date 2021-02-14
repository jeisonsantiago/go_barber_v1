import handlebars from 'handlebars';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO'
import IMailTemplateProvider from '../models/IMailTemplateProvider';

import fs from 'fs';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider{
  public async parse({file, variables}:IParseMailTemplateDTO):Promise<string>{

    const templateFileConten = await fs.promises.readFile(file,
      {
        encoding:'utf-8',
      });

    const parseTemplate = handlebars.compile(templateFileConten);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
