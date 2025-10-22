# Development Notes

## Single Source of Truth - Section Files Only

The portfolio now uses **only** the HTML files in the `/sections/` directory as the source of truth. There is no fallback content in JavaScript.

## Required: Use a Local Server

This portfolio **must** be served from a web server to function properly due to browser CORS restrictions.

### Quick Start
```bash
# Navigate to portfolio directory
cd /Users/jolie/Desktop/portfolio-hci

# Start Python server
python3 -m http.server 8000

# Open in browser
http://localhost:8000
```

### Alternative Servers
```bash
# Python 2 (if python3 not available)
python -m SimpleHTTPServer 8000

# Node.js (if you have it installed)
npx serve .

# PHP (if available)
php -S localhost:8000
```

## File Structure - Clean and Simple
```
portfolio-hci/
├── index.html              # Main portfolio page
├── css/styles.css          # Styling
├── js/main.js             # JavaScript (no fallback content)
├── sections/              # SINGLE SOURCE OF TRUTH
│   ├── research.html      # Edit your research content here
│   ├── projects.html      # Edit your projects here
│   └── misc.html          # Edit miscellaneous content here
└── DEVELOPMENT_NOTES.md   # This file
```

## Editing Workflow

1. **Edit section files** in `/sections/` directory
2. **Refresh browser** - changes appear immediately (no cache issues)
3. **That's it!** Clean and simple.

## Cache Management

- **Keyboard Shortcut**: `Ctrl+Shift+R` / `Cmd+Shift+R` clears cache
- **Console**: `portfolioDebug.clearSectionCache()` in browser dev tools
- **URL Parameter**: Add `?nocache` to URL

## Benefits of This Approach

✅ **Single source of truth** - Edit only the section files
✅ **Immediate changes** - Refresh to see updates
✅ **No duplication** - Content exists in only one place
✅ **Clean architecture** - Proper separation of concerns
✅ **Production ready** - Works the same locally and deployed