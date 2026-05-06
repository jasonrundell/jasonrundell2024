/**
 * Copies all image assets from content/ to public/content/ so Next.js can
 * serve them as static files at /content/<type>/<slug>/<file>.
 *
 * Run automatically as part of `predev` and `prebuild`.
 */

const fs = require('fs')
const path = require('path')

const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif'])
const SRC_DIR = path.resolve(__dirname, '..', 'content')
const DEST_DIR = path.resolve(__dirname, '..', 'public', 'content')

let copied = 0
let skipped = 0

function syncDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return

  fs.mkdirSync(destDir, { recursive: true })

  for (const entry of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, entry)
    const destPath = path.join(destDir, entry)
    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      syncDir(srcPath, destPath)
    } else {
      const ext = path.extname(entry).toLowerCase()
      if (!IMAGE_EXTENSIONS.has(ext)) {
        skipped++
        continue
      }

      const srcMtime = stat.mtimeMs
      let destMtime = 0
      if (fs.existsSync(destPath)) {
        destMtime = fs.statSync(destPath).mtimeMs
      }

      if (srcMtime > destMtime) {
        fs.copyFileSync(srcPath, destPath)
        copied++
      }
    }
  }
}

syncDir(SRC_DIR, DEST_DIR)

if (copied > 0) {
  console.log(`sync-content-images: copied ${copied} image(s) to public/content/`)
}
