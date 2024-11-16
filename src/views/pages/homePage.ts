import {html } from 'hono/html';
import type { AuthInfo } from '../../middleware/auth';

export const HomePage = (props: { user?: AuthInfo }) => html`
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Shorten your URL</h1>
    <form hx-post="/shorten" hx-target="#result" class="space-y-4">
      <input 
        type="text" 
        name="url" 
        placeholder="Enter your URL" 
        class="w-full px-4 py-2 border rounded" 
        required
      />
      <button 
        type="submit" 
        class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Shorten
      </button>
    </form>
    <div id="result" class="mt-4"></div>
  </div>
`