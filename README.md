<p align="center">
  <img src="docs/assets/globalCVE_V2.png" alt="GlobalCVE Logo" width="300"/>
</p>


**_Global threats. Unified insights._**
## ☕ Support the Project

If you find GlobalCVE useful, consider [buying me a coffee](https://www.buymeacoffee.com/globalcve) to support ongoing development.

## 🏷️ What Sets Us Apart

GlobalCVE isn’t just another vulnerability feed. We’re building a transparent, unified, and open-source backbone for global CVE intelligence.

- **Multi-source aggregation**  
  We pull from public feeds across continents — NVD, CIRCL, JVN, ExploitDB, and more — with full attribution and fallback logic.

- **Open by design**  
  No paywalls, no vendor lock-in. Our code is public, our API is free, and our roadmap is community-driven.

- **Minimalist and scalable**  
  Built with serverless architecture and clean UI logic, GlobalCVE is fast, forkable, and easy to integrate.

- **Security-first ethos**  
  We prioritize clarity, provenance, and responsible data use — not marketing fluff or gated dashboards.

- **Built by builders**  
  This isn’t a product. It’s infrastructure. And it’s yours to use, improve, and extend.

---

<p align="center">
  <a href="https://globalcve.xyz" target="_blank">
    🌐 Visit the live site → <strong>globalcve.xyz</strong>
  </a>
</p>


# 🌐 GlobalCVE



An open-source vulnerability intelligence platform that aggregates CVEs from multiple national and vendor sources — cleanly, transparently, and developer-friendly.

---

## 🏷️ What Sets Us Apart

- **Unified CVE view** — no duplicates, no noise  
- **Custom badges** for source attribution  
- **Minimalist UI** with dark mode and loading states  
- **Serverless architecture** — scalable and fast  
- **Open-source and free forever**

---

## 🌍 Sources We Support

- 🇺🇸 NVD (US National Vulnerability Database)  
- 🇯🇵 JVN (Japan Vulnerability Notes)  
- 🇨🇭 CIRCL (Luxembourg CERT feed)  
- 🧨 ExploitDB (Public exploit repository)  
- 🇨🇳 CNNVD — *in testing repo*
- 🤖 Android Security Bulletins (ASB) — *in testing repo*  
- 🇫🇷 CERT-FR — *in testing repo*
- Testing Repo contains many many many sources.

---

## ⚙️ Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS  
- **Backend**: Node.js, Express-style API routes  
- **Data**: CSV + JSON parsing, serverless fetch logic  
- **Deployment**: Vercel (coming soon), custom domain support  
- **Optional DBs**: SQLite, Supabase, or flat file cache

---
## Screenshots

Here’s a preview of GlobalCVE’s UI:

### Homepage 
![Homepage Light](screenshots/homepage1.png)

### Homepage 
![Homepage Dark](screenshots/homepage2.png)


## 📦 Getting Started

To run locally:

    npm install
    npm run dev

Then visit [http://localhost:3000](http://localhost:3000) to view the site.

---
## 🛠️ Contributing

We welcome PRs, parser improvements, and new source integrations. Whether you're fixing bugs, adding new CVE feeders, or improving the UI — we’d love your help.

- [Contributor Guide](docs/contributing.md) — setup, standards, and how to get started
- [API Docs](docs/index.md) — endpoints, enrichment logic, and source structure
- [Testing Repo](https://github.com/globalcve/testing) — 40+ unmerged sources, experimental features
- [Open Issues](https://github.com/globalcve/globalcve/issues) — issues, bugs, and feature requests

**🧪 Want to help merge new CVE sources?** Check out [globalcve/testing](https://github.com/globalcve/testing) — we’re actively onboarding contributors.

---

## 📫 Contact

- Email: [globalcve@gmail.com](mailto:globalcve@gmail.com)  
- GitHub: [@globalcve](https://github.com/globalcve)

---

> Built with clarity, minimalism, and a deep respect for reproducibility.
