import { html } from 'hono/html'

export const RegisterPage = () => html`
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Register</h2>
      <form hx-post="/register" hx-target="#register-result" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" required 
            class="mt-1 w-full px-4 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" required 
            class="mt-1 w-full px-4 py-2 border rounded">
        </div>
        <button type="submit" 
          class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
      <div id="register-result"></div>
    </div>
  `