import { z } from 'zod';

const text = (max) => z.string().trim().min(1).max(max);
const date = z.coerce.date();

export const donationSchema = z.object({
  title: text(120), description: text(2000), category: text(60),
  quantity: z.number().int().positive()
});
export const donationUpdateSchema = donationSchema.partial().extend({
  status: z.enum(['available', 'cancelled']).optional()
});

export const lostFoundSchema = z.object({
  type: z.enum(['lost', 'found']), title: text(120), description: text(2000),
  location: text(200), date
});
export const lostFoundUpdateSchema = lostFoundSchema.partial().extend({
  status: z.enum(['open', 'resolved']).optional()
});

export const volunteerSchema = z.object({
  title: text(120), description: text(2000), date, location: text(200),
  capacity: z.number().int().positive()
});
export const volunteerUpdateSchema = volunteerSchema.partial().extend({
  status: z.enum(['open', 'closed']).optional()
});

export const eventSchema = z.object({
  title: text(120), description: text(2000), date, location: text(200),
  capacity: z.number().int().positive()
});
export const eventUpdateSchema = eventSchema.partial().extend({
  status: z.enum(['scheduled', 'cancelled', 'completed']).optional()
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
