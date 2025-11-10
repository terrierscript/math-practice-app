import { MathGame } from "./math-game"
import { generateSubtraction2Problems } from "../utils/problems"
import { type GameState } from "../utils/storage"

interface Subtraction2GameProps {
  onComplete: () => void
  initialState?: GameState
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function Subtraction2Game({ onComplete, initialState, onStateChange }: Subtraction2GameProps) {
  // operatorフィールドが存在しない場合は新しい問題を生成
  const hasValidProblems = initialState?.problems?.every(p => 'operator' in p)
  const problems = hasValidProblems && initialState ? initialState.problems : generateSubtraction2Problems()

  return (
    <MathGame
      mode="subtraction2"
      numbers={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      baseColor="purple"
      selectedCorrectColor="green"
      selectedWrongColor="red"
      buttonColor="purple"
      initialState={initialState}
      problems={problems}
      onComplete={onComplete}
      onStateChange={onStateChange}
      useTwoDigitInput={false}
    />
  )
}