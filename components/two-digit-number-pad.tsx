import { Button, Grid } from "@mantine/core"
import { useState } from "react"

interface TwoDigitNumberPadProps {
  selectedAnswer: number | null
  isWrong: boolean
  onNumberClick: (num: number) => void
  onInputChange?: (num: number | null) => void
  baseColor?: string
  selectedCorrectColor?: string
  selectedWrongColor?: string
}

export function TwoDigitNumberPad({
  selectedAnswer,
  isWrong,
  onNumberClick,
  baseColor = "orange",
  selectedCorrectColor = "blue",
  selectedWrongColor = "red"
}: TwoDigitNumberPadProps) {
  const [currentInput, setCurrentInput] = useState("")
  const [pendingNumber, setPendingNumber] = useState<number | null>(null)

  const handleNumberClick = (num: number) => {
    const newInput = currentInput + num.toString()
    setCurrentInput(newInput)
    setPendingNumber(parseInt(newInput))
  }

  const handleEnter = () => {
    if (pendingNumber !== null) {
      onNumberClick(pendingNumber)
      // エンター後は入力をクリアしない（既存のNumberPadと同じ動作）
    }
  }

  const handleClear = () => {
    setCurrentInput("")
    setPendingNumber(null)
  }

  return (
    <div>
      {/* 数字入力エリア - 現在の入力を表示 */}
      {currentInput && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          入力中: {currentInput}
        </div>
      )}

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
            color={
              selectedAnswer === pendingNumber
                ? isWrong
                  ? selectedWrongColor
                  : selectedCorrectColor
                : "green"
            }
            disabled={pendingNumber === null}
            style={{
              height: '4rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              transform: selectedAnswer === pendingNumber ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s'
            }}
            data-testid="enter-button"
          >
            決定
          </Button>
        </Grid.Col>
      </Grid>
    </div>
  )
}
