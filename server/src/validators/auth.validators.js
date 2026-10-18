import { z } from 'zod';

const universityEmail = z.string().trim().toLowerCase().email().refine(
  (email) => email.endsWith('.edu') || email.endsWith('.ac.uk'),
  'Use a university email address.'
);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: universityEmail,
  password: z.string().min(8).max(128),
  identification: z.string().trim().min(2).max(100)
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128)
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  identification: z.string().trim().min(2).max(100)
});

export function parseBody(schema, request, response, next) {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: result.error.issues[0]?.message ?? 'Invalid request.' }
    });
  }
  request.body = result.data;
  return next();
}
