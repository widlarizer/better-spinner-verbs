# better-spinner-verbs

A Claude Code plugin that replaces the verbs in the working spinner ("Sauteing…", "Baking…") with your own list.

- The verb stays the same for a whole turn and changes on the next one.
- The desktop app is left alone, since its spinner describes the current step.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install spinner-verbs --marketplace <owner>/better-spinner-verbs
```

Answer `y` to add the marketplace, then pick a scope.

From a shell:

```
claude plugin install spinner-verbs --marketplace <owner>/better-spinner-verbs
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `<owner>/better-spinner-verbs`, then Add plugin.

## Settings

Both show up in `/config`:

| Setting | What it does |
| --- | --- |
| `verbs` | The list of verbs to show. A trailing `...` is dropped, since the spinner adds its own ellipsis. |
| `mode` | `replace` uses only your verbs; `mix` adds Claude Code's own verbs to your list. |
