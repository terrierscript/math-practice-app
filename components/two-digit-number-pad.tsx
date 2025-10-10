import { Button, Grid } from "@mantine/core"
import { useState } from "react"

interface TwoDigitNumberPadProps {
  selectedAnswer: number | null
  isWrong: boolean
  onNumberClick?: (num: number) => void
  onSubmit?: () => void
  onInputChange?: (num: number | null) => void
  baseColor?: string
  selectedCorrectColor?: string
  selectedWrongColor?: string
}

export function TwoDigitNumberPad({
  selectedAnswer,
  isWrong,
  onNumberClick,
  onSubmit,
  onInputChange,
  baseColor = "orange",
  selectedCorrectColor = "blue",
  selectedWrongColor = "red"
}: TwoDigitNumberPadProps) {
  const [currentInput, setCurrentInput] = useState("")
  const [pendingNumber, setPendingNumber] = useState<number | null>(null)

  const handleNumberClick = (num: number) => {
    const newInput = currentInput + num.toString()
    setCurrentInput(newInput)
    const newPending = parseInt(newInput)
    setPendingNumber(newPending)
    onInputChange?.(newPending)
  }

  const handleEnter = () => {
    if (pendingNumber !== null) {
      if (onSubmit) {
        onSubmit()
      } else if (onNumberClick) {
        onNumberClick(pendingNumber)
      }
      // エンター後は入力をクリアしない（既存のNumberPadと同じ動作）
    }
  }

  const handleClear = () => {
    setCurrentInput("")
    setPendingNumber(null)
    onInputChange?.(null)
  }

  return (
    <div>


      <Grid gutter="md" data-testid="two-digit-number-pad">
        {/* 数字パッド */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Grid.Col span={4} key={num}>
            <Button
              onClick={() => handleNumberClick(num)}
              size="lg"
              fullWidth
              variant="filled"
              radius="xl"
              color={baseColor}
              disabled={currentInput.length >= 2}
              style={{
                height: '4rem',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
              data-testid={`number-button-${num}`}
            >
              {num}
            </Button>
          </Grid.Col>
        ))}
        
        {/* 0、クリア、決定ボタン */}
        <Grid.Col span={4}>
          <Button
            onClick={handleClear}
            size="lg"
            fullWidth
            variant="outline"
            radius="xl"
            color="gray"
            style={{
              height: '4rem',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
            data-testid="clear-button"
          >
            クリア
          </Button>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Button
            onClick={() => handleNumberClick(0)}
            size="lg"
            fullWidth
            variant="filled"
            radius="xl"
            color={baseColor}
            disabled={currentInput.length >= 2}
            style={{
              height: '4rem',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
            data-testid="number-button-0"
          >
            0
          </Button>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <Button
            onClick={handleEnter}
            size="lg"
            fullWidth
            variant="filled"
            radius="xl"
            color={isWrong ? selectedWrongColor : "green"}
            disabled={pendingNumber === null}
            style={{
              height: '4rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            data-testid="enter-button"
          >
            {"="}
          </Button>
        </Grid.Col>
      </Grid>
    </div>
  )
}
