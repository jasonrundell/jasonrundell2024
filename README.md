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

### Git Hooks

This repository includes Git hooks to ensure code quality:

- **Pre-push Hook**: Automatically runs `npm run build` before pushing and prevents broken builds from being committed
- **Installation**: Run `./scripts/install-git-hooks.sh` after cloning to set up the hooks
- **Documentation**: See [GIT_HOOKS.md](./GIT_HOOKS.md) for detailed information

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Install Git hooks: `./scripts/install-git-hooks.sh`
4. Run the development server: `npm run dev`

## Deployment

### Contentful Webhooks

To enable incremental builds when content is published in Contentful, set up webhooks to trigger automatic revalidation. See [docs/WEBHOOK_SETUP.md](./docs/WEBHOOK_SETUP.md) for complete setup instructions.

## Technologies

- **Next.js**: A powerful React framework for server-rendered applications.
- **React**: Component-based structure for easy customization and scalability.
- **Contentful**: Headless CMS for managing content.
- **Pigment-CSS**: CSS-in-JS library for styled components.
- **Jest**: Testing framework to ensure quality and functionality.

## License

This project is licensed under the MIT License.
