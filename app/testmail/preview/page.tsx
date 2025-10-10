import { GameCompletionEmail } from '../../../emails/game-completion'

export default function PreviewPage() {
  // テスト用のサンプルデータ
  const sampleData = {
    gameType: '足し算',
    score: 80,
    correctAnswers: 8,
    totalProblems: 10,
    time: '2分30秒',
    completionDate: '2025年10月10日 14:30'
  }

  return <GameCompletionEmail {...sampleData} />
}