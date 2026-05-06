export interface Author {
  name: string
  /** Path-relative src used with next/image */
  picture: string
  url: string
}

const AUTHOR: Author = {
  name: 'Jason Rundell',
  picture: '/images/jason-rundell.webp',
  url: 'https://www.linkedin.com/in/jasonrundell/',
}

export default AUTHOR
