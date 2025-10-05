import { MathGame } from "./math-game"
import { generateMultiplicationProblems } from "../utils/problems"
import { type GameState } from "../utils/storage"

interface MultiplicationGameProps {
  onComplete: () => void
  initialState?: GameState
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function MultiplicationGame({ onComplete, initialState, onStateChange }: MultiplicationGameProps) {
  // operatorフィールドが存在しない場合は新しい問題を生成
  const hasValidProblems = initialState?.problems?.every(p => 'operator' in p)
  const problems = hasValidProblems && initialState ? initialState.problems : generateMultiplicationProblems()

  return (
    <MathGame
      mode="multiplication"
      numbers={[]} // 掛け算は2桁入力なので配列は空でOK
      baseColor="green"
      selectedCorrectColor="blue"
      selectedWrongColor="red"
      buttonColor="green"
      initialState={initialState}
      problems={problems}
      onComplete={onComplete}
      onStateChange={onStateChange}
    />
  )
}