import { fetchGraphQL } from './fetchGraphQL'
const GRAPHQL_FIELDS_FEED = `
title
slug
order
technology
link
featuredImage {
  sys {
    id
  }
  ... on Image {
    file {
      url
    }
    altText
    title
    description
  }
}
excerpt
`

const GRAPHQL_FIELDS_POST = `
${GRAPHQL_FIELDS_FEED}
description {
  json
  links {
    assets {
      block {
        sys {
          id
        }
        url
        description
      }
    }
  }
}
`

function extractProject(fetchResponse) {
  return fetchResponse?.data?.projectCollection?.items?.[0]
}

function extractProjectEntries(fetchResponse) {
  return fetchResponse?.data?.projectCollection?.items
}

export async function getPreviewPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      projectCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${GRAPHQL_FIELDS_POST}
        }
      }
    }`,
    true
  )
  return extractProject(entry)
}

export async function getAllProjectsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      projectCollection(where: { slug_exists: true }, order: order_ASC) {
        items {
          ${GRAPHQL_FIELDS_POST}
        }
      }
    }`
  )
  return extractProjectEntries(entries)
}

export async function getAllProjectsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      projectCollection(order: order_ASC, preview: ${
        preview ? 'true' : 'false'
      }) {
        items {
          ${GRAPHQL_FIELDS_FEED}
        }
      }
    }`,
    preview
  )
  return extractProjectEntries(entries)
}

export async function getProjectAndMoreProjects(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      projectCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${GRAPHQL_FIELDS_POST}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      projectCollection(where: { slug_not_in: "${slug}" }, order: order_ASC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${GRAPHQL_FIELDS_POST}
        }
      }
    }`,
    preview
  )
  return {
    project: extractProject(entry),
    moreProjects: extractProjectEntries(entries),
  }
}
