# Contributing to GlobalCVE

Thanks for your interest in contributing to GlobalCVE! We're building a fast, modular, open-source vulnerability intelligence platform — and we’d love your help. To set up your local environment: 1. Clone the repo: `git clone https://github.com/globalcve/globalcve.git` 2. Navigate into the folder: `cd globalcve` 3. Install dependencies: `npm install` 4. Start the server: `npm run dev` 5. Make your changes in a new branch, then submit a pull request with a clear description.

## What You Can Work On
- Add new vulnerability feeders (CSAF, GSD, GitHub Advisory, etc.)
- Improve frontend UI or mobile responsiveness
- Patch backend enrichment logic (e.g. ExploitDB, KEV, stats)
- Fix bugs or improve performance
- Help with documentation or onboarding

## Help Wanted: Testing Repo
We also maintain a separate repo for experimental development: **Testing** — (many new features / sources). This repo includes 40+ additional CVE sources not yet merged into the main branch. It needs work — especially around source integration, enrichment logic, and UI consistency. If you're interested in helping:
- Merge feeders from testing into the main branch
- Improve modularity and fallback logic
- Help stabilize testing for future release

The main repo is currently stable, but testing is where the action is. We’d really appreciate help there!

## Coding Standards
- Use atomic commits and descriptive messages
- Follow existing file structure and naming conventions
- Avoid manual test data — use live sources only
- Run `npm run lint` before submitting PRs
- Keep enrichment logic modular and reproducible

## Licensing & Ethics
GlobalCVE is open-source and community-first.
