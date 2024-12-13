/********************************************************************************
 * Copyright (c) 2024 CrossBreeze.
 ********************************************************************************/
export function toKebabCase(input: string): string {
   return input.replace(/([A-Z])/g, (match, offset) => (offset === 0 ? match.toLowerCase() : '-' + match.toLowerCase())).replace(/^-/, '');
}
