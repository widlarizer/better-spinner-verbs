import type { Register } from 'claude-code'

// Small string hash (FNV-1a), so the same turn always maps to the same verb.
const hash = (s: string): number => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// Takes a list or a comma-separated string. Trailing dots are dropped since
// the engine draws its own ellipsis after the word.
export const parseVerbs = (raw: unknown): string[] => {
  const items = Array.isArray(raw) ? raw.map(String) : String(raw ?? '').split(',')
  return items.map(v => v.trim().replace(/(\.{3}|…)+$/, '').trimEnd()).filter(v => v.length > 0)
}

export const register: Register = (on, options) => {
  const verbs = parseVerbs(options.verbs)
  const isMix = options.mode === 'mix'

  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    // On desktop the word describes the current step, so leave it alone.
    if (verbs.length === 0 || e.surface === 'desktop') return next(e)

    const pool = isMix ? [...verbs, e.props.word] : verbs
    // The engine samples a new word each turn; keying on it (plus the agent id)
    // keeps our pick steady within a turn and fresh across turns.
    const word = pool[hash(`${e.requestId}:${e.props.word}`) % pool.length] ?? e.props.word

    return next({ ...e, props: { ...e.props, word } })
  })
}
