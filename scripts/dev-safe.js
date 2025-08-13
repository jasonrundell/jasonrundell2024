#!/usr/bin/env node

/**
 * Memory-safe development server
 * Automatically restarts if memory usage gets too high
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const MAX_MEMORY_MB = 2048 // 2GB limit
const CHECK_INTERVAL = 10000 // Check every 10 seconds
const RESTART_COOLDOWN = 30000 // Wait 30 seconds before restarting

let devProcess = null
let restartCount = 0
let lastRestart = 0
let isRestarting = false

function log(message) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
}

function getMemoryUsage() {
  const usage = process.memoryUsage()
  return {
    rss: Math.round(usage.rss / 1024 / 1024), // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024) // MB
  }
}

function startDevServer() {
  if (isRestarting) return
  
  log('🚀 Starting development server...')
  
  // Clear cache first
  try {
    if (fs.existsSync('.next')) {
      fs.rmSync('.next', { recursive: true, force: true })
      log('🗑️  Cleared .next cache')
    }
  } catch (error) {
    log('⚠️  Failed to clear cache: ' + error.message)
  }

  // Use npx for cross-platform compatibility
  devProcess = spawn('npx', [
    '--max-old-space-size=4096',
    '--expose-gc',
    'next'
  ], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
    shell: true // Use shell for Windows compatibility
  })

  devProcess.on('error', (error) => {
    log('❌ Failed to start dev server: ' + error.message)
    restartDevServer()
  })

  devProcess.on('exit', (code, signal) => {
    if (code !== 0 && !isRestarting) {
      log(`⚠️  Dev server exited with code ${code} (signal: ${signal})`)
      restartDevServer()
    }
  })

  log('✅ Development server started')
}

function restartDevServer() {
  const now = Date.now()
  
  if (isRestarting || (now - lastRestart) < RESTART_COOLDOWN) {
    log('⏳ Restart cooldown active, skipping restart')
    return
  }

  isRestarting = true
  restartCount++
  lastRestart = now

  log(`🔄 Restarting development server (attempt ${restartCount})...`)

  if (devProcess) {
    devProcess.kill('SIGTERM')
    
    setTimeout(() => {
      if (devProcess && !devProcess.killed) {
        devProcess.kill('SIGKILL')
      }
      
      setTimeout(() => {
        isRestarting = false
        startDevServer()
      }, 2000)
    }, 5000)
  } else {
    setTimeout(() => {
      isRestarting = false
      startDevServer()
    }, 2000)
  }
}

function monitorMemory() {
  const memory = getMemoryUsage()
  
  if (memory.heapUsed > MAX_MEMORY_MB) {
    log(`🚨 HIGH MEMORY USAGE: ${memory.heapUsed}MB (limit: ${MAX_MEMORY_MB}MB)`)
    log(`   RSS: ${memory.rss}MB, Heap Total: ${memory.heapTotal}MB, External: ${memory.external}MB`)
    
    if (memory.heapUsed > MAX_MEMORY_MB * 1.5) {
      log('💥 Critical memory usage - forcing restart')
      restartDevServer()
    }
  } else if (memory.heapUsed > MAX_MEMORY_MB * 0.8) {
    log(`⚠️  Memory usage getting high: ${memory.heapUsed}MB`)
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('🛑 Received SIGINT, shutting down...')
  if (devProcess) {
    devProcess.kill('SIGTERM')
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  log('🛑 Received SIGTERM, shutting down...')
  if (devProcess) {
    devProcess.kill('SIGTERM')
  }
  process.exit(0)
})

// Start monitoring
log('🔍 Memory monitoring started')
log(`📊 Memory limit: ${MAX_MEMORY_MB}MB`)
log(`⏱️  Check interval: ${CHECK_INTERVAL}ms`)

startDevServer()

// Monitor memory usage
setInterval(monitorMemory, CHECK_INTERVAL)

// Log memory usage periodically
setInterval(() => {
  const memory = getMemoryUsage()
  log(`📊 Memory: ${memory.heapUsed}MB used, ${memory.heapTotal}MB total`)
}, 60000) // Every minute
