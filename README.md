# Jason Rundell 2024 Personal Site

This is the 2024 edition of Jason Rundell's personal website, built with Next.js
and Contentful for dynamic content management. The site showcases projects,
posts, and skills, with a focus on accessibility, modern web technologies, and
optimized performance.

## Features

- **Dynamic Content**: Uses Contentful as a headless CMS for managing posts,
  projects, and images.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Accessible and Inclusive**: Designed with accessibility in mind, including
  semantic HTML and contrast adjustments.
- **SEO-Friendly**: Configured for search engines with proper metadata.
- **Image Optimization**: Next.js's `next/image` is used to optimize images.

## Development

### Project Documentation

- Project index: [docs/PROJECT_INDEX.md](./docs/PROJECT_INDEX.md)
- Keep the index updated whenever routes, integrations, folder structure, or test locations change.

### Validation

The same npm commands work in Windows PowerShell, Windows Command Prompt, macOS
Terminal, and Linux shells.

- Lint: `npm run lint`
- Tests with enforced coverage gates: `npm run test:ci`
- Production build: `npm run build`

Coverage is enforced by `scripts/check-coverage.js`.

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run validation: `npm run lint` and `npm run test:ci`
4. Run the development server: `npm run dev`

## Deployment

### Contentful Webhooks

To enable incremental builds when content is published in Contentful, set up
webhooks to trigger automatic revalidation. See
[docs/WEBHOOK_SETUP.md](./docs/WEBHOOK_SETUP.md) for complete setup
instructions.

## Technologies

- **Next.js**: A powerful React framework for server-rendered applications.
- **React**: Component-based structure for easy customization and scalability.
- **Contentful**: Headless CMS for managing content.
- **Pigment-CSS**: CSS-in-JS library for styled components.
- **Jest**: Testing framework to ensure quality and functionality.

## License

This project is licensed under the MIT License.
