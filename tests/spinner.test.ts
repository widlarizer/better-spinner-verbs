import { test, expect } from 'claude-code/testing'
import type { RenderElement, RenderSurface } from 'claude-code'

const spinner = (surface: RenderSurface, word: string, requestId = 'main') => ({
  surface,
  component: 'Spinner' as const,
  requestId,
  props: { word, message: null, suffix: '…', mode: 'thinking' as const },
})

test('swaps the verb for one from the list, steady within a turn', { options: { verbs: 'Brewing, Hexing' } }, async ($, on) => {
  const seen: string[] = []
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    seen.push(e.props.word)
    const { Text } = $.ui.resolve(e)
    return h(Text, {}, e.props.word) as RenderElement
  })

  await $.ui.render(spinner('terminal', 'Sauteing'))
  await $.ui.render(spinner('terminal', 'Sauteing'))
  expect(['Brewing', 'Hexing']).toContain(seen[0])
  expect(seen[1]).toBe(seen[0])
})

test('leaves the desktop step text alone', { options: { verbs: 'Brewing' } }, async ($, on) => {
  const seen: string[] = []
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    seen.push(e.props.word)
    const { Text } = $.ui.resolve(e)
    return h(Text, {}, e.props.word) as RenderElement
  })

  await $.ui.render(spinner('desktop', 'Creating notes.md'))
  expect(seen[0]).toBe('Creating notes.md')
})

test('mix mode can keep the engine word', { options: { verbs: 'Brewing', mode: 'mix' } }, async ($, on) => {
  const seen = new Set<string>()
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    seen.add(e.props.word)
    const { Text } = $.ui.resolve(e)
    return h(Text, {}, e.props.word) as RenderElement
  })

  for (const w of ['Sauteing', 'Baking', 'Whisking', 'Simmering', 'Roasting', 'Grilling', 'Frying', 'Poaching']) {
    await $.ui.render(spinner('terminal', w))
  }
  expect(seen.has('Brewing')).toBe(true)
  expect(seen.size).toBeGreaterThan(1)
})

test('takes a list and drops trailing dots', { options: { verbs: ['Brewing...', 'Hexing…'] } }, async ($, on) => {
  const seen = new Set<string>()
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    seen.add(e.props.word)
    const { Text } = $.ui.resolve(e)
    return h(Text, {}, e.props.word) as RenderElement
  })

  for (const w of ['Sauteing', 'Baking', 'Whisking', 'Simmering', 'Roasting', 'Grilling']) {
    await $.ui.render(spinner('terminal', w))
  }
  expect([...seen].every(w => w === 'Brewing' || w === 'Hexing')).toBe(true)
})

test('the manifest default loads', async ($, on) => {
  const seen: string[] = []
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    seen.push(e.props.word)
    const { Text } = $.ui.resolve(e)
    return h(Text, {}, e.props.word) as RenderElement
  })

  await $.ui.render(spinner('terminal', 'Sauteing'))
  expect(seen[0]).not.toBe('Sauteing')
  expect(seen[0]?.endsWith('...')).toBe(false)
})
