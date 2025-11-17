/**
 * メモの型定義
 */
export interface Memo {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  category?: string
}

/**
 * メモの作成時に使用する型
 */
export type CreateMemoInput = Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>

/**
 * メモの更新時に使用する型
 */
export type UpdateMemoInput = Partial<Omit<Memo, 'id' | 'createdAt'>>
