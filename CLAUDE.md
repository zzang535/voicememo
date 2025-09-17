# Claude Code Instructions

## Version Management Rules

When performing version updates (`version up` command):

1. **Always update package.json version** (e.g., 0.1.0 → 0.2.0)
2. **Add version upgrade memo to UI**: Update the version display in the main app UI (`src/app/page.tsx`) to include:
   - New version number
   - One-sentence description of what was added/changed in this version
3. **Commit with proper message** including version details
4. **Push to remote repository**

### Version Display Format
```tsx
<div className="text-xs text-gray-400 mb-2">
  v{NEW_VERSION}
  <div className="text-xs text-gray-500 mt-1">{ONE_SENTENCE_UPGRADE_DESCRIPTION}</div>
</div>
```

### Example
- v0.2.0: "Added web-based terminal with xterm.js integration"
- v0.3.0: "Implemented real-time collaboration features"

This ensures users can see what's new in each version directly in the app interface.