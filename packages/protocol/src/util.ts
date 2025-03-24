import { ArchiMateLanguageRegex } from './model-service/protocol';

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
   if (ArchiMateLanguageRegex.ID.test(text)) {
      return text;
   }
   let id = text;
   // remove diacritics for nicer conversion (e.g., ä to a) and then replace all non-matching characters with '_'
   id = id
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w_\-~$#@/\d]/g, '_');
   if (ArchiMateLanguageRegex.ID.test(id)) {
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

/**
 * A reversible map that maps keys to values and values to keys.
 * This map can be used to map between two sets of strings and get the value for a key and the key for a value.
 */
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

   /**
    * Returns the value associated with the key.
    * @param key the key
    * @returns the value associated with the key
    */
   get(key: K): V {
      return this.forwardMap[key];
   }

   /**
    * Returns the key associated with the value.
    * @param value the value
    * @returns the key associated with the value
    */
   getReverse(value: V): K {
      return this.reverseMap[value];
   }

   /**
    * Returns all keys of the map.
    * @returns all keys of the map
    */
   keys(): K[] {
      return Object.keys(this.forwardMap) as K[];
   }

   /**
    * Returns all values of the map.
    * @returns all values of the map
    */
   values(): V[] {
      return Object.values(this.forwardMap) as V[];
   }
}

/**
 * Converts a string to kebab case.
 * @param input the input string
 * @returns the kebab case string
 */
export function toKebabCase(input: string): string {
   return input.replace(/([A-Z])/g, (match, offset) => (offset === 0 ? match.toLowerCase() : '-' + match.toLowerCase())).replace(/^-/, '');
}

/** The name of the output channel that the VS Code language extension will write its logs to. */
export const LanguageExtensionChannelName = 'bigArchiMate';
