import { MathGame } from "./math-game"
import { generateSubtractionProblems } from "../utils/problems"
import { type GameState } from "../utils/storage"

interface SubtractionGameProps {
  onComplete: () => void
  initialState?: GameState
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function SubtractionGame({ onComplete, initialState, onStateChange }: SubtractionGameProps) {
  const problems = initialState?.problems ?? generateSubtractionProblems()

  return (
    <MathGame
      mode="subtraction"
      operator="-"
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
