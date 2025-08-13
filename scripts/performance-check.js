#!/usr/bin/env node

/**
 * Performance monitoring script for development
 * Run with: node scripts/performance-check.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Performance Check for Jason Rundell 2024\n')

// Check for common performance issues
const checks = [
  {
    name: 'Large dependencies',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      const largeDeps = []
      
      Object.entries(deps).forEach(([name, version]) => {
        if (name.includes('@sentry') || name.includes('@vercel') || name.includes('@next')) {
          largeDeps.push({ name, version })
        }
      })
      
      if (largeDeps.length > 0) {
        console.log('⚠️  Large dependencies detected:')
        largeDeps.forEach(dep => console.log(`   - ${dep.name}@${dep.version}`))
        console.log('   Consider lazy loading or code splitting these in development\n')
      } else {
        console.log('✅ Dependencies look reasonable\n')
      }
    }
  },
  
  {
    name: 'Middleware complexity',
    check: () => {
      const middlewarePath = 'src/middleware.ts'
      if (fs.existsSync(middlewarePath)) {
        const content = fs.readFileSync(middlewarePath, 'utf8')
        const lines = content.split('\n').length
        
        if (lines > 100) {
          console.log(`⚠️  Middleware is quite large (${lines} lines)`)
          console.log('   Consider breaking it into smaller functions\n')
        } else {
          console.log(`✅ Middleware size is reasonable (${lines} lines)\n`)
        }
      }
    }
  },
  
  {
    name: 'Environment variables',
    check: () => {
      const envFile = '.env.local'
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8')
        const supabaseVars = content.match(/SUPABASE/g)
        
        if (supabaseVars && supabaseVars.length > 0) {
          console.log('✅ Supabase environment variables found\n')
        } else {
          console.log('⚠️  Supabase environment variables not found')
          console.log('   This could cause authentication delays\n')
        }
      } else {
        console.log('⚠️  .env.local file not found')
        console.log('   Environment variables may not be properly configured\n')
      }
    }
  },
  
  {
    name: 'Development optimizations',
    check: () => {
      const nextConfig = 'next.config.mjs'
      if (fs.existsSync(nextConfig)) {
        const content = fs.readFileSync(nextConfig, 'utf8')
        
        if (content.includes('eval-cheap-module-source-map')) {
          console.log('✅ Fast source maps configured for development\n')
        } else {
          console.log('⚠️  Consider using faster source maps in development\n')
        }
        
        if (content.includes('poll: 1000')) {
          console.log('✅ File watching optimized\n')
        } else {
          console.log('⚠️  File watching could be optimized\n')
        }
      }
    }
  },
  
  {
    name: 'Bundle analysis',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      const scripts = packageJson.scripts || {}
      
      if (scripts.analyze) {
        console.log('✅ Bundle analyzer available - run: npm run analyze\n')
      } else {
        console.log('⚠️  Consider adding bundle analysis to identify large packages\n')
      }
    }
  }
]

// Run all checks
checks.forEach(check => {
  console.log(`📋 ${check.name}:`)
  check.check()
})

// Performance recommendations
console.log('🚀 Performance Recommendations:')
console.log('1. Use React DevTools Profiler to identify slow components')
console.log('2. Check Network tab for slow API calls')
console.log('3. Monitor Console for authentication delays')
console.log('4. Consider using React.memo for expensive components')
console.log('5. Use dynamic imports for heavy libraries')
console.log('6. Monitor bundle size with: npm run analyze')
console.log('7. Check if Supabase project is paused (causes delays)')
console.log('8. Use React.lazy for route-based code splitting\n')

console.log('💡 Quick fixes to try:')
console.log('- Clear .next folder: npm run clear-cache')
console.log('- Restart dev server: npm run dev')
console.log('- Check Supabase status at /supabase-status')
console.log('- Monitor middleware performance in Network tab\n')
