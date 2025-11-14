(function injectGlobalFroalaCss() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href =
      'https://cdn.jsdelivr.net/npm/froala-editor@4.6.0/css/froala_editor.pkgd.min.css';
    document.head.appendChild(link);
  })();
  
  window.addEventListener('load', () => {
    new FroalaEditor('#outside-editor', {
      toolbarButtons: [],
      events: {}
    });
  });
  
  class FroalaShadowExample extends HTMLElement {
    constructor() {
      super();
  
      const shadowRoot = this.attachShadow({ mode: 'closed' });
  
      const froalaCss = document.createElement('link');
      froalaCss.rel = 'stylesheet';
      froalaCss.type = 'text/css';
      froalaCss.href =
        'https://cdn.jsdelivr.net/npm/froala-editor@4.6.0/css/froala_editor.pkgd.min.css';
  
      const wrapper = document.createElement('div');
      const editorContainer = document.createElement('div');
      editorContainer.id = 'froala-editor';
      editorContainer.innerHTML = `
      <table border=1>
        <tr>
        <th>HELLO</th>
        <th>WORLD</th>
        </tr>
        <tr><td>123</td><td>456</td></tr>
      </table>
      `;
  
      wrapper.appendChild(editorContainer);
  
      shadowRoot.appendChild(froalaCss);
      shadowRoot.appendChild(wrapper);
  
      const initEditor = () => {
        if (!window.FroalaEditor) {
          console.error('FroalaEditor is not loaded yet.');
          return;
        }
  
        this._editor = new FroalaEditor(editorContainer, {
          toolbarButtons: [],
          events: {
            initialized() {
              console.log('Froala editor initialized inside closed ShadowRoot.');
            }
          }
        });
      };
      setTimeout(initEditor, 100);
    }
  }
  
  customElements.define('froala-shadow-example', FroalaShadowExample);
