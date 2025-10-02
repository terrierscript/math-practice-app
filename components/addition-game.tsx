import { MathGame } from "./math-game"
import { generateAdditionProblems } from "../utils/problems"
import { type GameState } from "../utils/storage"

interface AdditionGameProps {
  onComplete: () => void
  initialState?: GameState
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function AdditionGame({ onComplete, initialState, onStateChange }: AdditionGameProps) {
  // operatorフィールドが存在しない場合は新しい問題を生成
  const hasValidProblems = initialState?.problems?.every(p => 'operator' in p)
  const problems = hasValidProblems && initialState ? initialState.problems : generateAdditionProblems()

  return (
    <MathGame
      mode="addition"
      numbers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      baseColor="orange"
      selectedCorrectColor="blue"
      selectedWrongColor="red"
      buttonColor="blue"
      initialState={initialState}
      problems={problems}
      onComplete={onComplete}
      onStateChange={onStateChange}
    />
  )
}
