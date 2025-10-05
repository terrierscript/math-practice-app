import { Box, Group, Stack } from "@mantine/core"

interface MultiplicationPreviewProps {
  num1: number
  num2: number
}

export function MultiplicationPreview({ num1, num2 }: MultiplicationPreviewProps) {
  // num2の回数分の行を作成
  const rows = Array.from({ length: num2 }, (_, rowIndex) => (
    <Group key={rowIndex} gap="xs" justify="center">
      {/* num1の回数分の●を作成 */}
      {Array.from({ length: num1 }, (_, colIndex) => (
        <Box
          key={colIndex}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#228be6',
            display: 'inline-block'
          }}
        />
      ))}
    </Group>
  ))

  return (
    <Box
      p="md"
      style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginTop: '1rem'
      }}
    >
      <Stack gap="xs" align="center">
        {rows}
      </Stack>
    </Box>
  )
}