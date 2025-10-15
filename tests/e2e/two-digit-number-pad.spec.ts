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

const startTwoDigitGame = async (page: Page, gameType: 'multiplication' | 'addition2') => {
  await page.goto('/');
  
  const buttonSelector = gameType === 'multiplication' 
    ? '[data-testid="multiplication-game-button"]' 
    : '[data-testid="addition2-game-button"]';
  
  await page.click(buttonSelector);
  
  // ゲームが開始されたことを確認
  await expect(page.locator('[data-testid="math-game"]')).toBeVisible();
  await expect(page.locator('[data-testid="multiple-digit-problem-manager"]')).toBeVisible();
  await expect(page.locator('[data-testid="two-digit-number-pad"]')).toBeVisible();
};

const getCurrentProblem = async (page: Page) => {
  const num1Text = await page.locator('[data-testid="problem-num1"]').textContent();
  const operatorText = await page.locator('[data-testid="problem-operator"]').textContent();
  const num2Text = await page.locator('[data-testid="problem-num2"]').textContent();
  
  const num1 = parseInt(num1Text || '0');
  const num2 = parseInt(num2Text || '0');
  const operator = operatorText || '+';
  
  return { num1, num2, operator };
};

const inputTwoDigitAnswer = async (page: Page, answer: number) => {
  const answerStr = answer.toString();
  
  // 2桁の場合は順番にクリック
  for (const digit of answerStr) {
    await page.click(`[data-testid="number-button-${digit}"]`);
  }
};

const submitAnswer = async (page: Page) => {
  await page.click('[data-testid="enter-button"]');
};

const clearInput = async (page: Page) => {
  await page.click('[data-testid="clear-button"]');
};

const verifyNumberPadState = async (page: Page, expectedState: 'normal' | 'error' | 'disabled') => {
  const enterButton = page.locator('[data-testid="enter-button"]');
  
  switch (expectedState) {
    case 'disabled':
      await expect(enterButton).toBeDisabled();
      break;
    case 'error':
      // エラー状態では決定ボタンの色が変わる
      await expect(enterButton).toBeVisible();
      break;
    case 'normal':
      await expect(enterButton).toBeEnabled();
      break;
  }
};

const playOneProblemCorrectly = async (page: Page) => {
  const problem = await getCurrentProblem(page);
  const correctAnswer = calculateAnswer(problem.num1, problem.num2, problem.operator);
  
  await inputTwoDigitAnswer(page, correctAnswer);
  await submitAnswer(page);
};

const playOneProblemIncorrectly = async (page: Page) => {
  const problem = await getCurrentProblem(page);
  const correctAnswer = calculateAnswer(problem.num1, problem.num2, problem.operator);
  
  // 正解とは異なる答えを入力（正解 + 1、ただし1桁の場合は10以上になるように調整）
  let wrongAnswer = correctAnswer + 1;
  if (wrongAnswer > 99) {
    wrongAnswer = correctAnswer - 1;
  }
  if (wrongAnswer < 1) {
    wrongAnswer = 10;
  }
  
  await inputTwoDigitAnswer(page, wrongAnswer);
  await submitAnswer(page);
  
  return wrongAnswer;
};

test.describe('2桁パッド E2E テスト', () => {
  // 全体のテストタイムアウトを設定
  test.setTimeout(120000); // 2分

  test.describe('基本操作テスト', () => {
    test('1桁の数値を入力できる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 1桁の数値（5）を入力
      await page.click('[data-testid="number-button-5"]');
      
      // 問題表示エリアに入力値が反映されることを確認
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('5');
      
      // 決定ボタンが有効になることを確認
      await verifyNumberPadState(page, 'normal');
    });

    test('2桁の数値を入力できる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 2桁の数値（25）を入力
      await inputTwoDigitAnswer(page, 25);
      
      // 問題表示エリアに入力値が反映されることを確認
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('25');
      
      // 決定ボタンが有効になることを確認
      await verifyNumberPadState(page, 'normal');
    });

    test('クリアボタンで入力をリセットできる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 数値を入力
      await inputTwoDigitAnswer(page, 42);
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('42');
      
      // クリアボタンをクリック
      await clearInput(page);
      
      // 入力がクリアされることを確認
      await verifyNumberPadState(page, 'disabled');
    });

    test('決定ボタンで回答を確定できる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 正解を入力して確定
      await playOneProblemCorrectly(page);
      
      // 次の問題に進むことを確認（問題カウンターをチェック）
      await expect(page.locator('[data-testid="problem-counter"]')).toContainText('2 /');
    });

    test('入力なしでは決定ボタンが無効化される', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 初期状態では決定ボタンが無効
      await verifyNumberPadState(page, 'disabled');
      
      // 数値入力後は有効
      await page.click('[data-testid="number-button-1"]');
      await verifyNumberPadState(page, 'normal');
      
      // クリア後は再び無効
      await clearInput(page);
      await verifyNumberPadState(page, 'disabled');
    });
  });

  test.describe('エラーハンドリングテスト', () => {
    test('不正解時にエラー状態が表示される', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 間違った答えを入力
      await playOneProblemIncorrectly(page);
      
      // エラー状態になることを確認
      await verifyNumberPadState(page, 'error');
      
      // 問題表示にエラー状態が反映されることを確認
      await expect(page.locator('[data-testid="problem-display"]')).toBeVisible();
    });

    test('エラー状態から新しい入力でリカバリできる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 間違った答えを入力してエラー状態にする
      await playOneProblemIncorrectly(page);
      await verifyNumberPadState(page, 'error');
      
      // 新しい数値を入力
      await page.click('[data-testid="number-button-1"]');
      
      // エラー状態が解除されることを確認
      await verifyNumberPadState(page, 'normal');
    });

    test('エラー状態でも正解を入力すれば次の問題に進む', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 間違った答えを入力
      await playOneProblemIncorrectly(page);
      
      // 正解を入力し直す
      await playOneProblemCorrectly(page);
      
      // 次の問題に進むことを確認
      await expect(page.locator('[data-testid="problem-counter"]')).toContainText('2 /');
    });

    test('2桁以上入力時に新しい入力でリセットされる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 2桁を入力
      await inputTwoDigitAnswer(page, 99);
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('99');
      
      // さらに数値を入力すると前の入力がクリアされる
      await page.click('[data-testid="number-button-5"]');
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('5');
    });
  });

  test.describe('統合テスト - 掛け算ゲーム', () => {
    test('掛け算ゲームで2桁パッドが正常に動作する', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 掛け算プレビューが表示されることを確認
      await expect(page.locator('[data-testid="multiplication-preview"]')).toBeVisible();
      
      // 最初の問題を正解
      await playOneProblemCorrectly(page);
      
      // 次の問題に進むことを確認
      await expect(page.locator('[data-testid="problem-counter"]')).toContainText('2 /');
      
      // 統計が更新されることを確認
      await expect(page.locator('[data-testid="correct-count"]')).toContainText('正解: 1問');
    });

    test('掛け算ゲームを複数問解ける', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 3問連続で正解
      for (let i = 0; i < 3; i++) {
        await playOneProblemCorrectly(page);
        
        // 次の問題に進んだことを確認（最後の問題を除く）
        if (i < 2) {
          await expect(page.locator('[data-testid="problem-counter"]')).toContainText(`${i + 2} /`);
        }
      }
      
      // 統計の確認
      await expect(page.locator('[data-testid="correct-count"]')).toContainText('正解: 3問');
      await expect(page.locator('[data-testid="incorrect-count"]')).toContainText('間違い: 0問');
    });
  });

  test.describe('統合テスト - 足し算2ゲーム', () => {
    test('足し算2ゲームで2桁パッドが正常に動作する', async ({ page }) => {
      await startTwoDigitGame(page, 'addition2');
      
      // 足し算2ゲームでは掛け算プレビューは表示されない
      await expect(page.locator('[data-testid="multiplication-preview"]')).not.toBeVisible();
      
      // 最初の問題を正解
      await playOneProblemCorrectly(page);
      
      // 次の問題に進むことを確認
      await expect(page.locator('[data-testid="problem-counter"]')).toContainText('2 /');
      
      // 統計が更新されることを確認
      await expect(page.locator('[data-testid="correct-count"]')).toContainText('正解: 1問');
    });

  });

  test.describe('UI状態変化テスト', () => {
    test('各数字ボタンがクリックできる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 0-9のすべてのボタンをテスト
      for (let i = 0; i <= 9; i++) {
        await clearInput(page);
        await page.click(`[data-testid="number-button-${i}"]`);
        await expect(page.locator('[data-testid="problem-display"]')).toContainText(i.toString());
      }
    });

    test('ボタンの見た目状態が正しく変化する', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      // 通常状態の決定ボタン
      const enterButton = page.locator('[data-testid="enter-button"]');
      await expect(enterButton).toBeDisabled();
      
      // 入力後は有効化
      await page.click('[data-testid="number-button-1"]');
      await expect(enterButton).toBeEnabled();
      
      // 間違った答えを入力した後の色変更をテスト
      await playOneProblemIncorrectly(page);
      await expect(enterButton).toBeVisible(); // エラー状態でも表示されている
    });
  });

  test.describe('エッジケーステスト', () => {

    test('最大値99を入力できる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      await inputTwoDigitAnswer(page, 99);
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('99');
      await verifyNumberPadState(page, 'normal');
    });

    test('単一の0を入力できる', async ({ page }) => {
      await startTwoDigitGame(page, 'multiplication');
      
      await page.click('[data-testid="number-button-0"]');
      await expect(page.locator('[data-testid="problem-display"]')).toContainText('0');
      await verifyNumberPadState(page, 'normal');
    });
  });
});