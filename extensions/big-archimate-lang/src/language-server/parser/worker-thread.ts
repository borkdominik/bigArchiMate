import { EmptyFileSystem } from 'langium';
import { parentPort } from 'node:worker_threads';
import { createServices } from '../module.js';

const services = createServices(EmptyFileSystem).services;
const parser = services.parser.LangiumParser;
const hydrator = services.serializer.Hydrator;

parentPort?.on('message', text => {
   const result = parser.parse(text);
   const dehydrated = hydrator.dehydrate(result);
   parentPort?.postMessage(dehydrated);
});
