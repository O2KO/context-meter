import { test, expect } from 'claude-code/testing'
import { formatContext } from './format'

test('пусто до первого ответа', () => {
  expect(formatContext({ window: 200000 })).toContain('окно 200k')
})
test('шкала и проценты', () => {
  const s = formatContext({ window: 200000, tokens: 112000, percent: 56 })
  expect(s).toContain('56%')
  expect(s).toContain('112k из 200k')
  expect(s).toContain('██████░░░░')
})
test('предупреждение', () => {
  expect(formatContext({ window: 200000, tokens: 180000, percent: 90 })).toContain('сохранять')
})

import { levelOf } from './format'
test('цвета по порогам', () => {
  expect(levelOf(39)).toBe('success')
  expect(levelOf(40)).toBe('warning')
  expect(levelOf(59)).toBe('warning')
  expect(levelOf(60)).toBe('error')
  expect(levelOf(undefined)).toBe('subtle')
})
