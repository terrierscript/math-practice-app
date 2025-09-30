"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AdditionGame } from "@/components/addition-game"
import { SubtractionGame } from "@/components/subtraction-game"

type Mode = "addition" | "subtraction" | null

export default function MathPracticePage() {
  const [mode, setMode] = useState<Mode>(null)

  if (mode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col gap-6">
          <Button onClick={() => setMode("addition")} size="lg" className="h-20 px-12 text-4xl font-bold">
            たしざん
          </Button>
          <Button
            onClick={() => setMode("subtraction")}
            size="lg"
            className="h-20 px-12 text-4xl font-bold"
            variant="secondary"
          >
            ひきざん
          </Button>
        </div>
      </div>
    )
  }

  return mode === "addition" ? (
    <AdditionGame onComplete={() => setMode(null)} />
  ) : (
    <SubtractionGame onComplete={() => setMode(null)} />
  )
}
