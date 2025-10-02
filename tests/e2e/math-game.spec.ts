import { test, expect } from '@playwright/test';

test.describe('算数ゲーム E2E テスト', () => {
  test('足し算ゲームを最後まで完了できる', async ({ page }) => {
    // ページに移動
    await page.goto('/');
    
    // 足し算ゲームを選択（仮のセレクタ - 実際のメニューに合わせて調整が必要）
    await page.click('[data-testid="addition-game-button"]');
    
    // ゲームが開始されたことを確認
    await expect(page.locator('[data-testid="math-game"]')).toBeVisible();
    await expect(page.locator('[data-testid="problem-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="number-pad"]')).toBeVisible();
    
    // 問題数をカウント（仮に10問とする）
    const totalProblemsText = await page.locator('[data-testid="problem-counter"]').textContent();
    const totalProblems = parseInt(totalProblemsText?.split(' / ')[1] || '10');
    
    // 各問題を解く
    for (let i = 0; i < totalProblems; i++) {
      // 現在の問題を取得
      const num1Text = await page.locator('[data-testid="problem-num1"]').textContent();
      const operatorText = await page.locator('[data-testid="problem-operator"]').textContent();
      const num2Text = await page.locator('[data-testid="problem-num2"]').textContent();
      
      const num1 = parseInt(num1Text || '0');
      const num2 = parseInt(num2Text || '0');
      
      // 正解を計算
      let correctAnswer: number;
      if (operatorText === '+') {
        correctAnswer = num1 + num2;
      } else if (operatorText === '-') {
        correctAnswer = num1 - num2;
      } else if (operatorText === '×') {
        correctAnswer = num1 * num2;
      } else if (operatorText === '÷') {
        correctAnswer = num1 / num2;
      } else {
        throw new Error(`Unknown operator: ${operatorText}`);
      }
      
      // まず間違った答えをクリック（もし選択肢にあれば）
      const wrongAnswer = correctAnswer + 1;
      const wrongAnswerButton = page.locator(`[data-testid="number-button-${wrongAnswer}"]`);
      if (await wrongAnswerButton.isVisible()) {
        await wrongAnswerButton.click();
        // 同じボタンをもう一度クリックして間違いを確定
        await wrongAnswerButton.click();
        
        // 間違いの表示を確認
        await expect(page.locator('[data-testid="problem-answer"]')).toHaveCSS('color', /rgb\(.*\)/);
      }
      
      // 正しい答えをクリック
      await page.click(`[data-testid="number-button-${correctAnswer}"]`);
      // 同じボタンをもう一度クリックして正解を確定
      await page.click(`[data-testid="number-button-${correctAnswer}"]`);
      
      // 最後の問題でなければ次の問題に移ることを確認
      if (i < totalProblems - 1) {
        await expect(page.locator('[data-testid="problem-counter"]')).toContainText(`${i + 2} / ${totalProblems}`);
      }
    }
    
    // ゲーム完了画面が表示されることを確認
    await expect(page.locator('[data-testid="game-completion"]')).toBeVisible();
    await expect(page.locator('[data-testid="completion-title"]')).toContainText('おつかれさまでした！');
    
    // 結果が表示されることを確認
    await expect(page.locator('[data-testid="total-problems"]')).toContainText(`${totalProblems}問`);
    await expect(page.locator('[data-testid="correct-problems"]')).toBeVisible();
    await expect(page.locator('[data-testid="incorrect-problems"]')).toBeVisible();
    await expect(page.locator('[data-testid="correct-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="elapsed-time"]')).toBeVisible();
  });
  
  test('問題の各要素が正しく表示される', async ({ page }) => {
    await page.goto('/');
    
    // 足し算ゲームを選択（仮のセレクタ）
    await page.click('[data-testid="addition-game-button"]');
    
    // 問題表示の要素を確認
    await expect(page.locator('[data-testid="problem-equation"]')).toBeVisible();
    await expect(page.locator('[data-testid="problem-num1"]')).toBeVisible();
    await expect(page.locator('[data-testid="problem-operator"]')).toBeVisible();
    await expect(page.locator('[data-testid="problem-num2"]')).toBeVisible();
    await expect(page.locator('[data-testid="problem-answer"]')).toBeVisible();
    
    // 初期状態では答えが "?" になっていることを確認
    await expect(page.locator('[data-testid="problem-answer"]')).toContainText('?');
    
    // 数字パッドが表示されることを確認
    await expect(page.locator('[data-testid="number-pad"]')).toBeVisible();
    
    // 数字ボタンが存在することを確認（0-9の数字ボタン）
    for (let i = 0; i <= 9; i++) {
      await expect(page.locator(`[data-testid="number-button-${i}"]`)).toBeVisible();
    }
  });
  
  test('ゲーム進行状況が正しく表示される', async ({ page }) => {
    await page.goto('/');
    
    // 足し算ゲームを選択（仮のセレクタ）
    await page.click('[data-testid="addition-game-button"]');
    
    // ゲームヘッダーの要素を確認
    await expect(page.locator('[data-testid="game-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="game-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="game-stats"]')).toBeVisible();
    
    // 進行状況の表示を確認
    await expect(page.locator('[data-testid="problem-counter"]')).toContainText('1 /');
    await expect(page.locator('[data-testid="elapsed-time"]')).toBeVisible();
    
    // 統計の表示を確認
    await expect(page.locator('[data-testid="correct-count"]')).toContainText('正解: 0問');
    await expect(page.locator('[data-testid="incorrect-count"]')).toContainText('間違い: 0問');
  });
});