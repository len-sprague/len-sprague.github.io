# Academic Pages
**Academic Pages is a GitHub Pages template for personal and professional portfolio-oriented websites.**

![Academic Pages template example](images/themes/homepage-light.png "Academic Pages template example")

# Getting Started

1. Register a GitHub account if you don't have one and confirm your e-mail (required!)
1. Click the "Use this template" button in the top right.
1. On the "New repository" page, enter your public repository name as "[your GitHub username].github.io", which will also be your website's URL.
1. Edit site-wide configuration in `_config.yml` and double check that the `url` is the one that you just selected in the previous step and that `repository` reflects the correct path for your repository.
1. Add your site content, upload any files (like PDFs, .zip files, etc.) to the `files/` directory. They will appear at https://[your GitHub username].github.io/files/example.pdf.
1. Check status by going to the repository settings, in the "GitHub pages" section
1. (Optional) Use the Jupyter notebooks or python scripts in the `markdown_generator` folder to generate markdown files for publications and talks from a TSV file.

See more info at https://academicpages.github.io/

### Additional Tutorials

Additional tutorials for working with the Academic Pages template can be found at the following sites:
- https://jayrobwilliams.com/posts/2020/06/academic-website/

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
- **`moderate`** - adds a sticky sidebar that collapses to a narrow rail after a short scroll (see `assets/js/redesign.js`); Newsreader/Archivo fonts.
- **`extreme`** (active) - a full hero-style home page (see `_layouts/hero.html`) and a compact 56px "glyph rail" sidebar on other pages (see `_includes/author-rail.html`) instead of the usual bio box, plus a condensed bio card at the end of article content (`_includes/bio-card.html`).

Switching `site_layout` alone does not change which layout an individual page uses - the home page (`_pages/about.md`) explicitly sets `layout: hero` in its own front matter, independent of this setting. If you move away from `extreme`, either leave `about.md` on `layout: hero` (the hero page still renders, just without the rail/bio-card elsewhere) or change it back to `layout: single` with `author_profile: true` to fully match `classic`/`moderate`.

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

## Running locally

When you are initially working on your website, it is very useful to be able to preview the changes locally before pushing them to GitHub. To work locally you will need to:

1. Clone the repository and made updates as detailed above.

### Using a different IDE
1. Make sure you have ruby-dev, bundler, and nodejs installed
    
    On most Linux distributions and [Windows Subsystem Linux](https://learn.microsoft.com/en-us/windows/wsl/about) the command is:
    ```bash
    sudo apt install ruby-dev ruby-bundler nodejs
    ```
    If you see error `Unable to locate package ruby-bundler`, `Unable to locate package nodejs `, run the following:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
    then try running `sudo apt install ruby-dev ruby-bundler nodejs` again.

    On MacOS the commands are:
    ```bash
    brew install ruby
    brew install node
    gem install bundler
    ```
1. Run `bundle install` to install ruby dependencies. If you get errors, delete Gemfile.lock and try again.

    If you see file permission error like `Fetching bundler-2.6.3.gem ERROR:  While executing gem (Gem::FilePermissionError) You don't have write permissions for the /var/lib/gems/3.2.0 directory.` or `Bundler::PermissionError: There was an error while trying to write to /usr/local/bin.`
    Install Gems Locally (Recommended):
    ```bash
    bundle config set --local path 'vendor/bundle'
    ```
    then try run `bundle install` again. If succeeded, you should see a folder called `vendor` and `.bundle`.

1. Run `jekyll serve -l -H localhost` to generate the HTML and serve it from `localhost:4000` the local server will automatically rebuild and refresh the pages on change to Markdown (*.md) and HTML files, while changes to the core template and configuration (i.e., `_config.yml`) will require stopping and restarting Jekyll.
    You may also try `bundle exec jekyll serve -l -H localhost` to ensure jekyll to use specific dependencies on your own local machine.

If you are running on Linux it may be necessary to install some additional dependencies prior to being able to run locally: `sudo apt install build-essential gcc make`

## Using Docker

Working from a different OS, or just want to avoid installing dependencies? You can use the provided `Dockerfile` to build a container that will run the site for you if you have [Docker](https://www.docker.com/) installed.

You can build and execute the container by running the following command in the repository:

```bash
chmod -R 777 .
docker compose up
```

You should now be able to access the website from `localhost:4000`.

### Using the DevContainer in VS Code

If you are using [Visual Studio Code](https://code.visualstudio.com/) you can use the [Dev Container](https://code.visualstudio.com/docs/devcontainers/containers) that comes with this Repository. Normally VS Code detects that a development container configuration is available and asks you if you want to use the container. If this doesn't happen you can manually start the container by **F1->DevContainer: Reopen in Container**. This restarts your VS Code in the container and automatically hosts your academic page locally on http://localhost:4000. All changes will be updated live to that page after a few seconds.

# Maintenance

Bug reports and feature requests to the template should be [submitted via GitHub](https://github.com/academicpages/academicpages.github.io/issues/new/choose). For questions concerning how to style the template, please feel free to start a [new discussion on GitHub](https://github.com/academicpages/academicpages.github.io/discussions).

This repository was forked (then detached) by [Stuart Geiger](https://github.com/staeiou) from the [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/), which is © 2016 Michael Rose and released under the MIT License (see LICENSE.md). It is currently being maintained by [Robert Zupko](https://github.com/rjzupkoii), and additional maintainers would be welcome.

## Bugfixes and enhancements

If you have bugfixes and enhancements that you would like to submit as a pull request, you will need to [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) this repository as opposed to using it as a template. This will also allow you to [synchronize your copy](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) of the template to your fork as well.

Unfortunately, one logistical issue with a template theme like Academic Pages that makes it a little tricky to get bug fixes and updates to the core theme. If you use this template and customize it, you will probably get merge conflicts if you attempt to synchronize, although [rebasing](https://git-scm.com/docs/git-rebase) the changes from this template will work along with manually [cherry picking](https://git-scm.com/docs/git-cherry-pick) the relevant commits. If you are not comfortable with the Git command line, you can save your various `.yml` configuration files and Markdown files, delete the repository, and fork it again. 

---
<div align="center">
    
![pages-build-deployment](https://github.com/academicpages/academicpages.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)
[![GitHub contributors](https://img.shields.io/github/contributors/academicpages/academicpages.github.io.svg)](https://github.com/academicpages/academicpages.github.io/graphs/contributors)
[![GitHub release](https://img.shields.io/github/v/release/academicpages/academicpages.github.io)](https://github.com/academicpages/academicpages.github.io/releases/latest)
[![GitHub license](https://img.shields.io/github/license/academicpages/academicpages.github.io?color=blue)](https://github.com/academicpages/academicpages.github.io/blob/master/LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/academicpages/academicpages.github.io)](https://github.com/academicpages/academicpages.github.io)
[![GitHub forks](https://img.shields.io/github/forks/academicpages/academicpages.github.io)](https://github.com/academicpages/academicpages.github.io/fork)
</div>
