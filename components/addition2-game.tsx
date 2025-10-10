import { MathGame } from "./math-game"
import { generateAddition2Problems } from "../utils/problems"
import { type GameState } from "../utils/storage"

interface Addition2GameProps {
  onComplete: () => void
  initialState?: GameState
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function Addition2Game({ onComplete, initialState, onStateChange }: Addition2GameProps) {
  // operatorフィールドが存在しない場合は新しい問題を生成
  const hasValidProblems = initialState?.problems?.every(p => 'operator' in p)
  const problems = hasValidProblems && initialState ? initialState.problems : generateAddition2Problems()

  return (
    <MathGame
      mode="addition2"
      numbers={[10, 11, 12, 13, 14, 15, 16, 17, 18, 19]}
      baseColor="orange"
      selectedCorrectColor="blue"
      selectedWrongColor="red"
      buttonColor="blue"
      initialState={initialState}
      problems={problems}
      onComplete={onComplete}
      onStateChange={onStateChange}
      useTwoDigitInput={true}
    />
  )
}