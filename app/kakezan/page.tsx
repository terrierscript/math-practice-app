"use client"

import { Table, Text, Stack, Button, Center, Card } from "@mantine/core"
import Link from "next/link"

export default function KakezanPage() {
  // 1から9までの数字の配列を作成
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  const rows = numbers.map((row) => (
    <Table.Tr key={row}>
      <Table.Th style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', textAlign: 'center' }}>
        {row}
      </Table.Th>
      {numbers.map((col) => (
        <Table.Td
          key={`${row}-${col}`}
          style={{ 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e3f2fd'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {row * col}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      <Stack gap="xl" style={{ width: '100%', maxWidth: '800px' }}>
        <Text 
          size="2rem" 
          fw="bold" 
          ta="center"
          c="dark"
        >
          九九表
        </Text>
        
        <Card withBorder shadow="md" padding="lg">
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', textAlign: 'center' }}>×</Table.Th>
                {numbers.map((num) => (
                  <Table.Th 
                    key={num} 
                    style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {num}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Card>

        <Center>
          <Link href="/">
            <Button
              size="lg"
              color="blue"
              variant="filled"
              radius="xl"
              style={{ height: '60px', fontSize: '1.25rem', fontWeight: 'bold' }}
            >
              ホームに戻る
            </Button>
          </Link>
        </Center>
      </Stack>
    </Center>
  );
}