# Release Checklist

## Pre-Release Checklist

### Code Quality
- [ ] All tests pass locally
- [ ] Code builds successfully on macOS
- [ ] No lint warnings or errors
- [ ] All features tested manually
- [ ] Documentation updated if needed

### Version Management
- [ ] Version follows semantic versioning (x.y.z)
- [ ] Version is higher than current release
- [ ] Changelog or release notes prepared

### Repository State
- [ ] All intended changes are merged to main
- [ ] No pending critical PRs
- [ ] CI builds are passing

## Release Process

### Step 1: Initiate Release
- [ ] Go to Actions → Prepare Release
- [ ] Enter new version number (e.g., 0.2.0)
- [ ] Run workflow
- [ ] Wait for release PR to be created

### Step 2: Review Release PR
- [ ] Verify version updates in all files:
  - [ ] package.json
  - [ ] src-tauri/Cargo.toml
  - [ ] src-tauri/tauri.conf.json
  - [ ] src-tauri/Cargo.lock
- [ ] Check that PR has 'release' label
- [ ] Review any additional changes

### Step 3: Merge and Release
- [ ] Merge the release PR
- [ ] Monitor release workflow progress
- [ ] Verify DMG files are built for both architectures
- [ ] Check that GitHub release is created

## Post-Release Checklist

### Verification
- [ ] Release appears on GitHub releases page
- [ ] Both Intel and Apple Silicon DMGs are available
- [ ] DMG files download and install correctly
- [ ] App version matches release version
- [ ] App functionality works as expected

### Communication
- [ ] Announce release if needed
- [ ] Update documentation sites
- [ ] Notify users of major changes

## Troubleshooting

### Common Issues
- **Release workflow not triggering**: Check PR has 'release' label and title format
- **Build failures**: Check dependencies and local build first
- **DMG not signed**: Add TAURI_PRIVATE_KEY and TAURI_KEY_PASSWORD secrets
- **Wrong version**: Re-run prepare release workflow with correct version

### Emergency Rollback
If a release has critical issues:
1. Create hotfix branch from previous version tag
2. Apply minimal fix
3. Follow release process with patch version
4. Consider marking problematic release as draft
