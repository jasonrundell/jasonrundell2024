import tokensFile from './common.tokens.json'

// Ensure the tokens are properly parsed and have fallbacks
const Tokens = JSON.parse(JSON.stringify(tokensFile))

export default Tokens
