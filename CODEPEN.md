# CodePen Setup Guide

This guide explains how to use the examples in this repository on CodePen.

## Quick Setup for CodePen

### Option 1: Minimal Example (Recommended for CodePen)

Use the `minimal.html` file - it's the simplest and cleanest for CodePen.

**HTML Panel:**
```html
<froala-shadow-editor></froala-shadow-editor>
```

**CSS Panel:**
```css
/* External CSS (Settings -> CSS) */
Add: https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css

/* Optional styling */
body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f5f5f5;
}
```

**JS Panel:**
```javascript
// External JS (Settings -> JavaScript) - Add these in order:
// 1. https://code.jquery.com/jquery-3.6.0.min.js
// 2. https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js

class FroalaShadowEditor extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    this._shadow = shadow;
    this.editor = null;
  }
  
  connectedCallback() {
    this._shadow.innerHTML = `
      <style>
        @import url('https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css');
        :host { display: block; }
        #editor { min-height: 300px; }
      </style>
      <div id="editor">
        <p>Start editing here...</p>
      </div>
    `;
    
    const el = this._shadow.getElementById('editor');
    this.editor = new FroalaEditor(el, {
      heightMin: 300,
      iframe: false
    });
  }
  
  disconnectedCallback() {
    if (this.editor) this.editor.destroy();
  }
  
  getContent() {
    return this.editor ? this.editor.html.get() : '';
  }
  
  setContent(html) {
    if (this.editor) this.editor.html.set(html);
  }
}

customElements.define('froala-shadow-editor', FroalaShadowEditor);
```

### Option 2: Full Demo Version

For the complete interactive demo with buttons and styling, copy the contents from `demo.html`.

## External Resources Required

Add these in CodePen Settings:

**CSS:**
- `https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css`

**JavaScript (in order):**
1. `https://code.jquery.com/jquery-3.6.0.min.js`
2. `https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js`

## How to Use in CodePen

1. **Create a new Pen** at [codepen.io](https://codepen.io)

2. **Add External Resources:**
   - Click the ⚙️ Settings button
   - Go to "CSS" tab → Add the Froala CSS URL
   - Go to "JS" tab → Add jQuery and Froala JS URLs (in that order)

3. **Copy the Code:**
   - HTML: Just the `<froala-shadow-editor></froala-shadow-editor>` tag
   - CSS: Any custom styling you want
   - JS: The entire Web Component class definition and registration

4. **Save and Run** - Your editor should appear instantly!

## Features Demonstrated

- ✅ Closed Shadow Root encapsulation
- ✅ Full Froala WYSIWYG functionality
- ✅ Public API methods (getContent, setContent)
- ✅ Proper cleanup on disconnect
- ✅ Style isolation

## Troubleshooting

**Editor doesn't appear:**
- Check that external resources are loaded in the correct order
- Open browser console to check for errors
- Ensure jQuery loads before Froala

**Styling issues:**
- Make sure the Froala CSS is imported in the shadow DOM styles
- Check that `@import` is supported (it is in all modern browsers)

**Toolbar not working:**
- Ensure `iframe: false` is set in Froala config
- Check browser console for errors

## License Note

Froala Editor requires a license for commercial use. The free version includes attribution. Visit [froala.com](https://www.froala.com/wysiwyg-editor) for licensing options.

## Live Examples

You can find working CodePen examples at:
- [Link to be added after creating CodePen]

## Additional Examples in This Repo

- `minimal.html` - Bare minimum implementation
- `index.html` - Basic implementation with comments
- `advanced.html` - Full-featured with control buttons
- `demo.html` - Styled demo version for presentations
