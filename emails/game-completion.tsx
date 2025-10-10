import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface GameCompletionEmailProps {
  gameType: string;
  score: number;
  correctAnswers: number;
  totalProblems: number;
  time: string;
  completionDate: string;
  titlePrefix?: string;
}

export const GameCompletionEmail = ({
  gameType = '足し算',
  score = 100,
  correctAnswers = 10,
  totalProblems = 10,
  time = '2分30秒',
  completionDate = '2024年10月10日',
  titlePrefix,
}: GameCompletionEmailProps) => {
  const accuracy = Math.round((correctAnswers / totalProblems) * 100);

  return (
    <Html>
      <Head />
      <Preview>{titlePrefix ? `${titlePrefix} ` : ''}算数ゲーム結果報告 - {gameType}ゲーム完了</Preview>
      <Body style={main}>
        <Container style={container}>
          {titlePrefix && (
            <Section style={section}>
              <Text style={testBadge}>🧪 {titlePrefix.replace(/\[|\]/g, '')}メール</Text>
            </Section>
          )}
          <Heading style={h1}>📊 算数ゲーム結果報告</Heading>
          
          <Section style={section}>
            <Text style={text}>
              {gameType}ゲームが完了しました。結果をご報告いたします。
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>結果</Heading>
            <Text style={text}>
              <strong>ゲーム種類:</strong> {gameType}<br />
              <strong>スコア:</strong> {score}点<br />
              <strong>正解数:</strong> {correctAnswers}/{totalProblems}問<br />
              <strong>正解率:</strong> {accuracy}%<br />
              <strong>クリア時間:</strong> {time}<br />
              <strong>完了日時:</strong> {completionDate}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>
              以上、算数ゲームの実施結果をお知らせいたします。
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              算数練習アプリ - 結果記録システム
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default GameCompletionEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 48px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
};

const testBadge = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '4px',
  color: '#856404',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  padding: '8px 12px',
  textAlign: 'center' as const,
};