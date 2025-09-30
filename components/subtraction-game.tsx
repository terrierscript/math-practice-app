import { MathGame } from "./math-game"

export function SubtractionGame({ onComplete }: { onComplete?: () => void }) {
  return (
    <MathGame
      mode="subtraction"
      operator="-"
      numbers={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      baseColor="blue"
      selectedCorrectColor="blue"
      selectedWrongColor="red"
      buttonColor="orange"
      onComplete={onComplete}
    />
  )
}
