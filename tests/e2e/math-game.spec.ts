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

const verifyGameRecordSaved = async (page: Page, gameType: 'addition' | 'subtraction', totalProblems: number) => {
  // メニューに戻る
  await page.click('[data-testid="back-to-menu-button"]');
  await expect(page.locator('[data-testid="main-menu"]')).toBeVisible();
  
  // 記録ページに移動
  await page.click('[data-testid="records-button"]');
  await expect(page).toHaveURL('/scores');
  
  // 統計情報セクションが表示されていることを確認
  await expect(page.locator('[data-testid="statistics-section"]')).toBeVisible();
  await expect(page.locator('text=過去の記録')).toBeVisible();
  
  // 最新の記録が表示されていることを確認
  const gameTypeText = gameType === 'addition' ? '足し算' : '引き算';
  await expect(page.locator(`text=${gameTypeText}`).first()).toBeVisible();
  
  // 統計情報の詳細が表示されていることを確認
  await expect(page.locator('[data-testid="statistics-section"]').locator('text=平均正解率')).toBeVisible();
  await expect(page.locator('[data-testid="statistics-section"]').locator('text=最高正解率')).toBeVisible();
  
  // 少なくとも1つの記録が存在することを確認
  await expect(page.locator('[data-testid="game-record"]')).toHaveCount(1);
};

test.describe('算数ゲーム E2E テスト', () => {
  // 全体のテストタイムアウトを設定
  test.setTimeout(120000); // 2分

  test('記録ページにアクセスできる', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="records-button"]');
    await expect(page).toHaveURL('/scores');
  });

  test('複数回ゲーム完了後の記録が正しく保存される', async ({ page }) => {
    // このテストは特に時間がかかるため、より長いタイムアウトを設定
    test.setTimeout(180000); // 3分
    
    // 1回目: 足し算ゲーム
    await startMathGame(page, 'addition');
    let totalProblems = await playAllProblems(page);
    await verifyGameCompletion(page, totalProblems);
    await page.click('[data-testid="back-to-menu-button"]');
    
    // 2回目: 引き算ゲーム
    await startMathGame(page, 'subtraction');
    totalProblems = await playAllProblems(page);
    await verifyGameCompletion(page, totalProblems);
    await page.click('[data-testid="back-to-menu-button"]');
    
    // 記録ページで複数の記録が確認できることをテスト
    await page.click('[data-testid="records-button"]');
    await expect(page).toHaveURL('/scores');
    
    // 統計情報で総ゲーム数が2回になっていることを確認
    await expect(page.locator('[data-testid="total-games"]')).toContainText('2回');
    
    // 両方のゲームタイプの記録があることを確認（記録一覧から）
    await expect(page.locator('[data-testid="game-record"]')).toHaveCount(2);
    await expect(page.locator('text=足し算').first()).toBeVisible();
    await expect(page.locator('text=引き算').first()).toBeVisible();
  });

  test('記録が空の場合の表示を確認', async ({ page }) => {
    // localStorageをクリアして空の状態にする
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('mathPracticeGameRecords');
    });
    
    // 記録ページにアクセス
    await page.click('[data-testid="records-button"]');
    await expect(page).toHaveURL('/scores');
    
    // 空の状態のメッセージが表示されることを確認
    await expect(page.locator('text=まだ記録がありません')).toBeVisible();
    await expect(page.locator('text=ゲームを完了すると記録が保存されます')).toBeVisible();
  });

  test('足し算ゲームを最後まで完了できる', async ({ page }) => {
    await startMathGame(page, 'addition');
    const totalProblems = await playAllProblems(page);
    await verifyGameCompletion(page, totalProblems);
    await verifyGameRecordSaved(page, 'addition', totalProblems);
  });

  test('引き算ゲームを最後まで完了できる', async ({ page }) => {
    await startMathGame(page, 'subtraction');
    const totalProblems = await playAllProblems(page);
    await verifyGameCompletion(page, totalProblems);
    await verifyGameRecordSaved(page, 'subtraction', totalProblems);
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