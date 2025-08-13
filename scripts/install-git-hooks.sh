#!/bin/bash

# Script to install Git hooks for the project
# This ensures all developers have the same hooks installed

set -e

echo "🔧 Installing Git hooks..."

# Get the repository root directory
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# Check if we're in a git repository
if [ ! -d "$REPO_ROOT/.git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Create hooks directory if it doesn't exist
HOOKS_DIR="$REPO_ROOT/.git/hooks"
mkdir -p "$HOOKS_DIR"

# Copy the pre-push hook
if [ -f "$REPO_ROOT/.git/hooks/pre-push" ]; then
    echo "📋 Pre-push hook already exists, backing up..."
    cp "$REPO_ROOT/.git/hooks/pre-push" "$REPO_ROOT/.git/hooks/pre-push.backup"
fi

# Copy the hook from the scripts directory if it exists, otherwise create it
if [ -f "$REPO_ROOT/scripts/pre-push" ]; then
    cp "$REPO_ROOT/scripts/pre-push" "$HOOKS_DIR/pre-push"
else
    # Create the pre-push hook content
    cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash

# Pre-push hook to run build and prevent push if build fails
# This hook runs before a push and will cancel the push if npm run build fails

set -e  # Exit on any error

echo "🔍 Running pre-push build check..."

# Change to the repository root directory
cd "$(git rev-parse --show-toplevel)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH"
    exit 1
fi

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
fi

# Check if build script exists in package.json
if ! npm run --silent build --help &> /dev/null; then
    echo "❌ Error: 'build' script not found in package.json"
    exit 1
fi

# Run the build with a timeout (5 minutes)
echo "🏗️  Running build (this may take a few minutes)..."
timeout 300 npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Proceeding with push..."
    exit 0
elif [ $? -eq 124 ]; then
    echo "❌ Build timed out after 5 minutes. Push cancelled."
    echo "Consider optimizing your build process or increasing the timeout."
    exit 1
else
    echo "❌ Build failed! Push cancelled."
    echo ""
    echo "Please fix the build errors before pushing:"
    echo "1. Run 'npm run build' locally to see the errors"
    echo "2. Fix any TypeScript, linting, or build issues"
    echo "3. Try building again"
    echo "4. Once build passes, you can push"
    echo ""
    echo "Common build issues to check:"
    echo "- TypeScript compilation errors"
    echo "- Missing dependencies"
    echo "- Environment variable issues"
    echo "- Linting errors"
    echo ""
    exit 1
fi
EOF
fi

# Make the hook executable
chmod +x "$HOOKS_DIR/pre-push"

echo "✅ Git hooks installed successfully!"
echo ""
echo "The following hooks are now active:"
echo "  - pre-push: Runs 'npm run build' before pushing and cancels if it fails"
echo ""
echo "To test the hook, try running:"
echo "  git push origin <branch-name>"
echo ""
echo "If the build fails, the push will be cancelled and you'll see helpful error messages."
echo ""
echo "To skip the hook in an emergency (not recommended):"
echo "  git push --no-verify origin <branch-name>"
