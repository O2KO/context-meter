import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'
import { formatContext, levelOf } from './format'

const PANE = 'context-meter'
const TITLE = 'Контекст'
const line = atom({ plugin: 'context-meter', key: 'line' } as const, null)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    await $.command.register({
      name: 'context-meter',
      description: 'Открыть панель заполненности контекстного окна',
    })
    const c = (await $.session.usage()).context
    const text = formatContext(c)
    $.ui.status(text)
    await update($, line, () => ({ text, percent: c.percent ?? null }))
    void $.ui.open({ id: PANE, title: TITLE })
    return r
  })

  on('command.run', { command: 'context-meter' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })
    return { text: 'Панель «Контекст» открыта.' }
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('context')) {
      const text = formatContext(e.context)
      $.ui.status(text)
      await update($, line, () => ({ text, percent: e.context.percent ?? null }))
    }
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const l = await read($, line)
    return (
      <Box flexDirection="column">
        {l === null
          ? <Text dimColor>Нет данных: появятся после первого ответа.</Text>
          : <Text bold color={levelOf(l.percent)}>{l.text}</Text>}
        <Text dimColor>до 40% зелёный · 40–60% жёлтый · от 60% красный</Text>
      </Box>
    )
  })
}
