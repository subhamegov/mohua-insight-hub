<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Data identity rules

- Identify local bodies by Local Government Directory (`lgd_code`), never by ULB name: source government extracts disagree on state for 64 LGD codes and produce zero exact matches when joining ULB lists by name alone.
- Classify every city dataset by `provenance` (`"curated" | "government_records" | "synthetic_prototype"`) and gate Jalandhar-only curated features with `isCurated(dataset)` rather than `!dataset.synthetic`, so government-extract cities never inherit Jalandhar's curated layers or groupings.
- Keep Agra's real-extract source registry in `src/data/agra/sourceRegistry.ts` separate from the four-city synthetic registry, with `url: null` whenever no verified public URL exists.
