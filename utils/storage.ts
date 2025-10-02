import { z } from "zod"
import { type Problem } from "./problems"

// ゲーム状態の型定義
export type GameMode = "addition" | "subtraction"

// 問題の結果を記録する型
export interface ProblemResult {
  problem: Problem
  isCorrect: boolean // 一度でも間違えた場合はfalse
}

// Zodスキーマ定義
const GameModeSchema = z.enum(["addition", "subtraction"])

const ProblemSchema = z.object({
  num1: z.number(),
  num2: z.number(),
  operator: z.string(),
  answer: z.number()
})

const ProblemResultSchema = z.object({
  problem: ProblemSchema,
  isCorrect: z.boolean()
})

export const GameRecordSchema = z.object({
  id: z.string(),
  mode: GameModeSchema,
  totalProblems: z.number().min(0),
  correctProblems: z.number().min(0),
  correctRate: z.number().min(0).max(100),
  elapsedSeconds: z.number().min(0),
  completedAt: z.number().positive(),
  problemResults: z.array(ProblemResultSchema)
})

// ゲーム結果の記録を保存する型（Zodスキーマから推論）
export type GameRecord = z.infer<typeof GameRecordSchema>

export interface GameState {
  mode: GameMode
  currentIndex: number
  score: number
  elapsedSeconds: number
  problems: Problem[]
  problemResults: ProblemResult[] // 問題ごとの結果
  savedAt: number // タイムスタンプ
}

// その日の0時のタイムスタンプを取得
function getTodayMidnight(): number {
  const now = new Date()
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return midnight.getTime()
}

// 保存された日付が今日かチェック
function isSavedToday(savedAt: number): boolean {
  const todayMidnight = getTodayMidnight()
  return savedAt >= todayMidnight
}

// ゲーム状態を保存
export function saveGameState(state: GameState): void {
  try {
    const stateWithTimestamp = {
      ...state,
      savedAt: Date.now()
    }
    localStorage.setItem("mathPracticeGameState", JSON.stringify(stateWithTimestamp))
  } catch (error) {
    console.error("Failed to save game state:", error)
  }
}

// ゲーム状態を読み込み
export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem("mathPracticeGameState")
    if (!saved) return null

    const state: GameState = JSON.parse(saved)
    
    // 日付が変わっている場合は無効
    if (!isSavedToday(state.savedAt)) {
      clearGameState()
      return null
    }

    return state
  } catch (error) {
    console.error("Failed to load game state:", error)
    return null
  }
}

// ゲーム状態をクリア
export function clearGameState(): void {
  try {
    localStorage.removeItem("mathPracticeGameState")
  } catch (error) {
    console.error("Failed to clear game state:", error)
  }
}

// 保存された状態があるかチェック
export function hasSavedState(): boolean {
  return loadGameState() !== null
}

// 保存された状態の情報を取得
export function getSavedStateInfo(): { mode: GameMode; progress: string; timeAgo: string } | null {
  const state = loadGameState()
  if (!state) return null

  const progress = `${state.currentIndex + 1}/${state.problems.length}問`
  const timeAgo = formatTimeAgo(Date.now() - state.savedAt)

  return {
    mode: state.mode,
    progress,
    timeAgo
  }
}

// 経過時間をフォーマット
function formatTimeAgo(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  
  if (hours > 0) {
    return `${hours}時間前`
  } else if (minutes > 0) {
    return `${minutes}分前`
  } else {
    return "今"
  }
}

// スコア計算関数
export function calculateScore(problemResults: ProblemResult[]): {
  totalProblems: number
  correctProblems: number
  correctRate: number
} {
  const totalProblems = problemResults.length
  const correctProblems = problemResults.filter(result => result.isCorrect).length
  
  return {
    totalProblems,
    correctProblems,
    correctRate: totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0
  }
}

// データクリア確認メッセージ
export function confirmClearData(): boolean {
  return confirm("保存されたゲームデータをすべて削除しますか？\nこの操作は取り消せません。")
}

// ゲーム記録を保存（バリデーション付き）
export function saveGameRecord(
  mode: GameMode,
  totalProblems: number,
  correctProblems: number,
  elapsedSeconds: number,
  problemResults: ProblemResult[]
): void {
  try {
    const record = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      totalProblems,
      correctProblems,
      correctRate: totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0,
      elapsedSeconds,
      completedAt: Date.now(),
      problemResults
    }

    // 保存前にバリデーション
    const validatedRecord = GameRecordSchema.parse(record)

    const existingRecords = getGameRecords()
    const updatedRecords = [...existingRecords, validatedRecord]
    
    localStorage.setItem("mathPracticeGameRecords", JSON.stringify(updatedRecords))
  } catch (error) {
    console.error("Failed to save game record:", error)
  }
}

// ゲーム記録を取得（バリデーション付き）
export function getGameRecords(): GameRecord[] {
  try {
    const saved = localStorage.getItem("mathPracticeGameRecords")
    if (!saved) return []
    
    const rawData = JSON.parse(saved)
    
    // 配列でない場合は空配列を返す
    if (!Array.isArray(rawData)) {
      console.warn("Game records data is not an array, resetting...")
      localStorage.removeItem("mathPracticeGameRecords")
      return []
    }
    
    // 各レコードをバリデーション
    const validatedRecords: GameRecord[] = []
    
    for (const item of rawData) {
      try {
        const validatedRecord = GameRecordSchema.parse(item)
        validatedRecords.push(validatedRecord)
      } catch (validationError) {
        console.warn("Invalid game record found, skipping:", validationError)
        // 無効なレコードはスキップして続行
      }
    }
    
    // 日付順で新しいものから並べる
    return validatedRecords.sort((a, b) => b.completedAt - a.completedAt)
  } catch (error) {
    console.error("Failed to load game records:", error)
    // エラーが発生した場合は、データをクリアして空配列を返す
    localStorage.removeItem("mathPracticeGameRecords")
    return []
  }
}

// 特定のモードのゲーム記録を取得
export function getGameRecordsByMode(mode: GameMode): GameRecord[] {
  return getGameRecords().filter(record => record.mode === mode)
}

// 最新のゲーム記録を取得
export function getLatestGameRecord(): GameRecord | null {
  const records = getGameRecords()
  return records.length > 0 ? records[0] : null
}

// ゲーム記録の統計情報を取得
export function getGameStatistics(): {
  totalGames: number
  additionGames: number
  subtractionGames: number
  averageCorrectRate: number
  bestCorrectRate: number
} {
  const records = getGameRecords()
  
  if (records.length === 0) {
    return {
      totalGames: 0,
      additionGames: 0,
      subtractionGames: 0,
      averageCorrectRate: 0,
      bestCorrectRate: 0
    }
  }
  
  const additionGames = records.filter(r => r.mode === 'addition').length
  const subtractionGames = records.filter(r => r.mode === 'subtraction').length
  const averageCorrectRate = Math.round(
    records.reduce((sum, record) => sum + record.correctRate, 0) / records.length
  )
  const bestCorrectRate = Math.max(...records.map(r => r.correctRate))
  
  return {
    totalGames: records.length,
    additionGames,
    subtractionGames,
    averageCorrectRate,
    bestCorrectRate
  }
}

// ゲーム記録をクリア
export function clearGameRecords(): void {
  try {
    localStorage.removeItem("mathPracticeGameRecords")
  } catch (error) {
    console.error("Failed to clear game records:", error)
  }
}

// 記録削除確認メッセージ
export function confirmClearRecords(): boolean {
  return confirm("過去のゲーム記録をすべて削除しますか？\nこの操作は取り消せません。")
}