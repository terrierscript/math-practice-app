// ゲーム状態の型定義
export type GameMode = "addition" | "subtraction"

export interface GameState {
  mode: GameMode
  currentIndex: number
  score: number
  elapsedSeconds: number
  problems: {
    num1: number
    num2: number
    answer: number
  }[]
  savedAt: number // タイムスタンプ
}

// 1日のミリ秒数
const ONE_DAY_MS = 24 * 60 * 60 * 1000

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
    
    // 1日以上経過している場合は無効
    if (Date.now() - state.savedAt > ONE_DAY_MS) {
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