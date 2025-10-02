"use client"
import { Card, Text, Stack, Group, Badge, Divider, Button, ScrollArea, Center } from "@mantine/core"
import Link from "next/link"
import { formatTime } from "../utils/time"
import { type GameRecord, type GameMode, getGameRecords, getGameStatistics, clearGameRecords, confirmClearRecords } from "../utils/storage"
import { useState, useEffect } from "react"


export function GameRecords() {
  const [records, setRecords] = useState<GameRecord[]>([])
  const [statistics, setStatistics] = useState({
    totalGames: 0,
    additionGames: 0,
    subtractionGames: 0,
    averageCorrectRate: 0,
    bestCorrectRate: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setRecords(getGameRecords())
    setStatistics(getGameStatistics())
  }

  const handleClearRecords = () => {
    if (confirmClearRecords()) {
      clearGameRecords()
      loadData()
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModeLabel = (mode: GameMode) => {
    return mode === 'addition' ? '足し算' : '引き算'
  }

  const getModeColor = (mode: GameMode) => {
    return mode === 'addition' ? 'blue' : 'green'
  }

  if (records.length === 0) {
    return (
      <Center style={{ minHeight: '100vh', padding: '1rem' }}>
        <Card withBorder shadow="lg" padding="xl" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <Stack gap="lg">
            <Text size="xl" fw="bold">📊 ゲーム記録</Text>
            <Text size="lg" c="dimmed">まだ記録がありません</Text>
            <Text size="md" c="dimmed">ゲームを完了すると記録が保存されます</Text>
            
            <Link href="/">
              <Button 
                size="lg"
                color="gray"
                variant="filled"
                radius="xl"
                fullWidth
                style={{ height: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                戻る
              </Button>
            </Link>
          </Stack>
        </Card>
      </Center>
    )
  }

  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      <Card withBorder shadow="lg" padding="xl" style={{ maxWidth: '600px', width: '100%' }}>
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Text size="xl" fw="bold">📊 ゲーム記録</Text>
          </Group>

          {/* 統計情報 */}
          <Card withBorder padding="md" style={{ backgroundColor: '#f8f9fa' }}>
            <Text size="lg" fw="bold" mb="md">統計情報</Text>
            <Group justify="space-between">
              <Text size="sm">総ゲーム数</Text>
              <Text size="sm" fw="bold">{statistics.totalGames}回</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">足し算</Text>
              <Text size="sm" fw="bold">{statistics.additionGames}回</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">引き算</Text>
              <Text size="sm" fw="bold">{statistics.subtractionGames}回</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">平均正解率</Text>
              <Text size="sm" fw="bold" c="blue">{statistics.averageCorrectRate}%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">最高正解率</Text>
              <Text size="sm" fw="bold" c="green">{statistics.bestCorrectRate}%</Text>
            </Group>
          </Card>

          <Divider />

          {/* 記録一覧 */}
          <Text size="lg" fw="bold">過去の記録</Text>
          <ScrollArea style={{ height: '400px' }}>
            <Stack gap="md">
              {records.map((record) => (
                <Card key={record.id} withBorder padding="md">
                  <Stack gap="xs">
                    <Group justify="space-between" align="center">
                      <Badge color={getModeColor(record.mode)} size="lg">
                        {getModeLabel(record.mode)}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        {formatDate(record.completedAt)}
                      </Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Text size="sm">正解率</Text>
                      <Text size="sm" fw="bold" c={record.correctRate === 100 ? "green" : "blue"}>
                        {record.correctRate}%
                      </Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Text size="sm">正解数</Text>
                      <Text size="sm">
                        {record.correctProblems} / {record.totalProblems}問
                      </Text>
                    </Group>
                    
                    <Group justify="space-between">
                      <Text size="sm">所要時間</Text>
                      <Text size="sm">{formatTime(record.elapsedSeconds)}</Text>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </ScrollArea>

          <Link href="/">
            <Button 
              size="lg"
              color="gray"
              variant="filled"
              radius="xl"
              fullWidth
              style={{ height: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
            >
              戻る
            </Button>
          </Link>
        </Stack>
      </Card>
    </Center>
  )
}