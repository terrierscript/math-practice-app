"use client"

import { GameRecords } from "../../components/game-records"
import { useRouter } from "next/navigation"

export default function ScoresPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  return <GameRecords onBack={handleBack} />
}