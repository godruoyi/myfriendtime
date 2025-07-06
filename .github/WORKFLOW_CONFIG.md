# GitHub Workflow Templates Configuration

# This file provides templates and shared configuration for workflows

## Shared Environment Variables
CARGO_TERM_COLOR: always
RUST_VERSION: stable
NODE_VERSION: '20'
PNPM_VERSION: 8

## Common Build Targets
MACOS_TARGETS:
  - aarch64-apple-darwin  # Apple Silicon (M1/M2/M3)
  - x86_64-apple-darwin   # Intel Macs

## Supported Platform
- macOS only (optimized for Tauri app development)

## Required System Dependencies by Platform
# UBUNTU_DEPS: (commented out - not used)
#   - libwebkit2gtk-4.0-dev
#   - libappindicator3-dev
#   - librsvg2-dev
#   - patchelf

## Cache Configuration
CACHE_PATHS:
  - ~/.cargo/registry
  - ~/.cargo/git
  - src-tauri/target
  - node_modules
  - ~/.pnpm-store

## Workflow Triggers
# Regular CI: push/PR to master/develop (excludes release workflows)
# Release Prep: manual workflow_dispatch only
# Release Build: PR merge with 'release' label to master branch

## Code Quality
# - Rust formatting check enabled
# - Rust clippy check temporarily disabled
# - TypeScript linting (if configured)
# - Version consistency validation

## Security Notes
# - TAURI_PRIVATE_KEY and TAURI_KEY_PASSWORD are optional
# - GITHUB_TOKEN is automatically provided
# - No sensitive data should be logged
