import { MathGame } from "./math-game"

export function AdditionGame({ onComplete }: { onComplete?: () => void }) {
  return (
    <MathGame
      mode="addition"
      operator="+"
      numbers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      baseColor="orange"
      selectedCorrectColor="blue"
      selectedWrongColor="red"
      buttonColor="blue"
      onComplete={onComplete}
    />
  )
}
