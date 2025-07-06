# GitHub Actions Release Workflow

This repository uses automated GitHub Actions workflows to handle continuous integration and releases.

## Workflows Overview

### 1. CI Workflow (`ci.yml`)
- **Triggers**: Push/PR to master/develop branches (excluding release workflows and markdown files)
- **Purpose**: Runs tests, linting, and build checks on macOS platform
- **Does NOT trigger releases**

### 2. Prepare Release Workflow (`prepare-release.yml`)
- **Trigger**: Manual execution only (workflow_dispatch)
- **Purpose**: Creates a release PR with version updates
- **Process**:
  1. Takes version input (e.g., `0.2.0`)
  2. Creates a release branch `release/vX.Y.Z`
  3. Updates versions in:
     - `package.json`
     - `src-tauri/Cargo.toml`
     - `src-tauri/tauri.conf.json`
     - `src-tauri/Cargo.lock`
  4. Creates a PR with the changes

### 3. Release Workflow (`release.yml`)
- **Trigger**: When a release PR (with 'release' label) is merged to master
- **Purpose**: Builds and publishes the app for macOS
- **Process**:
  1. Builds DMG files for both Intel (x64) and Apple Silicon (arm64) Macs
  2. Creates a GitHub release with the DMG files
  3. Publishes the release automatically

## How to Release

### Step 1: Prepare Release
1. Go to **Actions** tab in GitHub
2. Select **Prepare Release** workflow
3. Click **Run workflow**
4. Enter the new version (e.g., `0.2.0`)
5. Click **Run workflow**

### Step 2: Review and Merge
1. A PR will be automatically created with title `Release vX.Y.Z`
2. Review the version changes in the PR
3. **Merge the PR** (this will trigger the release build)

### Step 3: Automatic Release
1. The release workflow will automatically start
2. DMG files will be built for both architectures
3. A GitHub release will be created with the DMG files
4. Users can download the appropriate version for their Mac

## Important Notes

- ⚠️ **Only merge release PRs when you're ready to publish**
- ✅ Regular commits and PRs will NOT trigger releases
- 🤖 Release PRs are created by GitHub Actions bot
- 📦 Both Intel (x64) and Apple Silicon (arm64) DMGs are built for macOS
- 🏷️ Release PRs must have the 'release' label (automatically added)
- 🍎 Optimized for macOS development and deployment

## Required Secrets

For code signing (optional but recommended):
- `TAURI_PRIVATE_KEY`: Your Tauri private key for code signing
- `TAURI_KEY_PASSWORD`: Password for the private key

## File Structure

```
.github/workflows/
├── ci.yml              # Continuous integration
├── prepare-release.yml # Manual release preparation
└── release.yml         # Automatic release build
```

## Troubleshooting

### Release not triggering
- Check that the PR has the 'release' label
- Ensure the PR title matches the pattern `Release vX.Y.Z`
- Verify the PR was merged (not just closed)

### Build failures
- Check that all dependencies are properly installed
- Ensure Rust and Node.js versions are compatible
- Verify that the code builds locally first

### DMG not generated
- Check macOS runner logs for errors
- Ensure Tauri configuration is correct
- Verify all required permissions and certificates
