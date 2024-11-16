# URL Shortener

A simple URL shortening service built with Bun. Transforms long URLs into shorter, more manageable links.

## Requirements

- [Bun](https://bun.sh) v1.1.33 or higher

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
bun install
```

## Usage

To run the URL shortener:

1. Set the environment variables in `.env`:

    ```env
    DATABASE_URL=<your-database-url>
    DATABASE_AUTH_TOKEN=<your-database-auth-token>
    ```

2. Start the application:

    ```bash
    bun run start
    ```

## Features

- Basic authentication (register, login, logout)
- Shortened URL dashboard and simple analytics (click count)

## Project Structure

```
src
|- controllers
|- db
|- drizzle
|- middleware
|- routes
|- services
|- utils
|- views
   |- components
   |- layout
   |- pages
```

### Directories

- `src/controllers`: Contains the logic for handling requests and responses.
- `src/db`: Database schema and setup.
- `src/drizzle`: ORM configuration and setup.
- `src/middleware`: Middleware functions for request processing.
- `src/routes`: Route definitions and handlers.
- `src/services`: Business logic and services.
- `src/utils`: Utility functions and helpers.
- `src/views`: View components for rendering HTML.
  - `components`: Reusable UI components.
  - `layout`: Layout components.
  - `pages`: Page components.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.