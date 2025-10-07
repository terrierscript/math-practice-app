"use client"

import { Table, Text, Stack, Button, Center, Card } from "@mantine/core"
import Link from "next/link"
import { useState } from "react"

export default function KakezanPage() {
  // 1から9までの数字の配列を作成
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  
  // 選択された行と列を管理
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  // セルの背景色を決定する関数
  const getCellBackgroundColor = (row: number, col: number) => {
    if (selectedRow === row && selectedCol === col) {
      // 選択されたセルのみ
      return '#2196f3'; // 青
    }
    return 'transparent';
  };

  // セルクリック時の処理
  const handleCellClick = (row: number, col: number) => {
    if (selectedRow === row && selectedCol === col) {
      // 同じセルをクリックした場合は選択解除
      setSelectedRow(null);
      setSelectedCol(null);
    } else {
      // 新しいセルを選択
      setSelectedRow(row);
      setSelectedCol(col);
    }
  };

  const rows = numbers.map((row) => (
    <Table.Tr key={row}>
      <Table.Th style={{ 
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold', 
        textAlign: 'center',
        transition: 'background-color 0.2s'
      }}>
        {row}
      </Table.Th>
      {numbers.map((col) => (
        <Table.Td
          key={`${row}-${col}`}
          onClick={() => handleCellClick(row, col)}
          style={{ 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            backgroundColor: getCellBackgroundColor(row, col),
            color: selectedRow === row && selectedCol === col ? 'white' : 'inherit',
            fontWeight: selectedRow === row && selectedCol === col ? 'bold' : 'normal'
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
                    style={{ 
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold', 
                      textAlign: 'center',
                      transition: 'background-color 0.2s'
                    }}
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