import { Button, Grid } from "@mantine/core"

interface NumberPadProps {
  numbers: number[]
  selectedAnswer: number | null
  isWrong: boolean
  onNumberClick: (num: number) => void
  baseColor?: string
  selectedCorrectColor?: string
  selectedWrongColor?: string
}

export function NumberPad({
  numbers,
  selectedAnswer,
  isWrong,
  onNumberClick,
  baseColor = "orange",
  selectedCorrectColor = "blue",
  selectedWrongColor = "red"
}: NumberPadProps) {
  return (
    <Grid gutter="md">
      {numbers.map((num) => (
        <Grid.Col span={{ base: 6, xs: 4, sm: 2.4 }} key={num}>
          <Button
            onClick={() => onNumberClick(num)}
            size="lg"
            fullWidth
            variant="filled"
            radius="xl"
            color={
              selectedAnswer === num
                ? isWrong
                  ? selectedWrongColor
                  : selectedCorrectColor
                : baseColor
            }
            style={{
              height: '4rem',
              fontSize: '2rem',
              fontWeight: 'bold',
              transform: selectedAnswer === num ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s'
            }}
          >
            {num}
          </Button>
        </Grid.Col>
      ))}
    </Grid>
  )
}