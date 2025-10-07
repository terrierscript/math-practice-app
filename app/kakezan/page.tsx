"use client"

import { Table, Text, Stack, Button, Center, Card } from "@mantine/core"
import Link from "next/link"
import { useState } from "react"

// セルの種類を定義
type CellType = 'selected' | 'same-row' | 'same-col' | 'same-value' | 'normal';

// セルコンポーネントのProps
interface MultiplicationCellProps {
  row: number;
  col: number;
  selectedCell: {row: number, col: number} | null;
  onCellClick: (row: number, col: number) => void;
}

// ヘッダーセルのProps
interface HeaderCellProps {
  value: number;
  isHighlighted: boolean;
  type: 'row' | 'col';
}

// ヘッダーセルコンポーネント
function HeaderCell({ value, isHighlighted, type }: HeaderCellProps) {
  const baseStyle = {
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
  };
  
  const style = isHighlighted 
    ? {
        ...baseStyle,
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
      }
    : {
        ...baseStyle,
        backgroundColor: '#f8f9fa',
        color: 'inherit',
      };
  
  return (
    <Table.Th style={style}>
      {value === 0 ? '×' : value}
    </Table.Th>
  );
}

// セルコンポーネント
function MultiplicationCell({ row, col, selectedCell, onCellClick }: MultiplicationCellProps) {
  // セルの種類を判定
  const getCellType = (): CellType => {
    if (!selectedCell) return 'normal';
    
    const isSelected = selectedCell.row === row && selectedCell.col === col;
    const isSameRow = selectedCell.row === row;
    const isSameCol = selectedCell.col === col;
    const currentValue = row * col;
    const selectedValue = selectedCell.row * selectedCell.col;
    const isSameValue = currentValue === selectedValue && !isSelected;
    
    if (isSelected) return 'selected';
    if (isSameRow || isSameCol) return isSameRow ? 'same-row' : 'same-col';
    if (isSameValue) return 'same-value';
    return 'normal';
  };
  
  // セルタイプに応じたスタイルを取得
  const getCellStyle = (cellType: CellType) => {
    const baseStyle = {
      textAlign: 'center' as const,
      cursor: 'pointer' as const,
      transition: 'all 0.2s ease',
    };
    
    switch (cellType) {
      case 'selected':
        return {
          ...baseStyle,
          backgroundColor: '#1976d2',
          color: 'white',
          fontWeight: 'bold' as const,
        };
      case 'same-row':
      case 'same-col':
        return {
          ...baseStyle,
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          fontWeight: '500' as const,
        };
      case 'same-value':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: '#2e7d32', // 緑色
          fontWeight: 'bold' as const,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'inherit',
          fontWeight: 'normal' as const,
        };
    }
  };
  
  const cellType = getCellType();
  const cellStyle = getCellStyle(cellType);
  
  return (
    <Table.Td
      onClick={() => onCellClick(row, col)}
      style={cellStyle}
    >
      {row * col}
    </Table.Td>
  );
}

export default function KakezanPage() {
  // 1から9までの数字の配列を作成
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  
  // 選択されたセルを管理
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  // セルクリック時の処理
  const handleCellClick = (row: number, col: number) => {
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      // 同じセルをクリックした場合は選択解除
      setSelectedCell(null);
    } else {
      // 新しいセルを選択
      setSelectedCell({ row, col });
    }
  };

  const rows = numbers.map((row) => (
    <Table.Tr key={row}>
      <HeaderCell
        value={row}
        isHighlighted={selectedCell?.row === row}
        type="row"
      />
      {numbers.map((col) => (
        <MultiplicationCell
          key={`${row}-${col}`}
          row={row}
          col={col}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />
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
                <HeaderCell value={0} isHighlighted={false} type="col" />
                {numbers.map((num) => (
                  <HeaderCell
                    key={num}
                    value={num}
                    isHighlighted={selectedCell?.col === num}
                    type="col"
                  />
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