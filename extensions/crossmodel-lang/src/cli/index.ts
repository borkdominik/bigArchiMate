import chalk from 'chalk';
import { Command } from 'commander';
import { NodeFileSystem } from 'langium/node';
import { ArchiMateRoot } from '../language-server/generated/ast.js';
import { ArchiMateLanguageMetaData } from '../language-server/generated/module.js';
import { createServices } from '../language-server/module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript } from './generator.js';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
   const services = createServices(NodeFileSystem).services;
   const root = await extractAstNode<ArchiMateRoot>(fileName, services);
   const generatedFilePath = generateJavaScript(root, fileName, opts.destination);
   console.log(chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`));
};

export interface GenerateOptions {
   destination?: string;
}

export default function (): void {
   const program = new Command();

   program
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .version(require('../../package.json').version);

   const fileExtensions = ArchiMateLanguageMetaData.fileExtensions.join(', ');
   program
      .command('generate')
      .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
      .option('-d, --destination <dir>', 'destination directory of generating')
      .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
      .action(generateAction);

   program.parse(process.argv);
}
