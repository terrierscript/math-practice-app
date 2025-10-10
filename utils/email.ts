import { type ProblemResult, type GameMode, calculateScore } from './storage'
import { formatTime } from './time'

interface SendCompletionEmailData {
  mode: GameMode
  problemResults: ProblemResult[]
  elapsedSeconds: number
  titlePrefix?: string
}

export interface EmailData {
  gameType: string
  score: number
  correctAnswers: number
  totalProblems: number
  time: string
  completionDate: string
  titlePrefix?: string
}

export async function sendCompletionEmail({ 
  mode, 
  problemResults, 
  elapsedSeconds,
  titlePrefix
}: SendCompletionEmailData): Promise<boolean> {
  try {
    const scoreData = calculateScore(problemResults)
    
    // 間違えた問題の詳細を作成
    const incorrectProblems = problemResults
      .filter(result => !result.isCorrect)
      .map(result => ({
        problem: `${result.problem.num1} ${result.problem.operator} ${result.problem.num2}`,
        answer: result.problem.answer.toString()
      }))

    // ゲームモードを日本語に変換
    const getGameTypeName = (mode: GameMode): string => {
      switch (mode) {
        case 'addition': return '足し算'
        case 'subtraction': return '引き算'
        case 'multiplication': return 'かけ算'
        case 'addition2': return '2桁足し算'
        default: return '算数'
      }
    }

    const emailData: EmailData = {
      gameType: getGameTypeName(mode),
      score: scoreData.correctProblems * 10, // 正解数 × 10点
      correctAnswers: scoreData.correctProblems,
      totalProblems: scoreData.totalProblems,
      time: formatTime(elapsedSeconds),
      completionDate: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      titlePrefix
    }

    const response = await fetch('/api/send-completion-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('メール送信APIエラー:', errorData)
      return false
    }

    console.log('完了通知メールを送信しました')
    return true
  } catch (error) {
    console.error('メール送信エラー:', error)
    return false
  }
}