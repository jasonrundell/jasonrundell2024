/**
 * Re-export of the generated typed token tree. Components should always
 * import from this module, never from `tokens.generated.ts` directly.
 *
 * Source of truth: `src/lib/common.tokens.json`.
 * To regenerate after editing the JSON: `npm run tokens:build`.
 */
import Tokens from './tokens.generated'

export default Tokens
