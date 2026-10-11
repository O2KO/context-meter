import type { SessionContextUsage } from 'claude-code'

const k = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)

export function formatContext(c: SessionContextUsage): string {
  if (c.tokens === undefined || c.percent === undefined) {
    return `Контекст: окно ${k(c.window)}, заполнение после первого ответа`
  }
  const filled = Math.max(0, Math.min(10, Math.round(c.percent / 10)))
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled)
  const mark = c.percent >= 85 ? ' ⚠ пора сохранять контекст' : c.percent >= 70 ? ' · близко к сжатию' : ''
  return `Контекст ${bar} ${c.percent}% (${k(c.tokens)} из ${k(c.window)})${mark}`
}

export type Level = 'success' | 'warning' | 'error' | 'subtle'

export function levelOf(percent: number | undefined | null): Level {
  if (percent === undefined || percent === null) return 'subtle'
  if (percent < 40) return 'success'
  if (percent < 60) return 'warning'
  return 'error'
}
