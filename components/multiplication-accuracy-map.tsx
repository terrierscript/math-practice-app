"use client"

import { useEffect, useState } from "react"
import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core"
import { getGameRecordsByMode } from "../utils/storage"

interface CellAccuracy {
  attempts: number
  correct: number
}

const getCellColor = (rate: number | null) => {
  if (rate === null) return "#f1f3f5"
  if (rate >= 80) return "#d3f9d8"
  if (rate >= 50) return "#fff3bf"
  return "#ffe3e3"
}

export function MultiplicationAccuracyMap({ onBack }: { onBack: () => void }) {
  const [accuracy, setAccuracy] = useState<Record<string, CellAccuracy>>({})

  useEffect(() => {
    const cells: Record<string, CellAccuracy> = {}

    for (const record of getGameRecordsByMode("multiplication")) {
      for (const result of record.problemResults) {
        const { num1, num2 } = result.problem
        if (num1 < 1 || num1 > 9 || num2 < 1 || num2 > 9) continue

        const key = `${num1}-${num2}`
        const cell = cells[key] ?? { attempts: 0, correct: 0 }
        cell.attempts += 1
        if (result.isCorrect) cell.correct += 1
        cells[key] = cell
      }
    }

    setAccuracy(cells)
  }, [])

  return (
    <Center style={{ minHeight: "100vh", padding: "1rem" }}>
      <Paper withBorder shadow="md" p="lg" radius="lg" style={{ width: "100%", maxWidth: 760 }}>
        <Stack gap="md">
          <Title order={1} size="h2" ta="center">掛け算の正解率マップ</Title>
          <Text c="dimmed" ta="center" size="sm">
            これまでの掛け算の記録から、各問題の正解率を表示します。
          </Text>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }} aria-label="色の見方">
            <Text size="sm">緑：80〜100%</Text>
            <Text size="sm">黄：50〜79%</Text>
            <Text size="sm">赤：0〜49%</Text>
            <Text size="sm">灰：記録なし</Text>
          </div>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              aria-label="掛け算の問題ごとの正解率"
              style={{ borderCollapse: "separate", borderSpacing: 4, margin: "0 auto", minWidth: 540, tableLayout: "fixed" }}
            >
              <caption style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                行が掛けられる数、列が掛ける数です。各マスに正解率と挑戦回数を表示します。
              </caption>
              <thead>
                <tr>
                  <th scope="col" aria-label="掛けられる数と掛ける数" />
                  {Array.from({ length: 9 }, (_, index) => index + 1).map((number) => (
                    <th key={number} scope="col" style={{ padding: 6, fontSize: 14 }}>{number}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 9 }, (_, rowIndex) => rowIndex + 1).map((row) => (
                  <tr key={row}>
                    <th scope="row" style={{ padding: 6, fontSize: 14 }}>{row}</th>
                    {Array.from({ length: 9 }, (_, colIndex) => colIndex + 1).map((column) => {
                      const cell = accuracy[`${row}-${column}`]
                      const rate = cell ? Math.round((cell.correct / cell.attempts) * 100) : null
                      const label = rate === null
                        ? `${row}かける${column}: 記録なし`
                        : `${row}かける${column}: 正解率${rate}パーセント、${cell.attempts}回挑戦`

                      return (
                        <td
                          key={column}
                          aria-label={label}
                          style={{
                            backgroundColor: getCellColor(rate),
                            borderRadius: 8,
                            height: 48,
                            padding: 4,
                            textAlign: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            minWidth: 48,
                          }}
                        >
                          {rate === null ? "—" : `${rate}%`}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Text size="xs" c="dimmed" ta="center">マスを選ぶと「行の数 × 列の数」の問題を表します。</Text>
          <Button onClick={onBack} color="gray" variant="outline" radius="xl" size="lg" fullWidth>
            メニューに戻る
          </Button>
        </Stack>
      </Paper>
    </Center>
  )
}
