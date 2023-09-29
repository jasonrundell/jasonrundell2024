require('dotenv').config()
const spaceImport = require('contentful-import')
const exportFile = require('./export.json')

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    [
      'Parameters missing...',
      'Please run the setup command as follows',
      'CONTENTFUL_SPACE_ID=XXX CONTENTFUL_ACCESS_TOKEN=CFPAT-XXX npm run setup',
    ].join('\n')
  )
}

spaceImport({
  spaceId: CONTENTFUL_SPACE_ID,
  managementToken: CONTENTFUL_ACCESS_TOKEN,
  content: exportFile,
})
  .then(() => console.log('The content model of your space is set up!'))
  .catch((e) => console.error(e))
