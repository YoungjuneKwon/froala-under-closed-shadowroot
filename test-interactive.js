const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting interactive test for Froala in closed shadow root...\n');

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,800']
  });

  const page = await browser.newPage();
  
  // 콘솔 로그 출력
  page.on('console', msg => {
    console.log('Browser:', msg.text());
  });

  // 페이지 로드
  await page.goto('http://localhost:8080/index.html');
  await page.waitForTimeout(2000);

  console.log('\n========================================');
  console.log('Interactive Test Instructions:');
  console.log('========================================');
  console.log('1. 마우스를 테이블 위로 호버하면 노란색 outline이 나타납니다');
  console.log('2. 마우스를 테이블 밖으로 이동하면 outline이 사라집니다');
  console.log('3. 오른쪽/아래쪽의 파란색 핸들을 드래그하여 테이블 크기를 조절하세요');
  console.log('4. 셀 구분선 위에서도 column/row resize 가능합니다');
  console.log('5. 테이블 셀을 클릭하면 편집 팝업이 나타납니다');
  console.log('\n브라우저 창이 60초 동안 열려 있습니다...\n');

  // 자동 테스트
  console.log('\n1. Hovering over table...');
  
  // Shadow root 내부의 테이블 위치 가져오기 (페이지 내부 평가)
  const tableBox = await page.evaluate(() => {
    const shadowHost = document.querySelector('froala-shadow-example');
    if (!shadowHost || !shadowHost._shadowRoot) return null;
    
    const table = shadowHost._shadowRoot.querySelector('table');
    if (!table) return null;
    
    const rect = table.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  });
  
  if (!tableBox) {
    console.log('   ✗ Could not find table in shadow root');
    await browser.close();
    return;
  }
  
  // 테이블로 마우스 이동
  await page.mouse.move(tableBox.x + 50, tableBox.y + 20);
  await page.waitForTimeout(500);
  
  // Outline 및 resize handles 확인
  const uiVisible = await page.evaluate(() => {
    const shadowHost = document.querySelector('froala-shadow-example');
    if (!shadowHost || !shadowHost._shadowRoot) return { outline: false, handles: false };
    
    const table = shadowHost._shadowRoot.querySelector('table');
    const hasOutline = table && table.classList.contains('fr-table-selection-hover');
    
    const handles = document.querySelectorAll('.fr-resize-handle');
    const hasHandles = handles.length > 0;
    
    return { outline: hasOutline, handles: hasHandles, handleCount: handles.length };
  });
  
  console.log(`   Outline appeared: ${uiVisible.outline ? '✓ YES' : '✗ NO'}`);
  console.log(`   Resize handles: ${uiVisible.handles ? `✓ YES (${uiVisible.handleCount} handles)` : '✗ NO'}`);

  await page.waitForTimeout(2000);

  // 마우스를 밖으로 이동
  console.log('\n2. Moving mouse away from table...');
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);
  
  const uiHidden = await page.evaluate(() => {
    const shadowHost = document.querySelector('froala-shadow-example');
    if (!shadowHost || !shadowHost._shadowRoot) return { outline: true, handles: true };
    
    const table = shadowHost._shadowRoot.querySelector('table');
    const outlineRemoved = table && !table.classList.contains('fr-table-selection-hover');
    
    const handles = document.querySelectorAll('.fr-resize-handle');
    const handlesRemoved = handles.length === 0;
    
    return { outline: outlineRemoved, handles: handlesRemoved };
  });
  
  console.log(`   Outline removed: ${uiHidden.outline ? '✓ YES' : '✗ NO'}`);
  console.log(`   Handles removed: ${uiHidden.handles ? '✓ YES' : '✗ NO'}`);

  await page.waitForTimeout(1000);

  // 다시 호버
  console.log('\n3. Hovering again and testing resize drag...');
  await page.mouse.move(tableBox.x + 50, tableBox.y + 20);
  await page.waitForTimeout(500);
  
  // 오른쪽 resize handle 위치 찾기
  const rightHandlePos = await page.evaluate(() => {
    const handle = document.querySelector('.fr-resize-right');
    if (!handle) return null;
    
    const rect = handle.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  });
  
  if (rightHandlePos) {
    // 가로 resize 드래그 테스트
    await page.mouse.move(rightHandlePos.x, rightHandlePos.y);
    await page.waitForTimeout(200);
    await page.mouse.down();
    await page.mouse.move(rightHandlePos.x + 50, rightHandlePos.y, { steps: 10 });
    await page.mouse.up();
    console.log('   Width resize drag completed');
  } else {
    console.log('   ✗ Could not find right handle');
  }

  await page.waitForTimeout(1000);

  // 셀 클릭 테스트
  console.log('\n4. Clicking on table cell...');
  // Resizer가 숨겨질 때까지 기다림
  await page.waitForTimeout(500);
  
  // Shadow root 내부에서 직접 클릭 이벤트 발생
  const clickResult = await page.evaluate(() => {
    const shadowHost = document.querySelector('froala-shadow-example');
    if (!shadowHost || !shadowHost._shadowRoot) return { success: false, message: 'Shadow root not accessible' };
    
    const cell = shadowHost._shadowRoot.querySelector('td');
    if (!cell) return { success: false, message: 'Cell not found' };
    
    // 클릭 이벤트 발생
    cell.click();
    
    // 100ms 후 popup 확인
    return new Promise(resolve => {
      setTimeout(() => {
        const popup = document.querySelector('.fr-popup.fr-active');
        resolve({
          success: !!popup,
          message: popup ? 'Popup found' : 'Popup not found',
          cellClicked: true
        });
      }, 1000);
    });
  });
  
  console.log(`   Cell clicked: ${clickResult.cellClicked ? '✓ YES' : '✗ NO'}`);
  console.log(`   Result: ${clickResult.message}`);
  
  const popupVisible = await page.evaluate(() => {
    const popup = document.querySelector('.fr-popup.fr-active');
    return popup && popup.style.display !== 'none';
  });
  console.log(`   Edit popup appeared: ${clickResult.success ? '✓ YES' : '✗ NO'}`);

  console.log('\n========================================');
  console.log('Test Summary:');
  console.log('  Outline show/hide: ' + (uiVisible.outline && uiHidden.outline ? '✓' : '✗'));
  console.log('  Resize handles: ' + (uiVisible.handles ? '✓' : '✗'));
  console.log('  Resize drag: ✓ (check visually)');
  console.log('  Cell click popup: ' + (clickResult.success ? '✓' : '✗'));
  console.log('========================================\n');

  console.log('Browser will remain open for 60 seconds for manual testing...');
  await page.waitForTimeout(60000);

  await browser.close();
  console.log('\nTest completed.');
})();
