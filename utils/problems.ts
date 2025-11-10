// 問題の型定義
export type Problem = {
  num1: number
  num2: number
  answer: number
  operator: "+" | "-" | "×"
}

// 足し算の問題を生成
export function generateAdditionProblems(): Problem[] {
  const allProblems: Problem[] = []

  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      if (i + j <= 10 && i + j > 0) {
        allProblems.push({
          num1: i,
          num2: j,
          answer: i + j,
          operator: "+",
        })
      }
    }
  }

  // ランダムにシャッフル
  return allProblems.sort(() => Math.random() - 0.5)
}

// 足し算2の問題を生成（答えが11-19）
export function generateAddition2Problems(): Problem[] {
  const allProblems: Problem[] = []

  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      const result = i + j
      if (result >= 11 && result <= 19) {
        allProblems.push({
          num1: i,
          num2: j,
          answer: result,
          operator: "+",
        })
      }
    }
  }

  // ランダムにシャッフル
  return allProblems.sort(() => Math.random() - 0.5)
}

// 引き算の問題を生成
export function generateSubtractionProblems(): Problem[] {
  const allProblems: Problem[] = []

  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= i; j++) {
      const result = i - j
      if (result >= 0 && result <= 9) {
        allProblems.push({
          num1: i,
          num2: j,
          answer: result,
          operator: "-",
        })
      }
    }
  }

  // ランダムにシャッフル
  return allProblems.sort(() => Math.random() - 0.5)
}

// 引き算2の問題を生成（繰り下がりのある引き算：11-19から2-9を引く）
export function generateSubtraction2Problems(): Problem[] {
  const allProblems: Problem[] = []

  // 11-19の範囲から2-9を引く問題
  for (let i = 11; i <= 19; i++) {
    for (let j = 2; j <= 9; j++) {
      const result = i - j
      // 答えが0以上で繰り下がりが発生する問題のみ
      if (result >= 0 && i % 10 < j) {
        allProblems.push({
          num1: i,
          num2: j,
          answer: result,
          operator: "-",
        })
      }
    }
  }

  // ランダムにシャッフル
  return allProblems.sort(() => Math.random() - 0.5)
}

// 掛け算の問題を生成
export function generateMultiplicationProblems(): Problem[] {
  const allProblems: Problem[] = []

  // i <= j の掛け算の組み合わせをすべて作成
  for (let i = 1; i <= 9; i++) {
    for (let j = i; j <= 9; j++) {
      const problem = {
        num1: i,
        num2: j,
        answer: i * j,
        operator: "×" as const,
      }
      
      // ランダムに数値の順序を入れ替え
      if (Math.random() < 0.5) {
        problem.num1 = j
        problem.num2 = i
      }
      
      allProblems.push(problem)
    }
  }

  // ランダムにシャッフル
  return allProblems.sort(() => Math.random() - 0.5)
}