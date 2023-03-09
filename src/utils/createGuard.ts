import * as z from 'zod';

export const createGuard = <T>(decoder: z.ZodType<T>) => {
  return (data: unknown): data is T => {
    const decodedResult = decoder.safeParse(data);
    return decodedResult.success;
  };
};

export const errorGuard = createGuard(z.object({ code: z.string() }));

export const errorTokenGuard = createGuard(z.object({ name: z.string() }));
