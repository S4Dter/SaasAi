declare module 'react-hook-form' {
  export * from 'react-hook-form/dist/types';
  export * from 'react-hook-form/dist/useForm';
  export * from 'react-hook-form/dist/useController';
  export * from 'react-hook-form/dist/useFieldArray';
  export * from 'react-hook-form/dist/useFormState';
  export * from 'react-hook-form/dist/useWatch';
}

declare module '@hookform/resolvers/zod' {
  import type { Resolver } from 'react-hook-form';
  import type { z, ZodSchema } from 'zod';

  export interface ResolverOptions {
    mode?: 'async' | 'sync';
    raw?: boolean;
    context?: any;
  }
  
  export function zodResolver<T extends ZodSchema<any, any>>(
    schema: T,
    options?: ResolverOptions
  ): Resolver<z.infer<T>>;
}
