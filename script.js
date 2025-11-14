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
      pluginsEnabled: ['table', 'link', 'lists', 'colors', 'fontSize'],
      toolbarButtons: {
        'moreText': {
          'buttons': ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor']
        },
        'moreParagraph': {
          'buttons': ['alignLeft', 'alignCenter', 'formatOL', 'formatUL']
        },
        'moreRich': {
          'buttons': ['insertTable', 'insertLink']
        },
        'moreMisc': {
          'buttons': ['undo', 'redo', 'fullscreen', 'html']
        }
      },
      tableEditButtons: ['tableHeader', 'tableRemove', '|', 'tableRows', 'tableColumns', 'tableStyle', '-', 'tableCells', 'tableCellBackground', 'tableCellVerticalAlign', 'tableCellHorizontalAlign'],
      events: {}
    });
  });
  
  class FroalaShadowExample extends HTMLElement {
    constructor() {
      super();
  
      // Closed shadow root 유지
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      
      // Shadow root 참조 저장
      this._shadowRoot = shadowRoot;
      this._currentTable = null;
      this._resizerElement = null;
  
      const froalaCss = document.createElement('link');
      froalaCss.rel = 'stylesheet';
      froalaCss.type = 'text/css';
      froalaCss.href =
        'https://cdn.jsdelivr.net/npm/froala-editor@4.6.0/css/froala_editor.pkgd.min.css';
      
      // Custom CSS for shadow root
      const customCss = document.createElement('style');
      customCss.textContent = `
        /* Froala native table hover outline */
        table.fr-table-selection-hover {
          outline: #F6D146 2px solid !important;
        }
        
        table.fr-table-selected {
          outline: #0098F7 2px solid !important;
          caret-color: transparent;
        }
      `;
  
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      
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
      shadowRoot.appendChild(customCss);
      shadowRoot.appendChild(wrapper);      const initEditor = () => {
        if (!window.FroalaEditor) {
          console.error('FroalaEditor is not loaded yet.');
          return;
        }
  
        // Froala 에디터 초기화
        this._editor = new FroalaEditor(editorContainer, {
          // 테이블 플러그인 활성화
          pluginsEnabled: ['table', 'link', 'lists', 'colors', 'fontSize'],
          
          // 툴바 버튼 설정
          toolbarButtons: {
            'moreText': {
              'buttons': ['bold', 'italic', 'underline', 'fontSize', 'textColor', 'backgroundColor']
            },
            'moreParagraph': {
              'buttons': ['alignLeft', 'alignCenter', 'formatOL', 'formatUL']
            },
            'moreRich': {
              'buttons': ['insertTable', 'insertLink']
            },
            'moreMisc': {
              'buttons': ['undo', 'redo', 'fullscreen', 'html']
            }
          },
          
          // 테이블 관련 설정
          tableEditButtons: ['tableHeader', 'tableRemove', '|', 'tableRows', 'tableColumns', 'tableStyle', '-', 'tableCells', 'tableCellBackground', 'tableCellVerticalAlign', 'tableCellHorizontalAlign'],
          tableInsertButtons: ['tableBack', '|', 'tableHeader', 'tableRows', 'tableColumns'],
          tableResizer: true,
          tableResizerOffset: 5,
          tableResizingLimit: 30,
          tableMultipleStyles: true,
          tableCellMultipleStyles: true,
          tableColors: ['#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC', '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000', '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF', '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'],
          
          // 기본 설정
          iframe: false,
          heightMin: 300,
          heightMax: 500,
          
          events: {
            'initialized': function() {
              console.log('==== Froala Editor Initialized ====');
              console.log('FroalaEditor.PLUGINS.table exists:', !!window.FroalaEditor?.PLUGINS?.table);
              console.log('this.table exists:', !!this.table);
              
              if (this.table) {
                console.log('✓ Table plugin loaded successfully!');
                console.log('Table plugin methods:', Object.keys(this.table));
              } else {
                console.error('✗ Table plugin NOT loaded!');
              }
              
              // 에디터 초기화 후 이벤트 브릿징 설정 - this를 올바르게 전달
              const editor = this;
              setTimeout(() => {
                setupEventBridging.call(editor, editor);
              }, 100);
            },
            'mouseup': function(e) {
              // 테이블 내부 클릭 감지
              const table = e.target.closest('table');
              if (table) {
                console.log('Table clicked, triggering resizer');
                if (this.table && this.table.showEditPopup) {
                  this.table.showEditPopup();
                }
              }
            }
          }
        });
        
        // 이벤트 브릿징 함수 - 에디터 인스턴스를 매개변수로 받음
        const setupEventBridging = function(editorInstance) {
          const editor = editorInstance || this;
          const editorElement = shadowRoot.getElementById('froala-editor');
          
          console.log('Setting up event bridging...');
          console.log('Editor in setupEventBridging:', editor);
          console.log('Editor.table exists:', !!editor.table);
          
          // 테이블 플러그인 확인
          if (!editor.table) {
            console.error('ERROR: Table plugin is not available in setupEventBridging');
            console.log('Available editor properties:', Object.keys(editor));
            return;
          }
          
          console.log('✓ Table plugin is available in setupEventBridging');
          if (editor.table) {
            const tableMethods = Object.keys(editor.table);
            console.log('Table methods count:', tableMethods.length);
            console.log('Table methods:', tableMethods.join(', '));
          }
          
          const componentContext = this;
          
          // Froala의 jQuery 래퍼를 패치하여 shadow root의 요소도 찾을 수 있게 함
          if (editor.$ && editor.$el) {
            const original$ = editor.$;
            
            // Froala의 $ 함수를 래핑
            editor.$ = function(selector) {
              // 원본 호출
              let result = original$.call(this, selector);
              
              // 결과가 없고 selector가 문자열이면 shadow root에서도 검색
              if ((!result || result.length === 0) && typeof selector === 'string') {
                const shadowElements = shadowRoot.querySelectorAll(selector);
                if (shadowElements.length > 0) {
                  // jQuery 객체로 변환
                  result = original$(shadowElements);
                  console.log(`Found ${shadowElements.length} elements in shadow root for selector: ${selector}`);
                }
              }
              
              return result;
            };
            
            // $ 함수의 프로토타입과 속성 복사
            Object.setPrototypeOf(editor.$, original$);
            Object.keys(original$).forEach(key => {
              if (!(key in editor.$)) {
                editor.$[key] = original$[key];
              }
            });
          }
          
          // Froala의 테이블 이벤트 핸들러를 직접 호출
          if (editor.events && editor.$el && editor.$el[0]) {
            const froalaElement = editor.$el[0];
            
            // Froala 네이티브 방식: table에 outline 적용 + resize handles
            let mouseoverTimeout;
            let currentHoveredTable = null;
            
            editorElement.addEventListener('mouseover', function(e) {
              const table = e.target.closest('table');
              if (table && table !== currentHoveredTable) {
                clearTimeout(mouseoverTimeout);
                mouseoverTimeout = setTimeout(() => {
                  console.log('Table hover - applying Froala outline style');
                  currentHoveredTable = table;
                  componentContext._currentTable = table;
                  
                  // Froala 네이티브: table에 fr-table-selection-hover 클래스 추가
                  table.classList.add('fr-table-selection-hover');
                  
                  if (editor.table && editor.opts.tableResizer) {
                    try {
                      // Resize handles 생성 (가로, 세로 각각)
                      createResizeHandles(table);
                    } catch (err) {
                      console.error('Resize handles error:', err.message);
                    }
                  }
                }, 50);
              }
            });
            
            // Resize handles 생성 함수
            function createResizeHandles(table) {
              // 기존 handles 제거
              const existingHandles = document.querySelectorAll('.fr-resize-handle');
              existingHandles.forEach(h => h.remove());
              
              const rect = table.getBoundingClientRect();
              
              // 가로 resize handle (오른쪽 중앙) - 투명, hover 시에만 표시
              const rightHandle = document.createElement('div');
              rightHandle.className = 'fr-resize-handle fr-resize-right';
              rightHandle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 60px;
                background: transparent;
                cursor: ew-resize;
                z-index: 2147483647;
                top: ${rect.top + (rect.height - 60) / 2}px;
                left: ${rect.right - 5}px;
                border-radius: 3px;
                transition: background 0.2s ease;
              `;
              
              // Hover 시 시각적 피드백
              rightHandle.addEventListener('mouseenter', () => {
                rightHandle.style.background = 'rgba(0, 152, 247, 0.5)';
              });
              rightHandle.addEventListener('mouseleave', () => {
                rightHandle.style.background = 'transparent';
              });
              
              document.body.appendChild(rightHandle);
              
              // Column/Row border resize handles 추가
              createBorderResizeHandles(table);
              
              // 가로 resize 드래그
              let isResizingWidth = false;
              let startX, startWidth;
              
              rightHandle.addEventListener('mousedown', (e) => {
                isResizingWidth = true;
                startX = e.clientX;
                startWidth = rect.width;
                e.preventDefault();
                e.stopPropagation();
                console.log('✓ Width resize started');
              });
              
              // 드래그 이동
              const handleMouseMove = (e) => {
                if (isResizingWidth) {
                  const deltaX = e.clientX - startX;
                  const newWidth = Math.max(100, startWidth + deltaX);
                  table.style.width = newWidth + 'px';
                  
                  // Handle 위치 업데이트
                  const newRect = table.getBoundingClientRect();
                  rightHandle.style.left = (newRect.right - 5) + 'px';
                  e.preventDefault();
                }
              };
              
              // 드래그 종료
              const handleMouseUp = () => {
                if (isResizingWidth) {
                  console.log('✓ Resize completed');
                  if (editor.undo) {
                    editor.undo.saveStep();
                  }
                }
                isResizingWidth = false;
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
              
              // Cleanup 저장
              componentContext._resizeHandlesCleanup = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                rightHandle.remove();
                // Border handles cleanup
                const borderHandles = document.querySelectorAll('.fr-column-resize');
                borderHandles.forEach(h => h.remove());
              };
            }
            
            // 셀 구분선에서 column/row resize 가능하도록 handles 추가
            function createBorderResizeHandles(table) {
              const rows = table.querySelectorAll('tr');
              if (rows.length === 0) return;
              
              const firstRow = rows[0];
              const cells = firstRow.querySelectorAll('td, th');
              
              // Column resize handles (각 셀의 오른쪽 border)
              cells.forEach((cell, index) => {
                if (index < cells.length - 1) { // 마지막 셀 제외
                  const rect = cell.getBoundingClientRect();
                  const handle = document.createElement('div');
                  handle.className = 'fr-resize-handle fr-column-resize';
                  handle.dataset.columnIndex = index;
                  handle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: ${rect.height}px;
                    cursor: col-resize;
                    z-index: 2147483646;
                    top: ${rect.top}px;
                    left: ${rect.right - 4}px;
                    background: transparent;
                  `;
                  
                  // Hover 시 시각적 피드백
                  handle.addEventListener('mouseenter', () => {
                    handle.style.background = 'rgba(0, 152, 247, 0.3)';
                  });
                  handle.addEventListener('mouseleave', () => {
                    handle.style.background = 'transparent';
                  });
                  
                  // Column resize 드래그
                  handle.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const startX = e.clientX;
                    const startWidth = rect.width;
                    const columnIndex = parseInt(handle.dataset.columnIndex);
                    
                    const onMouseMove = (e) => {
                      const deltaX = e.clientX - startX;
                      const newWidth = Math.max(30, startWidth + deltaX);
                      
                      // 해당 column의 모든 셀 width 조정
                      rows.forEach(row => {
                        const targetCell = row.querySelectorAll('td, th')[columnIndex];
                        if (targetCell) {
                          targetCell.style.width = newWidth + 'px';
                        }
                      });
                      
                      e.preventDefault();
                    };
                    
                    const onMouseUp = () => {
                      document.removeEventListener('mousemove', onMouseMove);
                      document.removeEventListener('mouseup', onMouseUp);
                      console.log('✓ Column resize completed');
                      if (editor.undo) {
                        editor.undo.saveStep();
                      }
                    };
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                  });
                  
                  document.body.appendChild(handle);
                }
              });
            }
            
            // Mouseout: outline 및 handles 제거
            let hideTimeout;
            
            const hideTableUI = () => {
              if (currentHoveredTable) {
                currentHoveredTable.classList.remove('fr-table-selection-hover');
                console.log('✓ Outline removed from table');
              }
              
              const handles = document.querySelectorAll('.fr-resize-handle');
              handles.forEach(h => h.remove());
              
              if (componentContext._resizeHandlesCleanup) {
                componentContext._resizeHandlesCleanup();
                componentContext._resizeHandlesCleanup = null;
              }
              
              currentHoveredTable = null;
              componentContext._currentTable = null;
            };
            
            editorElement.addEventListener('mouseleave', function(e) {
              clearTimeout(hideTimeout);
              hideTimeout = setTimeout(hideTableUI, 300);
            });
            
            // Handles 위에서는 숨김 취소
            document.addEventListener('mouseover', function(e) {
              if (e.target.classList.contains('fr-resize-handle')) {
                clearTimeout(hideTimeout);
              }
            });
            
            // Handles에서 나가면 숨김
            document.addEventListener('mouseout', function(e) {
              if (e.target.classList.contains('fr-resize-handle')) {
                const relatedTarget = e.relatedTarget;
                const table = componentContext._currentTable;
                
                if (!relatedTarget || 
                    (!e.target.contains(relatedTarget) && 
                     (!table || !table.contains(relatedTarget)))) {
                  clearTimeout(hideTimeout);
                  hideTimeout = setTimeout(hideTableUI, 200);
                }
              }
            });
            
            // 셀 클릭 시 edit popup 표시
            editorElement.addEventListener('click', function(e) {
              // Resize handle 클릭은 무시
              if (e.target.classList.contains('fr-resize-handle')) {
                return;
              }
              
              const cell = e.target.closest('td, th');
              const table = e.target.closest('table');
              
              if (cell && table && editor.table && editor.table.showEditPopup) {
                console.log('Cell clicked, showing edit popup');
                
                try {
                  // 기존 선택 제거
                  const prevSelected = editorElement.querySelectorAll('.fr-selected-cell');
                  prevSelected.forEach(c => c.classList.remove('fr-selected-cell'));
                  
                  // 셀을 선택 상태로 만들기
                  cell.classList.add('fr-selected-cell');
                  
                  // Froala가 인식할 수 있도록 DOM selection 설정
                  const range = document.createRange();
                  const selection = window.getSelection();
                  range.selectNodeContents(cell);
                  selection.removeAllRanges();
                  selection.addRange(range);
                  
                  // Focus 이벤트 트리거
                  if (editor.events && editor.events.focus) {
                    editor.events.focus(true);
                  }
                  
                  // Edit popup 표시 (Froala native API)
                  setTimeout(() => {
                    try {
                      editor.table.showEditPopup();
                      console.log('✓ Called showEditPopup()');
                      
                      // Popup 위치 조정
                      setTimeout(() => {
                        const popup = document.querySelector('.fr-popup.fr-active');
                        if (popup) {
                          const rect = cell.getBoundingClientRect();
                          popup.style.position = 'fixed';
                          popup.style.top = (rect.bottom + 5) + 'px';
                          popup.style.left = (rect.left + rect.width / 2) + 'px';
                          popup.style.transform = 'translateX(-50%)';
                          popup.style.zIndex = '2147483647';
                          console.log('✓ Edit popup positioned');
                        }
                      }, 100);
                    } catch (err) {
                      console.error('showEditPopup error:', err.message);
                    }
                  }, 100);
                } catch (err) {
                  console.error('Cell click error:', err.message);
                }
              }
            });
          }
          
          // 동적으로 생성된 테이블 감지
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'TABLE' || node.querySelector?.('table')) {
                  console.log('New table detected in shadow root');
                }
              });
            });
          });
          
          observer.observe(editorElement, { childList: true, subtree: true });
        }.bind(this);
        
        // Froala가 생성한 resizer를 찾아서 shadow root 밖으로 이동
        const checkAndMoveResizer = function(table) {
          // Document에서 Froala가 생성한 resizer 찾기
          const froalaResizer = document.querySelector('.fr-table-resizer');
          
          if (froalaResizer && froalaResizer.style.display !== 'none') {
            console.log('✓ Froala resizer detected, repositioning...');
            
            // 기존 참조 저장
            if (this._resizerElement !== froalaResizer) {
              this._resizerElement = froalaResizer;
              
              // Resizer의 위치를 shadow root 테이블에 맞게 조정
              const updateResizerPosition = () => {
                if (this._currentTable) {
                  const rect = this._currentTable.getBoundingClientRect();
                  froalaResizer.style.top = rect.top + 'px';
                  froalaResizer.style.left = rect.left + 'px';
                  froalaResizer.style.width = rect.width + 'px';
                  froalaResizer.style.height = rect.height + 'px';
                }
              };
              
              updateResizerPosition();
              
              // 위치 업데이트 이벤트 등록
              if (!froalaResizer._positionUpdater) {
                froalaResizer._positionUpdater = updateResizerPosition;
                window.addEventListener('scroll', updateResizerPosition);
                window.addEventListener('resize', updateResizerPosition);
              }
            }
            
            this._currentTable = table;
          }
        }.bind(this);
        
        // 에디터 인스턴스를 전역으로 저장 (디버깅용)
        window.shadowEditor = this._editor;
        console.log('Editor initialized with event bridging!');
      };
      
      setTimeout(initEditor.bind(this), 100);
    }
  }
  
  customElements.define('froala-shadow-example', FroalaShadowExample);
