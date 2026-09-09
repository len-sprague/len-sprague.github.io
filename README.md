# Len Sprague's Professional Site

This site started from [Academic Pages](https://academicpages.github.io/), a Jekyll/GitHub Pages template for academic portfolio sites, and has since diverged into a personal fork with its own content and design. The original template's setup instructions and generic documentation have been moved to [`README-academicpagescustom.md`](README-academicpagescustom.md) for reference; this README covers only what's actually relevant to running and maintaining *this* repo.

## Use of LLMs 

LLMs (Claude, for now) have been used freely for modifying the original template and style options for this personal/professional website, extracting CV data into markdown, json, or bibtek files for relevant content pages (checked by me, Len, and thus any mistakes are my own), and bug fixing. Design decisions and changes will always be preempted with non-LLM brainstorming and identification of goals/desires for the site, and written content (such as that for the home page, blog posts, more detailed descriptions of various items...) will always be my own responsibility, and void of any LLM assistance unless otherwise explicitly stated (such as for demonstration purposes and/or commentary on tool capabilities). However, documents such as this README file will often be drafted by or with LLM use, and only reviewed by me for overall usability (or to just keep track of the damn options being added/removed). In fact, likely the entire README document apart from this particular section has been written by Claude, with my nudges here and there.

## History

The site was populated with real content (publications, talks, portfolio) in place of the template's placeholders, and a handful of stock-template bugs were fixed along the way (a footer that was pinned over page content, a broken ResearchGate link, stale GitHub Actions workflows, case-sensitive link bugs). On top of that, a second, selectable design system - new color schemes, layout variants, a light/dark toggle, and compact publication/portfolio styling - was layered onto the original Minimal Mistakes/Academic Pages theme without modifying or removing it, so the stock theme can still be restored at any time. The site was later moved to a custom domain (`lensprague.com`).

## Theming: colors, layout, and fonts

This fork layers a second, **selectable** design system on top of the stock Academic Pages/Minimal Mistakes theme, without modifying or removing the original. Everything about it is controlled from a handful of keys near the top of `_config.yml`:

```yaml
site_theme_legacy : "default"   # the ORIGINAL 6 skins - untouched, see below
site_theme        : "oxblood"   # slate | meridian | cedar | oxblood
site_layout       : "extreme"   # classic | moderate | extreme
color_mode        : "auto"      # auto | light | dark - the *default*; visitors can override with the masthead toggle
upgraded_content  : true        # true = redesign's compact publication/portfolio styling, false = stock archive styling
```

### The original theme system still exists

`site_theme_legacy` is the stock Academic Pages skin picker (`"default"`, `"air"`, `"sunrise"`, `"mint"`, `"dirt"`, `"contrast"` - see `_sass/theme/`). It was renamed from the stock key `site_theme` only so that name could be reused for the new scheme picker below; it still feeds the exact same files as before and nothing about it changed.

### Color schemes (`site_theme`)

Four options, each with its own light and dark palette: `slate` (cool gray-blue), `meridian` (navy/cream, editorial), `cedar` (deep green), `oxblood` (deep red - currently active). Each scheme redefines the same CSS custom properties (`--global-base-color`, `--global-link-color`, `--global-text-color`, etc.) that the rest of the compiled stylesheet already reads, so picking one re-skins the whole site - masthead, sidebar, footer, buttons, links, code blocks - with nothing else to touch.

**To add a fifth scheme:** open `_sass/_redesign.scss`, copy one of the existing `@mixin scheme-<name>-light` / `@mixin scheme-<name>-dark` pairs, adjust the hex values, then wire it up in the "wire each scheme" section the same way the other four are (a base `html[data-scheme="<name>"]` rule, an explicit `[data-mode="dark"]` rule, and an entry in the `@media (prefers-color-scheme: dark)` block for `[data-mode="auto"]`).

### Layout iterations (`site_layout`)

- **`classic`** - stock single-column structure, just retinted and refonted (IBM Plex Sans throughout).
- **`moderate`** - adds a sticky sidebar that collapses to a narrow 72px rail after a short scroll (see `assets/js/redesign.js`); Newsreader/Archivo fonts. Once collapsed, the rail swaps your full `author.name` for the shorter `author.short_name` and drops the bio paragraph entirely (`_sass/_redesign.scss` section 7), since neither fits a 72px column - the location/employer/social-link text isn't adjusted the same way and will still overflow narrow.
- **`extreme`** (active) - a full hero-style home page (see `_layouts/hero.html`) and a compact 56px "glyph rail" sidebar on other pages (see `_includes/author-rail.html`) instead of the usual bio box, plus a condensed bio card at the end of article content (`_includes/bio-card.html`).

The home page (`_pages/about.md`) always uses `layout: hero`, but `_layouts/hero.html` itself checks `site_layout` and only renders the actual hero treatment (portrait, kicker, statement, actions) when it's `extreme`. Under `classic`/`moderate` it falls back to a normal single-column page with the standard sidebar instead - so switching `site_layout` changes the home page too, with no need to touch `about.md`'s `layout:` field. The hero-specific front-matter fields (`kicker`, `statement`, `hero_image`, `hero_actions`) simply go unused in that fallback rather than causing an error, so you can leave them in place for whenever you switch back.

### Light/dark (`color_mode`) and the masthead toggle

`color_mode` sets the *default* a fresh visitor sees: `auto` follows their OS preference (`prefers-color-scheme`), `light`/`dark` forces one regardless of their system setting. The masthead's sun/moon button lets a visitor override that default for their own session - clicking it flips `html[data-mode]` between light/dark and remembers the choice in `localStorage` (key `color_mode`) across future visits, independent of whatever `color_mode` is set to in `_config.yml`.

That button is the same one the stock theme shipped with, just repointed. The stock click handler (`assets/js/_main.js`) drives a *different* attribute, `html[data-theme]`, which the redesign's color schemes deliberately don't read (see `_sass/_redesign.scss` section 3 for why: `data-theme` was already spoken for) - so that part is harmless noise. What isn't harmless is that the same stock code also still swaps the sun/moon icon's class on page load and on OS-preference changes, with no awareness of a color-mode choice made through the new toggle. `assets/js/redesign.js` handles this in two different ways: clicks on the button are blocked outright (capture-phase + `stopImmediatePropagation()`, so the stock click handler never runs at all), while the icon itself is made self-healing with a `MutationObserver` that watches its class and corrects it back any time something external changes it - which turned out to be the only reliable fix, since in testing the stock code's own initialization ran at an unpredictable point relative to any single page-lifecycle event. One narrow, currently-inactive gap: the stock code also redraws any embedded Plotly chart on toggle, and blocking its click handler means that no longer happens - not a problem today since no page embeds one, but worth revisiting if that changes.

### The home page hero (front matter fields)

Any page can opt into the hero layout with `layout: hero` plus these fields (see `_pages/about.md` for the live example):

```yaml
layout: hero
author_profile: false     # hero replaces the sidebar entirely
kicker: "A short eyebrow line above the title"
statement: "A sentence or two under the title."
hero_image: "profile.png"  # relative to /images/, or a full URL
hero_actions:
  - label: "Curriculum vitae"
    url: "/cv/"
  - label: "Google Scholar"
    url: "https://scholar.google.com/citations?user=..."
```

On `extreme` subpages, the end-of-content bio card can be suppressed per page with `bio_card: false` in that page's front matter.

### Fonts

Four Google Fonts load together (Newsreader, Archivo, IBM Plex Sans, IBM Plex Mono - see `_includes/head/custom.html`, loaded asynchronously so they don't block first paint) regardless of which layout iteration is active, so switching `site_layout` needs no other change. Which ones actually get used is decided in `_sass/_redesign.scss` section 2.

### Rolling back

- **Fully:** delete the `"redesign"` line from the `@import` list at the bottom of `assets/css/main.scss`, *and* remove the `<script src="{{ base_path }}/assets/js/redesign.js">` line from `_includes/scripts.html`. Both are needed - the script is what's currently repointing the masthead toggle, so leaving it in place after removing the CSS would leave that button doing nothing at all rather than restoring its original behavior.
- **Partially, keeping the colors:** set `site_layout: classic` in `_config.yml` to drop the hero/rail/moderate-rail structure while keeping your chosen color scheme and fonts.

### Publications/portfolio styling (`upgraded_content`)

`true` (active) renders the publications and portfolio pages with the redesign's own compact styling: a year-gutter row for each publication (`_includes/pub-row.html`, using the `.pub-row`/`.publication-tag` classes from `_sass/_redesign.scss`), and a card grid for the portfolio (`.portfolio-grid`). `false` reverts both pages to the stock `archive-single.html` rendering academicpages ships with.

The small colored tag to the left of a publication's title is its `status:` front-matter field, not its category (the page is already grouped into category sections via `publication_category` in `_config.yml`, so repeating that per-row would be redundant). Only set `status` on entries that need a status called out - `"Preprint"`, `"In Review"`, `"Accepted"`, or similar - and leave it unset on everything else so no tag shows.

The two aren't quite the same include under the hood: `_includes/pub-row.html` duplicates (rather than shares) the citation/paper-link logic from `archive-single.html`, on purpose - so a future change to one can never silently affect the other, and turning `upgraded_content` off always gets you back the exact stock behavior. The portfolio side is simpler: `_pages/portfolio.html` just wraps the *same* `archive-single.html` loop in a `.portfolio-grid` container when the flag is on, so there's only one portfolio-rendering codepath to maintain.

### Portfolio categories and item-type tags

The portfolio page groups entries the same way publications do, via `portfolio_category` in `_config.yml` - currently `AI and Education`, `Data Visualization Tools`, `Essays`, and `Hobby`. Set `category:` in a `_portfolio/*.md` file's front matter to one of those keys (`ai_education`, `dataviz`, `essays`, `hobby`) to place it; a category with no matching entries simply doesn't get a heading, so it's fine to leave `Essays`/`Hobby` empty until there's something to put there.

Unlike publications' `status:` tag, portfolio items can carry an `item_type:` field (e.g. `"Video"`, `"Worksheet"`) - rendered via `_includes/archive-single.html` as the same small pill style (`.item-tag`, sharing CSS with `.publication-tag`), shown to the left of the title. It's opt-in per item; most portfolio entries won't need one.
