# 21st.dev — pulling in new components

[21st.dev](https://21st.dev) is a registry of React/shadcn components (Magic UI, Aceternity, cult-ui, …).
The skill already bundles two Magic UI components from it (MIT): `AnimatedBeam` and `OrbitingCircles` in `template/src/components/ui/`.
When a deck needs something new — a pricing table, testimonial marquee, globe, timeline, hero with spotlight — get it from 21st.dev instead of hand-rolling it.

## With the Magic MCP (best)
If the `magic` MCP server is connected (tools named `mcp__magic__*`; the user can add it with the 21st.dev instructions and authenticate via `/mcp`):

1. **Search for free** — `search` with `type: "component"` and a plain query (`"animated pricing table"`, `"testimonial marquee"`, `"world map dots"`). Results include name, preview image/video, author and install command. `get_inspiration` reranks results against the project.
2. **Check the quota before retrieving** — `get_usage`. Free tier = **2 component retrievals per day**. Spend them on pieces that would take long to build (complex SVG/beam math, canvas effects); write simple things yourself.
3. **Retrieve** — `get_component` with the result `id` → component source + demo + dependencies.
4. **Adapt to the deck** before using it:
   - save as `src/components/ui/<kebab-name>.tsx` with an attribution comment (`// 21st.dev — <author>/<name>`),
   - `framer-motion` → `motion/react`,
   - replace hard-coded colours with theme tokens (`useTheme()`, `var(--k-a1)`), so **T** still re-skins it,
   - if it measures DOM (`getBoundingClientRect`), divide by the stage scale (`rect.width / el.offsetWidth`) — see `animated-beam.tsx`,
   - install any npm deps it lists.

## Without the MCP
Use the install command shown on a component's 21st.dev page:
```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>?api_key=$API_KEY_21ST"
```
(needs a 21st.dev API key in `API_KEY_21ST`), or copy the code from the page by hand. Then do the same adaptation steps.

## Good fits for decks
| Need | Search for |
|---|---|
| Integrations / architecture | "animated beam", "orbit", "integration hub" |
| Social proof | "testimonial marquee", "logo cloud", "avatar stack" |
| Global / market slides | "dotted world map", "globe" |
| Pricing / the ask | "pricing table", "pricing cards" |
| Timelines | "timeline scroll", "roadmap" |
| Before/after | "image comparison slider" |
| Device mockups | "iphone mockup", "macbook mockup" |
