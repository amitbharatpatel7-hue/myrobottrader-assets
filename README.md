# myrobottrader-assets

The public website for **My Robot Trader** (myrobottrader.com), the sister product to My Robot I.S.A.
Served by GitHub Pages from `docs/` on `main`, the same way `myrobotisa-assets` serves myrobotisa.com.

- `docs/index.html`: the home page (black theme of the myrobotisa.com template); the logo is inline SVG.
- `docs/how.html`, `docs/tested.html`: "How we're doing this" and "What we tested" (split out 24 Nov 2026).
- `docs/site.css`, `docs/menu.js`: shared styles and the side menu (fixed on wide screens, a drawer with a
  bottom-left button on phones, as on myrobotisa.com). A new page needs a row in each page's `<nav class="side">`.
- `docs/avatar.png`: the logo (favicon and share image). Since 24 Nov 2026 the robot has two candlesticks for
  eyes; the PNG is a 512px render of the inline SVG in `index.html`, so change both together.
- `docs/CNAME`: the custom domain.

Sign-ups go to `public.trader_updates` in the "Sites & ops" Supabase project through the
`join_trader_updates` RPC: a separate list from the My Robot I.S.A. waitlist. The form only saves on
myrobottrader.com; anywhere else it says "Preview only".

No results, prices or performance claims go on this site while the strategy is in testing.

The "How we're doing this" page (24 Nov 2026) carries three lines Amit chose, cut to fit that rule: no
trade record, no figures. Its counts (fourteen ideas, ten failed) come from `day-trade-lab/reports/ideas.json`
and must be changed here when that list changes. The "What we tested" page is the same
fourteen rows in plain words with no figures; add or move a row here whenever the lab's list changes. "No signals" was left out until a lawyer has looked at it.
