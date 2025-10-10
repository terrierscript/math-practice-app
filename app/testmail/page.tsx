'use client'

import { useState } from 'react'
import { Button, Card, Text, Stack, Title, Alert, Box } from "@mantine/core"
import { sendCompletionEmail } from '../../utils/email'

export default function TestMailPage() {
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // 固定のテストデータ
  const generateTestResults = () => {
    const problemResults = []
    
    // 10問のうち8問正解のテストデータ
    for (let i = 0; i < 10; i++) {
      const num1 = Math.floor(Math.random() * 10) + 1
      const num2 = Math.floor(Math.random() * 10) + 1
      const answer = num1 + num2
      
      problemResults.push({
        problem: {
          num1,
          num2,
          operator: '+' as const,
          answer
        },
        userAnswer: i < 8 ? answer : answer + 1, // 最初の8問は正解、残り2問は不正解
        isCorrect: i < 8,
        timeSpent: Math.floor(Math.random() * 10) + 5
      })
    }
    
    return problemResults
  }

  const handleSendTestEmail = async () => {
    setIsSending(true)
    setResult(null)
    
    try {
      const problemResults = generateTestResults()
      
      const success = await sendCompletionEmail({
        mode: 'addition',
        problemResults,
        elapsedSeconds: 150, // 2分30秒
        titlePrefix: '[テスト]'
      })
      
      if (success) {
        setResult({ 
          success: true, 
          message: 'テストメールを正常に送信しました！メールボックスを確認してください。' 
        })
      } else {
        setResult({ 
          success: false, 
          message: 'メール送信に失敗しました。コンソールログを確認してください。' 
        })
      }
    } catch (error) {
      console.error('テストメール送信エラー:', error)
      setResult({ 
        success: false, 
        message: `エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}` 
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Box style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Title order={1} mb="xl" style={{ textAlign: 'center' }}>
        📧 メール送信テストページ
      </Title>
      
      <Card withBorder shadow="sm" padding="xl">
        <Stack gap="lg">
          <Text size="sm" c="dimmed">
            このページでは算数ゲーム結果報告メールの送信をテストします。
            固定のテストデータ（足し算10問中8問正解、2分30秒）で結果報告メールを送信します。
            テストメールには件名に「[テスト]」が付きます。
          </Text>

          <Card withBorder p="md" bg="gray.0">
            <Text fw={500} mb="xs">テストデータ</Text>
            <Text size="sm">ゲームタイプ: 足し算</Text>
            <Text size="sm">問題数: 10問</Text>
            <Text size="sm">正解数: 8問</Text>
            <Text size="sm">正解率: 80%</Text>
            <Text size="sm">経過時間: 2分30秒</Text>
          </Card>

          <Stack gap="sm">
            <Button
              onClick={handleSendTestEmail}
              loading={isSending}
              size="md"
              fullWidth
            >
              {isSending ? 'メール送信中...' : 'テストメールを送信'}
            </Button>
            
            <Button
              component="a"
              href="/testmail/preview"
              target="_blank"
              variant="outline"
              size="md"
              fullWidth
            >
              📧 メールプレビューを表示
            </Button>
          </Stack>

          {result && (
            <Alert 
              color={result.success ? 'green' : 'red'}
              title={result.success ? '送信成功' : '送信失敗'}
            >
              {result.message}
            </Alert>
          )}

          <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
            送信先: 環境変数NOTIFICATION_EMAILで設定されたアドレス
          </Text>
        </Stack>
      </Card>
    </Box>
  )
}