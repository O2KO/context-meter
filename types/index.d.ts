export type ContextLine = { text: string; percent: number | null } | null

declare module 'claude-code' {
  interface PluginState {
    'context-meter': { line: ContextLine }
  }
}
