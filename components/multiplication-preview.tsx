import { Box, Group, Stack } from "@mantine/core"

interface MultiplicationPreviewProps {
  num1: number
  num2: number
}

export function MultiplicationPreview({ num1, num2 }: MultiplicationPreviewProps) {
  // 9x9のグリッドを作成し、有効な部分のみ色をつける
  const rows = Array.from({ length: 9 }, (_, rowIndex) => (
    <Group key={rowIndex} gap="xs" justify="center">
      {Array.from({ length: 9 }, (_, colIndex) => {
        // 有効な範囲内かどうかを判定
        const isActive = rowIndex < num2 && colIndex < num1
        return (
          <Box
            key={colIndex}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isActive ? '#228be6' : '#e9ecef',
              display: 'inline-block'
            }}
          />
        )
      })}
    </Group>
  ))

  return (
    <Box
      p="md"
      style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginTop: '1rem',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack gap="xs" align="center">
        {rows}
      </Stack>
    </Box>
  )
}