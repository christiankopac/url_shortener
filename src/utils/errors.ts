import type { Context } from "hono";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 500,
    public code = 'INTERNAL_ERROR'
  ) {
    super(message);
  }
}

export function handleError(c: Context, error: unknown) {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    return c.html(`
      <div class="mt-4 p-4 bg-red-100 text-red-700 rounded">
        ${error.message}
      </div>
    `, { status: error.status });
  }

  return c.html(`
    <div class="mt-4 p-4 bg-red-100 text-red-700 rounded">
      An unexpected error occurred. Please try again later.
      ${process.env.NODE_ENV === 'development' ? `<pre>${error}</pre>` : ''}
    </div>
  `, 500);
}
