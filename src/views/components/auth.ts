import { html } from 'hono/html';

export const InvalidLoginMessage = () => html`
        <div class="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Invalid email or password.
        </div>
      `
export const SuccesfulLoginMessage = () => html`
      <div class="mt-4 p-4 bg-green-100 text-green-700 rounded">
        Login successful! Redirecting to dashboard...
        <script>
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        </script>
      </div>
    `
export const FailedLoginMessage = (error: Error) => html`
      <div class="mt-4 p-4 bg-red-100 text-red-700 rounded">
        Login failed. Please try again later.
      </div>
    `