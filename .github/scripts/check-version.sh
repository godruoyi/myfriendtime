#!/bin/bash

# Version consistency checker
# This script verifies that all version files are in sync

set -e

echo "🔍 Checking version consistency..."

# Extract versions from each file
PACKAGE_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
CARGO_VERSION=$(grep 'version = ' src-tauri/Cargo.toml | head -1 | sed 's/version = "\([^"]*\)"/\1/')
TAURI_VERSION=$(grep '"version"' src-tauri/tauri.conf.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')

echo "📦 package.json version: $PACKAGE_VERSION"
echo "🦀 Cargo.toml version: $CARGO_VERSION"
echo "⚙️  tauri.conf.json version: $TAURI_VERSION"

# Check if all versions match
if [ "$PACKAGE_VERSION" = "$CARGO_VERSION" ] && [ "$CARGO_VERSION" = "$TAURI_VERSION" ]; then
    echo "✅ All versions are consistent: $PACKAGE_VERSION"
    exit 0
else
    echo "❌ Version mismatch detected!"
    echo "   package.json: $PACKAGE_VERSION"
    echo "   Cargo.toml: $CARGO_VERSION"
    echo "   tauri.conf.json: $TAURI_VERSION"
    exit 1
fi
