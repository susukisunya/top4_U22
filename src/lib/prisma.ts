import path from 'node:path'
import { PrismaClient } from '@/generated/prisma/client'

// 開発環境のホットリロード（無限生成）によるコネクションの累積を防ぐため、
// PrismaClient は一度だけ生成して再利用する。
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma は相対パスの file: データソースURL（file:./dev.db）を
// スキーマファイルの位置（<cwd>/prisma）基準で解決する。
// しかし Turbopack によるバンドルでは import.meta.url が書き換わり、
// 生成クライアントが持つディレクトリ情報が .next 内の仮想パスになってしまう。
// そのため相対URLをスキーマディレクトリ基準の絶対パスに変換して渡す
// （変換しないと「Unable to open the database file」や
//  開いたDBにテーブルが無い P2021 エラーになる）。
const SCHEMA_DIR = path.resolve(process.cwd(), 'prisma')

function resolveDatabaseUrl(url: string | undefined): string | undefined {
  if (!url?.startsWith('file:')) return url
  const filePath = url.slice('file:'.length).trim()
  if (path.isAbsolute(filePath)) return url
  return `file:${path.resolve(SCHEMA_DIR, filePath)}`
}

const datasourceUrl = resolveDatabaseUrl(process.env.DATABASE_URL)

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}