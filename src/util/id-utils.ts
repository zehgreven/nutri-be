export type NoId<T> = Omit<T, 'id'>;
export type WithId<T> = T & { id: string };
