import { html } from 'hono/html'
import type { AuthInfo } from '../../middleware/auth'
import type { HtmlEscapedString } from 'hono/utils/html'

export const Layout = (props: { children: HtmlEscapedString | Promise<HtmlEscapedString>, user?: AuthInfo }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <title>URL Shortener</title>
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
      <nav class="bg-white shadow mb-4">
        <div class="container mx-auto px-6 py-3">
          <div class="flex justify-between">
            <div class="text-xl font-semibold">URL Shortener</div>
            <div>
              ${props.user ? html`
                <a href="/dashboard" class="px-4 py-2">Dashboard</a>
                <button hx-post="/logout" class="px-4 py-2">Logout</button>
              ` : html`
                <a href="/login" class="px-4 py-2">Login</a>
                <a href="/register" class="px-4 py-2">Register</a>
              `}
            </div>
          </div>
        </div>
      </nav>
      <main class="container mx-auto px-6">
        ${props.children}
      </main>
    </body>
  </html>
`