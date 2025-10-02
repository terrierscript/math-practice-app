import { test, expect, Page } from '@playwright/test';

// 共通のヘルパー関数
const calculateAnswer = (num1: number, num2: number, operator: string): number => {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '×':
      return num1 * num2;
    case '÷':
      return num1 / num2;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
};

const startMathGame = async (page: Page, gameType: 'addition' | 'subtraction') => {
  await page.goto('/');
  
  const buttonSelector = gameType === 'addition' 
    ? '[data-testid="addition-game-button"]' 
    : '[data-testid="subtraction-game-button"]';
  
  await page.click(buttonSelector);
  
  // ゲームが開始されたことを確認
  await expect(page.locator('[data-testid="math-game"]')).toBeVisible();
  await expect(page.locator('[data-testid="problem-display"]')).toBeVisible();
  await expect(page.locator('[data-testid="number-pad"]')).toBeVisible();
};

const playAllProblems = async (page: Page) => {
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
    const correctAnswer = calculateAnswer(num1, num2, operatorText || '+');
    
    // 正しい答えをクリック
    await page.click(`[data-testid="number-button-${correctAnswer}"]`);
    // 同じボタンをもう一度クリックして正解を確定
    await page.click(`[data-testid="number-button-${correctAnswer}"]`);
    
    // 最後の問題でなければ次の問題に移ることを確認
    if (i < totalProblems - 1) {
      await expect(page.locator('[data-testid="problem-counter"]')).toContainText(`${i + 2} / ${totalProblems}`);
    }
  }
  
  return totalProblems;
};

const verifyGameCompletion = async (page: Page, totalProblems: number) => {
  // ゲーム完了画面が表示されることを確認
  await expect(page.locator('[data-testid="game-completion"]')).toBeVisible();
  await expect(page.locator('[data-testid="completion-title"]')).toContainText('おつかれさまでした！');
  
  // 結果が表示されることを確認
  await expect(page.locator('[data-testid="total-problems"]')).toContainText(`${totalProblems}問`);
  await expect(page.locator('[data-testid="correct-problems"]')).toBeVisible();
  await expect(page.locator('[data-testid="incorrect-problems"]')).toBeVisible();
  await expect(page.locator('[data-testid="correct-rate"]')).toBeVisible();
  await expect(page.locator('[data-testid="elapsed-time"]')).toBeVisible();
};

test.describe('算数ゲーム E2E テスト', () => {
  test('記録ページにアクセスできる', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="records-button"]');
    await expect(page).toHaveURL('/scores');
  });

  test('足し算ゲームを最後まで完了できる', async ({ page }) => {
    await startMathGame(page, 'addition');
    const totalProblems = await playAllProblems(page);
    await verifyGameCompletion(page, totalProblems);
  });

  test('引き算ゲームを最後まで完了できる', async ({ page }) => {
    await startMathGame(page, 'subtraction');
    const totalProblems = await playAllProblems(page);
    await verifyGameCompletion(page, totalProblems);
  });
  
  test.describe('足し算ゲーム', () => {
    test('ゲーム進行状況が正しく表示される', async ({ page }) => {
      await startMathGame(page, 'addition');
      
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

  test.describe('引き算ゲーム', () => {
    test('ゲーム進行状況が正しく表示される', async ({ page }) => {
      await startMathGame(page, 'subtraction');
      
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
});