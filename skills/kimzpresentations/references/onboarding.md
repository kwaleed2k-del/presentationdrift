# Onboarding a new teammate

Use this the first time someone uses the skill (or whenever `doctor.mjs` shows ✗/○ for something the deck needs).
Be a friendly guide: **one step at a time**, say *why* each thing is needed, wait for "done" before moving on,
and never ask them to paste API keys into the chat.

## Step 1 — Machine check
```bash
node SKILL/scripts/doctor.mjs
```
For every ✗, show the `→` fix command for their OS and offer to run it (ask first — installs change their machine).
Re-run doctor until all required items are ✓.

## Step 2 — React Bits (no account)
Tell them: *"React Bits gives the decks their text effects and animated backgrounds. There's nothing to sign up for — when we make your first deck, `npm run setup` installs 33 components automatically."*
Optional: they can browse https://reactbits.dev and name any component they like; it's added with `npm run setup -- <Name>`.

## Step 3 — 21st.dev (free account, ~3 minutes)
Why: lets Claude pull ready-made components (pricing tables, globes, testimonial marquees, phone mockups) into a deck.
1. Open **https://21st.dev** and sign in (GitHub or Google).
2. Open **https://21st.dev/mcp** and create an API key. Copy it.
3. Have them run this **themselves** in the Claude Code prompt (the `!` runs it in their shell, so the key never goes through the chat):
   ```
   ! claude mcp add magic -s user -- npx -y @21st-dev/magic@latest API_KEY=<paste-key-here>
   ```
   (Alternative: `npx @21st-dev/cli@latest init --client claude --write`, then put the key where it says.)
4. MCP servers load at startup: **restart Claude Code**, then run `claude mcp list` → `magic … ✔ Connected`.
5. `node SKILL/scripts/doctor.mjs --mark 21st`.
Free tier: searching is free; **2 component retrievals per day**. If the team needs more, a paid plan is at https://21st.dev/pricing.

## Step 4 — Remotion (no sign-in)
Tell them: *"Remotion makes the product films that play inside decks. Nothing to sign up for — when you want a film, we run `cd films && npm install && npm run studio`."*

## Step 5 — First deck together
```bash
node SKILL/scripts/new-deck.mjs ~/decks/my-first-deck --theme neon-dark --title "My First Deck"
cd ~/decks/my-first-deck && npm install && npm run setup && npm run dev
```
Open the printed localhost URL, show them **→ ← F T O N**, then ask what the deck is about and continue with the normal workflow in SKILL.md.

## Re-checking later
`node SKILL/scripts/doctor.mjs` any time. ○ items are optional — only nudge for them when a deck actually needs them (21st.dev when a component is missing).
