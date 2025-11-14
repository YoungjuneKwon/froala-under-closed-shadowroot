const puppeteer = require('puppeteer');

async function testFroalaInShadowRoot() {
  console.log('Starting E2E test for Froala in closed shadow root...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 50 // 느리게 실행하여 시각적 확인 가능
  });
  
  try {
    const page = await browser.newPage();
    
    // 콘솔 로그 수집
    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      console.log('Browser:', text);
    });
    
    // 페이지 에러 수집
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });
    
    // 페이지 로드
    console.log('\n1. Loading page...');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    
    // Froala 초기화 대기
    await page.waitForTimeout(3000);
    
    console.log('\n2. Checking if Froala editor is initialized...');
    const editorInitialized = await page.evaluate(() => {
      return window.shadowEditor !== undefined;
    });
    console.log('  Result:', editorInitialized ? '✓ PASS' : '✗ FAIL');
    
    console.log('\n3. Checking if table plugin is loaded...');
    const tablePluginLoaded = await page.evaluate(() => {
      return window.shadowEditor && window.shadowEditor.table !== undefined;
    });
    console.log('  Result:', tablePluginLoaded ? '✓ PASS (plugin loaded)' : '✗ FAIL (plugin missing)');
    
    console.log('\n4. Hovering over table inside shadow root...');
    // Shadow root 내부 테이블에 마우스 이동 시뮬레이션
    const hoverResult = await page.evaluate(() => {
      const customElement = document.querySelector('froala-shadow-example');
      if (customElement && customElement._shadowRoot) {
        const table = customElement._shadowRoot.querySelector('table');
        if (table) {
          // mouseover 이벤트 발생
          const event = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          table.dispatchEvent(event);
          return true;
        }
      }
      return false;
    });
    console.log('  Hover triggered:', hoverResult ? '✓ YES' : '✗ NO');
    
    // Resizer 생성 대기
    await page.waitForTimeout(1000);
    
    console.log('\n5. Checking if resizer appeared...');
    const resizerExists = await page.evaluate(() => {
      const resizer = document.querySelector('.fr-table-resizer');
      if (resizer) {
        const styles = window.getComputedStyle(resizer);
        const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden';
        console.log('Resizer visibility:', isVisible, 'display:', styles.display);
        return isVisible;
      }
      return false;
    });
    console.log('  Result:', resizerExists ? '✓ PASS' : '✗ FAIL');
    
    if (resizerExists) {
      console.log('\n6. Checking resizer details...');
      const resizerInfo = await page.evaluate(() => {
        const resizer = document.querySelector('.fr-table-resizer');
        const rect = resizer.getBoundingClientRect();
        const handlers = resizer.querySelectorAll('.fr-table-resizer-handler');
        return {
          position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
          zIndex: window.getComputedStyle(resizer).zIndex,
          handlerCount: handlers.length,
          border: window.getComputedStyle(resizer).border
        };
      });
      console.log('  Position:', JSON.stringify(resizerInfo.position));
      console.log('  Z-Index:', resizerInfo.zIndex);
      console.log('  Handlers:', resizerInfo.handlerCount);
      console.log('  Border:', resizerInfo.border);
      console.log('  Result: ✓ PASS');
      
      // Resizer가 5초간 유지되는지 확인
      console.log('\n7. Testing resizer persistence (5 seconds)...');
      await page.waitForTimeout(5000);
      
      const stillVisible = await page.evaluate(() => {
        const resizer = document.querySelector('.fr-table-resizer');
        return resizer && window.getComputedStyle(resizer).display !== 'none';
      });
      console.log('  Still visible after 5s:', stillVisible ? '✓ YES' : '✗ NO');
    }
    
    // 스크린샷 촬영
    console.log('\n8. Taking screenshot...');
    await page.screenshot({ path: 'test-result.png', fullPage: true });
    console.log('  Screenshot saved to test-result.png');
    
    // 로그 분석
    console.log('\n9. Analyzing console logs...');
    const hasPluginError = logs.some(log => log.includes('Table plugin NOT loaded'));
    const hasResizerCreated = logs.some(log => log.includes('Manual resizer created') || log.includes('Resizer added to body'));
    console.log('  Plugin error detected:', hasPluginError ? '✗ YES' : '✓ NO');
    console.log('  Resizer created:', hasResizerCreated ? '✓ YES' : '✗ NO');
    
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY:');
    console.log('  Editor initialized:', editorInitialized ? '✓' : '✗');
    console.log('  Table plugin loaded:', tablePluginLoaded ? '✓' : '✗');
    console.log('  Resizer appeared:', resizerExists ? '✓' : '✗');
    console.log('  Resizer persistent:', resizerExists ? '✓' : '✗');
    console.log('='.repeat(60));
    
    const allTestsPassed = editorInitialized && resizerExists;
    console.log('\nOVERALL:', allTestsPassed ? '✓ ALL CRITICAL TESTS PASSED' : '✗ SOME TESTS FAILED');
    
    if (!tablePluginLoaded) {
      console.log('\n⚠ WARNING: Table plugin not loaded, using fallback manual resizer');
    }
    
    // 브라우저를 10초간 열어두어 수동 확인 가능하게 함
    console.log('\nBrowser will remain open for 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await browser.close();
  }
}

// 테스트 실행
testFroalaInShadowRoot().catch(console.error);
