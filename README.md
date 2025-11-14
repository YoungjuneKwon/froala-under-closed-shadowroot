# Froala Editor in Closed Shadow Root

Sample code demonstrating how to use the Froala WYSIWYG editor inside a web component with a closed shadow root.

## Overview

This repository provides working examples of integrating Froala Editor within Web Components that use closed Shadow DOM. This is particularly useful when you need:
- Complete style encapsulation
- Component isolation
- Modern web component architecture
- Integration with frameworks that use shadow DOM

## Features

- ✅ Closed shadow root implementation
- ✅ Full Froala editor functionality
- ✅ Proper toolbar and popup handling
- ✅ Public API for content manipulation
- ✅ Clean, reusable web component
- ✅ Ready for CodePen and production use

## Files

- **`index.html`** - Basic implementation with Froala editor in a closed shadow root
- **`advanced.html`** - Enhanced version with controls and demo functionality

## Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/YoungjuneKwon/froala-under-closed-shadowroot.git
   cd froala-under-closed-shadowroot
   ```

2. Open `index.html` or `advanced.html` in your web browser (no build step required!)

3. Start editing with the Froala WYSIWYG editor

## Usage

### Basic Implementation

```html
<!-- Include required dependencies -->
<link href="https://cdn.jsdelivr.net/npm/froala-editor@latest/css/froala_editor.pkgd.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/froala-editor@latest/js/froala_editor.pkgd.min.js"></script>

<!-- Use the component -->
<froala-editor-component></froala-editor-component>
```

### Interacting with the Editor

```javascript
// Get reference to the component
const editor = document.querySelector('froala-editor-component');

// Get content
const html = editor.getContent();

// Set content
editor.setContent('<p>New content</p>');

// Clear editor
editor.clear();

// Get plain text
const text = editor.getText();
```

## How It Works

The implementation creates a custom web component (`<froala-editor-component>`) that:

1. **Attaches a Closed Shadow Root**: Ensures complete encapsulation
2. **Imports Froala Styles**: Uses `@import` in shadow DOM styles
3. **Initializes Froala**: Properly configures the editor for shadow DOM operation
4. **Exposes Public API**: Provides methods for external interaction
5. **Handles Cleanup**: Properly destroys the editor when component is removed

### Key Technical Details

- **Shadow DOM Mode**: Closed (but maintains internal reference for component methods)
- **Froala Configuration**: `iframe: false` to ensure compatibility with shadow DOM
- **Style Import**: Uses `@import` to load Froala CSS into shadow DOM
- **jQuery Integration**: Froala requires jQuery, which is loaded globally

## Browser Support

This implementation works in all modern browsers that support:
- Custom Elements (Web Components)
- Shadow DOM
- ES6 Classes

Tested in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This sample code is provided as-is for demonstration purposes. 

**Note**: Froala Editor is a commercial product and requires a license for production use. See [Froala's website](https://www.froala.com/wysiwyg-editor/pricing) for licensing information.

## CodePen

You can try this code live on CodePen: [Link to be added]

## Contributing

Feel free to open issues or submit pull requests with improvements!

## Resources

- [Froala Editor Documentation](https://www.froala.com/wysiwyg-editor/docs)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Shadow DOM MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
