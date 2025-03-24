/**
 * Same as Object.entries, but with the correct types.
 * @param obj The object.
 * @returns The entries of the object.
 */
export const getObjectEntries = <T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] =>
   Object.entries(obj) as [keyof T, T[keyof T]][];

/**
 * Same as Object.keys, but with the correct types.
 * @param obj The object.
 * @returns The keys of the object.
 */
export const getObjectKeys = <T extends object>(obj: T): (keyof T)[] => Object.keys(obj) as (keyof T)[];
