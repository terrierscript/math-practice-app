"use client"

import { useState } from "react"
import { Button, Stack } from "@mantine/core"
import { AdditionGame } from "@/components/addition-game"
import { SubtractionGame } from "@/components/subtraction-game"

type Mode = "addition" | "subtraction" | null

export default function MathPracticePage() {
  const [mode, setMode] = useState<Mode>(null)

  if (mode === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <Stack gap="xl">
          <Button 
            onClick={() => setMode("addition")} 
            size="xl" 
            color="orange"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
          >
            たしざん
          </Button>
          <Button
            onClick={() => setMode("subtraction")}
            size="xl"
            color="blue"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
          >
            ひきざん
          </Button>
        </Stack>
      </div>
    )
  }

  return mode === "addition" ? (
    <AdditionGame onComplete={() => setMode(null)} />
  ) : (
    <SubtractionGame onComplete={() => setMode(null)} />
  )
}
