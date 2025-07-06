#!/bin/bash

# Update versions in all relevant files
# Usage: ./update-version.sh <new_version>

set -e

if [ $# -ne 1 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 0.2.0"
    exit 1
fi

NEW_VERSION="$1"

echo "🔄 Updating version to $NEW_VERSION..."

# Update package.json
echo "📦 Updating package.json..."
npm version "$NEW_VERSION" --no-git-tag-version

# Update Cargo.toml (only the [package] section)
echo "🦀 Updating Cargo.toml..."
# Use awk to update only the version in [package] section
awk -v new_ver="$NEW_VERSION" '
BEGIN { in_package = 0; updated = 0 }
/^\[package\]/ { in_package = 1 }
/^\[/ && !/^\[package\]/ { in_package = 0 }
in_package && /^version = / && !updated {
    print "version = \"" new_ver "\""
    updated = 1
    next
}
{ print }
' src-tauri/Cargo.toml > src-tauri/Cargo.toml.tmp && mv src-tauri/Cargo.toml.tmp src-tauri/Cargo.toml

# Update tauri.conf.json
echo "⚙️  Updating tauri.conf.json..."
sed -i.bak 's/"version": "[^"]*"/"version": "'"$NEW_VERSION"'"/' src-tauri/tauri.conf.json && rm -f src-tauri/tauri.conf.json.bak

# Update Cargo.lock
echo "🔒 Updating Cargo.lock..."
cd src-tauri
cargo update --package myfriendtime
cd ..

echo "✅ Version updated successfully to $NEW_VERSION"

# Verify the changes
echo ""
echo "🔍 Verification:"
echo "📦 package.json: $(grep '"version"' package.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')"
echo "🦀 Cargo.toml: $(grep 'version = ' src-tauri/Cargo.toml | head -1 | sed 's/version = "\([^"]*\)"/\1/')"
echo "⚙️  tauri.conf.json: $(grep '"version"' src-tauri/tauri.conf.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')"
