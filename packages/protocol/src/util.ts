/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { CrossModelRegex } from './model-service/protocol';

export function quote(text: string, quoteChar = '"', replaceChar = "'"): string {
   if (text.length === 0) {
      return quoteChar + quoteChar;
   }
   let quoted = text;
   if (!quoted.startsWith(quoteChar)) {
      quoted = quoteChar + quoted;
   }
   if (!quoted.endsWith(quoteChar)) {
      quoted += quoteChar;
   }
   // escape any occurrence of quote char within the quoted text
   return (
      quoteChar +
      quoted
         .substring(1, quoted.length - 1)
         .split(quoteChar)
         .join(replaceChar) +
      quoteChar
   );
}

export function unquote(text: string, quoteChar = '"'): string {
   const start = text.startsWith(quoteChar) ? 1 : undefined;
   const end = text.endsWith(quoteChar) ? -1 : undefined;
   return text.slice(start, end);
}

export function toId(text: string): string {
   if (CrossModelRegex.ID.test(text)) {
      return text;
   }
   let id = text;
   // remove diacritics for nicer conversion (e.g., ä to a) and then replace all non-matching characters with '_'
   id = id
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w_\-~$#@/\d]/g, '_');
   if (CrossModelRegex.ID.test(id)) {
      return id;
   }
   // prefix with '_' if necessary
   return '_' + id;
}

export function codiconCSSString(icon: string): string {
   return `codicon codicon-${icon}`;
}

export function identity<T>(value: T): T {
   return value;
}

export function findNextUnique<T>(suggestion: string, existing: T[], nameGetter: (element: T) => string): string {
   const names = existing.map(nameGetter);
   let name = suggestion;
   let index = 1;
   while (names.includes(name)) {
      name = suggestion + index++;
   }
   return name;
}

export class ReversibleMap<K extends string, V extends string> {
   private forwardMap: Record<K, V>;
   private reverseMap: Record<V, K>;

   constructor(map: Record<K, V>) {
      this.forwardMap = map;
      this.reverseMap = Object.keys(map).reduce(
         (acc, key) => {
            const value = map[key as K];
            acc[value] = key as K;
            return acc;
         },
         {} as Record<V, K>
      );
   }

   get(key: K): V {
      return this.forwardMap[key];
   }

   getReverse(value: V): K {
      return this.reverseMap[value];
   }

   keys(): K[] {
      return Object.keys(this.forwardMap) as K[];
   }

   values(): V[] {
      return Object.values(this.forwardMap) as V[];
   }
}
