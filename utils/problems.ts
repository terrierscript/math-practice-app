// 問題の型定義
export type Problem = {
  num1: number
  num2: number
  answer: number
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
        })
      }
    }
  }

  // ランダムにシャッフル
  return allProblems.sort(() => Math.random() - 0.5)
}