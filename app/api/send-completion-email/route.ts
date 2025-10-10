import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { GameCompletionEmail } from '../../../emails/game-completion'
import { type EmailData } from '../../../utils/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_EMAIL) {
      console.error('メール送信に必要な環境変数が設定されていません')
      return NextResponse.json(
        { error: 'メール送信の設定が不完全です' },
        { status: 500 }
      )
    }

    const emailData: EmailData = await request.json()
    
    // React Emailコンポーネントをレンダリング
    const emailHtml = await render(GameCompletionEmail({
      gameType: emailData.gameType,
      score: emailData.score,
      correctAnswers: emailData.correctAnswers,
      totalProblems: emailData.totalProblems,
      time: emailData.time,
      completionDate: emailData.completionDate,
    }))

    const { data, error } = await resend.emails.send({
      from: 'Math Practice App <mathapp@resend.terrier.dev>',
      to: [process.env.NOTIFICATION_EMAIL],
      subject: `📊 算数ゲーム結果報告 - ${emailData.gameType}ゲーム`,
      html: emailHtml,
    })

    if (error) {
      console.error('メール送信エラー:', error)
      return NextResponse.json(
        { error: 'メール送信に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error('メール送信処理エラー:', error)
    return NextResponse.json(
      { error: 'メール送信処理に失敗しました' },
      { status: 500 }
    )
  }
}