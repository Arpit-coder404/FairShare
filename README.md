# FairShare — Every Contribution Counts.
> **Make teamwork actually work.**

FairShare is a fairness-aware collaboration and team orchestration platform designed specifically for college group projects, academic capstones, hackathon squads, and student research teams.

---

## 🌟 The Core Problem

College group projects are notoriously fraught with friction:
- One teammate ends up doing 70% of the work while others get the same grade.
- Heavy contributors burn out under invisible overburden.
- Teammates get blocked by upstream dependencies without anyone noticing.
- Disagreements arise over who contributed what at grading time.

Traditional task managers merely track checkboxes. **FairShare tracks the health of the collaboration itself.**

---

## ⚡ The Signature Feature: The Fairness Engine

The Fairness Engine is a transparent, explainable algorithmic engine that analyzes live project telemetry to surface:
1. **Workload Balance Score (0 - 100):** A normalized metric assessing the distribution of remaining effort against individual student capacities.
2. **The Balance Orbit:** A signature kinetic visualization mapping teammates to dynamic orbital nodes where size represents assigned effort points, color pulses highlight overburden, and harmonic links trace dependencies.
3. **Smart Task Distribution:** Recommends optimal task assignees based on matching competencies, uncommitted sprint capacity, and active deadlines.
4. **Proactive Blocker Intelligence:** Flags stalled dependencies that risk cascading delays across the critical path.
5. **One-Click Rebalancing:** Previews before-and-after team equilibrium and lets teams rebalance tasks with a single confirmation.

---

## 🎨 Visual Identity: "The Balance Room"

A dark, high-contrast palette built for editorial clarity:
- **Obsidian (`#101114`)** — Deep workspace canvas
- **Midnight (`#17191F`)** — Elevated backdrop
- **Elevated Surface (`#20232B`)** — Structured panels
- **Electric Lime (`#C9FF5C`)** — Positive balance & key actions
- **Coral (`#FF786E`)** — Meaningful bottleneck & overload alerts
- **Soft Blue (`#8EAFFF`)** & **Violet (`#B8A0FF`)** — Insight layers & dependencies
- **Typography:** Display headings paired with clean sans-serif UI type

---

## 🚀 Key Routes & Capabilities

| Route | View | Description |
|---|---|---|
| `/` | **Landing Page** | Editorial showcase with interactive dimension preview & problem statement |
| `/auth` | **Authentication** | Demo persona switcher & credential sign-in |
| `/onboarding` | **Onboarding** | Create team/project or join with invite code (`NEBULA-2026`) |
| `/app` | **Overview** | Team balance snapshot, active blockers, my tasks, and upcoming milestones |
| `/app/projects` | **Projects Portfolio** | Multi-project manager, completion velocity, and project creation |
| `/app/projects/:id` | **Project Details** | Project mission, deliverables vault, and collaborator breakdown |
| `/app/projects/:id/board` | **Task Board** | 5-column Kanban with effort points (1-10), filters, and drag/drop |
| `/app/projects/:id/fairness` | **Fairness Engine** | Balance Orbit, workload vs capacity charts, and 1-click rebalancing |
| `/app/projects/:id/team` | **Team Dynamics** | Member capacities, Weekly Pulse check-ins, and Peer Feedback rubrics |
| `/app/projects/:id/timeline` | **Timeline** | Chronological audit trail of deliverables, uploads, and rebalances |
| `/app/projects/:id/insights` | **Analytics & Reports** | Velocity charts, deliverable share, and downloadable CSV dossier |
| `/app/inbox` | **Notifications** | Actionable notifications for blockers, proposals, and milestone events |
| `/app/profile` | **Profile** | Contributor bio, verified skills, and persona switching |
| `/app/settings` | **Settings** | Persistence reset, privacy guarantees, and Supabase SQL blueprint |

---

## 🛡️ Anti-Surveillance & Ethical Privacy Guarantee

FairShare is built on ethical collaboration principles:
- **Zero Spyware:** Never tracks keystrokes, active window focus, or green presence dots.
- **No Public Shame Rankings:** Scores assess team health, not punitive individual rankings.
- **Private Peer Feedback:** Peer reviews are confidential by default to encourage honest feedback.
- **Explainable Calculations:** Every fairness recommendation provides human-readable rationale.

---

## 💻 Tech Stack

- **React 18** + **Vite 6** + **TypeScript**
- **Tailwind CSS** + Custom Palette
- **Framer Motion** + **Canvas Confetti**
- **Zustand** (Local demo persistence + instant switching)
- **Recharts** (Velocity, Workload, and Distribution charts)
- **Lucide Icons**
- **Supabase-ready** PostgreSQL DDL in `src/lib/supabase-schema.sql`

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

