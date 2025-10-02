import { MathGame } from "./math-game"
import { generateSubtractionProblems } from "../utils/problems"
import { type GameState } from "../utils/storage"

interface SubtractionGameProps {
  onComplete: () => void
  initialState?: GameState
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function SubtractionGame({ onComplete, initialState, onStateChange }: SubtractionGameProps) {
  // operatorフィールドが存在しない場合は新しい問題を生成
  const hasValidProblems = initialState?.problems?.every(p => 'operator' in p)
  const problems = hasValidProblems && initialState ? initialState.problems : generateSubtractionProblems()

  return (
    <MathGame
      mode="subtraction"
      numbers={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      baseColor="blue"
      selectedCorrectColor="blue"
      selectedWrongColor="red"
      buttonColor="orange"
      initialState={initialState}
      problems={problems}
      onComplete={onComplete}
      onStateChange={onStateChange}
    />
  )
}
