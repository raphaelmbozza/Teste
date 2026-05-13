# AutoResearch Applications in Business

> Living document — updated iteratively via autonomous web research loops.
> Last research pass: Iteration 10 (adoption barriers, paid advertising, cross-industry summary)

---

## 1. What Is AutoResearch?

AutoResearch is an agentic optimization framework coined by Andrej Karpathy in March 2026. The core concept: an AI agent sets a goal, generates a hypothesis, runs an experiment, measures the outcome against a mechanical metric, keeps winners and discards losers, then repeats — all autonomously, without human intervention in each cycle.

Karpathy released a 630-line Python script that ran **126 ML experiments overnight** while he slept, discovering genuine improvements to code he had already hand-optimized. The pattern is not limited to machine learning — anywhere a measurable metric and a controllable variable exist, the loop applies.

**The four-component loop:**
1. **Generator** — proposes the next experiment (hypothesis + change)
2. **Executor** — runs the experiment
3. **Evaluator** — measures the outcome against the target metric
4. **Keeper/Discarder** — commits winners to history, reverts losers

**Key principle:** The loop's value compounds — each iteration is better informed than the last because it incorporates prior results.

---

## 2. Origin & Foundational Example

| Item | Detail |
|------|--------|
| Creator | Andrej Karpathy (former Tesla AI lead, OpenAI co-founder) |
| Released | Early March 2026 |
| Original target | Single-GPU nanochat model training (ML research) |
| Codebase | 630-line Python script, open-sourced on GitHub |
| First overnight run | 126 experiments, multiple genuine improvements discovered |

---

## 3. Business Applications

### 3.1 Software Performance Optimization — Shopify / Liquid

The most high-profile real-world business deployment came from Shopify CEO **Tobi Lütke**, who applied a variant called **pi-autoresearch** (developed with David Cortés) to the Liquid templating engine he created 20 years ago.

**Results after 120 experiments / 93 commits:**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Parse + render time | 7,469 µs | 3,534 µs | **−53%** |
| Object allocations | 62,620 | 24,530 | **−61%** |

Liquid powers rendering across Shopify's **5.6 million active stores**. GC (garbage collection) consumed 74% of total CPU time, making allocation reduction especially impactful.

One specific agent-discovered technique: replacing `StringScanner` tokenizer with `String#byteindex` — single-byte searches ~40% faster than regex-based `skip_until` — alone cut parse time by ~12%.

Shopify then generalized the approach internally, improving **40+ metrics** across the platform.

> "Reflexive AI usage is now a baseline expectation at Shopify." — Tobi Lütke

---

### 3.2 Marketing & Content Optimization

The AutoResearch loop maps directly onto the marketing optimization cycle. The AI handles the **full cycle autonomously**: hypothesis generation → experiment design → execution → evaluation → next iteration.

**Applicable marketing assets:**
- Cold email copy and subject lines
- Landing page headlines and CTAs
- Ad copy variants
- Email nurture sequences
- Video scripts
- Job postings

**How it works for cold email:**
1. Define baseline (current best-performing email)
2. Agent analyzes *why* it works (not just random rewrite)
3. Agent generates a challenger targeting a specific improvement
4. Challenger is deployed and measured
5. Winner is promoted to new baseline

**Results observed:** Reply rates moving from a **2–4% baseline to 8–12%** within four to six weeks of continuous loop operation.

**Key constraint:** Strict single-variable testing — one element changes per experiment to keep the log interpretable.

---

### 3.3 Financial Trading & Strategy Backtesting

The autoresearch loop has been applied to **algorithmic trading strategy optimization**:

- Agent starts from a baseline strategy (e.g., RSI-based)
- Mutates parameters or strategy mix one variable at a time
- Backtests against historical data (e.g., SPY + VIX)
- Keeps improvements, reverts failures
- Runs 2,000+ strategy experiments per night

**Example results reported:**
- Win rate improvement: 31% → 55% (individual strategy optimization)
- Optimized mix: RSI 85%, MACD 5%, Bollinger 5%, RSI+MACD 5% → win rate 83%

The approach is described as **evolutionary, not learning** — the system doesn't understand *why* RSI(7) outperforms, it simply mutates, tests, and keeps winners (analogous to natural selection).

**Platform integration:** QuantConnect's **Mia** AI assistant applies agentic principles to design, backtest, optimize, and live-trade strategies.

---

### 3.4 CRM & Sales Lead Scoring

Agentic AI platforms now apply autoresearch-style continuous optimization to CRM pipelines:

**Capabilities:**
- Autonomously classify cold email replies
- Qualify leads and triage inbound demand 24/7
- Route leads by Ideal Customer Profile (ICP)
- Score product-qualified leads across hundreds of data points simultaneously (engagement, past behavior, intent signals)
- Execute multi-channel follow-ups

**Key shift:** From static rule-based scoring (manual point assignment) to continuously self-improving models that re-score as new behavioral data arrives.

**Example platform — Jeeva AI:** Multi-agent lead qualification delivering 3× more qualified meetings within 30 days.

The broader industry shift: CRM evolves from a **passive database** → a **proactive autonomous revenue engine**.

---

### 3.5 Pharmaceutical & Drug Discovery

Agentic AI loops (autoresearch-pattern) are transforming drug discovery pipelines:

**Applications:**
- Autonomously screen millions of molecular candidates
- Analyze molecular structures, predict efficacy and toxicity
- Design novel drug compounds
- Scan biomedical datasets to identify and validate drug targets
- Form novel hypotheses across research literature

**Industry adoption:** 73% of global pharmaceutical organizations are actively planning, piloting, or deploying agentic AI.

**Market size:**
- 2025: $1.94 billion (AI in pharma)
- 2034 forecast: $16.49 billion (CAGR ~27%)

**Impact on timelines and costs:**
- Drug discovery costs reduced by up to **40%**
- Development timelines compressed: 5 years → **12–18 months**

---

### 3.6 CI/CD & Software Development Pipelines

Autonomous agents applying the autoresearch loop in software engineering:

- Agents modify code, run tests, measure performance, keep or discard changes
- Applied to CI/CD pipeline optimization, build time reduction, test flakiness
- **Codex Autoresearch** and similar tools let agents run 700+ experiments across code changes
- Applied to **legacy code modernization** — agents autonomously refactor and verify

**A Claude Code skill** (`autoresearch-agent`) implements the pattern natively: Modify → Verify → Keep/Discard → Repeat, running while the developer sleeps.

---

### 3.7 SaaS Business Metric Optimization

The generalized pattern can optimize **any quantifiable business metric**:

- **SaaS onboarding flows** — reduce time-to-value, increase activation rates
- **Pricing page copy** — A/B loop to maximize trial conversion
- **In-app messaging** — optimize engagement and retention sequences
- **API endpoint latency** — autoresearch on backend parameters
- **Infrastructure cost** — tune resource allocation autonomously

Ten documented SaaS business ideas built on autoresearch include: optimization agencies, done-for-you due diligence, trading backtest services, and CRM lead scoring products.

---

### 3.8 Competitive Intelligence & Due Diligence

Autoresearch-style agentic workflows applied to business intelligence:

- Autonomous literature review agents that plan searches, run tools, synthesize findings, maintain iterative research logs
- Competitive analysis for M&A due diligence — systematic evaluation of competitor SWOT, financial health, market positioning
- Accelerating market landscaping, technical due diligence, compliance evidence gathering
- Financial statement analysis at scale to identify competitive threats

---

## 4. Core Pattern — Generalizing AutoResearch

The AutoResearch pattern works on **any domain** satisfying three conditions:

```
Constraint + Measurable Metric + Controllable Variable = AutoResearch candidate
```

| Domain | Constraint | Metric | Variable |
|--------|-----------|--------|----------|
| ML training | GPU time | Validation loss | Architecture / hyperparams |
| Email copy | Send volume | Reply rate | Subject line / CTA |
| Software perf | Test suite | Latency (µs) | Code implementation |
| Trading | Historical data | Win rate | Strategy parameters |
| Drug discovery | Compute budget | Binding affinity | Molecular structure |
| Lead scoring | CRM data | Conversion rate | Scoring model weights |

---

## 5. Key Outcomes & Benchmarks Across Domains

| Domain | Reported Result | Source |
|--------|----------------|--------|
| ML model quality (Shopify) | +19% quality, 37 experiments, 8 hours | Shopify Engineering |
| Liquid engine (Shopify) | −53% parse time, −61% allocations | Shopify / Tobi Lütke |
| Cold email reply rate | 2–4% → 8–12% (4–6 weeks) | MindStudio |
| Trading win rate | 31% → 55% (single strategy) | StrategyArena |
| Drug dev timeline | 5 years → 12–18 months | Salesforce / PMC |
| Drug discovery cost | Up to −40% | Multiple sources |

---

---

## 6. Implementation Guide

### Step 1: Pick a Domain That Qualifies

Check the three prerequisites:
1. **Measurable metric** — a number you can compute automatically (no human evaluation needed in the loop)
2. **Controllable variable** — something an agent can change (code, copy, parameters, configuration)
3. **Fast feedback loop** — ideally results in minutes to hours, not days

### Step 2: Define Your Baseline

Capture the current state: run the metric on the existing system and record it as the starting benchmark. This is your "keep bar" — every experiment must beat it to be retained.

### Step 3: Build the Evaluator First

The evaluator (automated metric computation) is the most critical component. If reading results requires human interpretation, the loop breaks. Make it:
- Automated and reproducible
- Deterministic (or averaged over multiple runs to reduce noise)
- Specific (one number, not a report)

### Step 4: Configure the Generator

Options range from simple (LLM prompted with current code + history of prior attempts + metric results) to complex (multi-agent system that plans, debates, and proposes). Start simple.

**Key generator inputs:**
- Current best version of the artifact
- Log of all prior experiments (what was tried, what the metric result was)
- Domain constraints (e.g., "don't change the API contract")

### Step 5: Run, Log, and Monitor

Let the loop run overnight. Monitor for:
- Loop health (is it actually making changes and running experiments?)
- Metric plateaus (diminishing returns signal)
- Runaway behavior (agent changing things outside the defined scope)

### Step 6: Interpret Results

The loop finds *what* works, not *why*. After the loop completes, a human should review the winning changes to understand the mechanism. This prevents metric gaming and builds transferable knowledge.

### Realistic Performance Benchmarks

| Domain | Traffic / Volume Needed | Typical Improvement | Timeline |
|--------|------------------------|---------------------|----------|
| Cold email reply rate | Continuous sends | 2–4% → 8–12% | 4–6 weeks |
| Landing page CVR | 200–500 visitors/variant/cycle | 15–40% lift | 8–12 weeks |
| Software performance | Fast test suite | −20% to −60% latency | Overnight to 2 days |
| ML model quality | Single GPU, 5-min experiments | Varies; 19% in 8 hours (Shopify) | 1–2 nights |

---

## 7. Additional Business Domains (Iteration 2)

### 7.1 Supply Chain & Manufacturing

Agentic AI applying the autoresearch loop to supply chain management:

**Applications:**
- Proactive inventory management: agents monitor stock levels, trigger reorders autonomously
- Disruption response: when a supply disruption occurs, an agent autonomously modifies production workflows, identifies alternative materials, and reconfigures supply logistics — without human intervention
- Production scheduling: agents optimize schedules based on demand, material availability, and capacity constraints; when unexpected events occur, they recalculate plans and suggest alternatives
- Procurement, logistics, and inventory synchronization: analyzing supplier reliability, transportation delays, and demand fluctuations in real time

**Adoption:** More than half of surveyed supply chain executives report deploying AI agents to automate workflows.

**Key providers:** Deloitte, AWS, SAP, IBM, EY all have published agentic supply chain frameworks.

---

### 7.2 Human Resources & Recruiting

52% of talent acquisition leaders plan to use autonomous AI agents to automate sourcing, outreach, screening, and scheduling.

**Capabilities:**
- Autonomously source candidates based on behavioral intent
- Screen resumes with context-aware reasoning
- Schedule complex multi-person interviews
- Craft personalized outreach messages (pulling from candidate's project history, career trajectory)
- Identify skill gaps and recommend personalized training paths

**Key distinction from GenAI:** HR agents proactively reason, decide, and execute workflows autonomously across the entire talent lifecycle, rather than responding to individual prompts.

---

### 7.3 Legal Contract Analysis & Compliance

**The autoresearch-pattern loop for legal:**
1. Receive a new contract
2. Compare terms against company playbook
3. Identify deviations, flag risk clauses
4. Draft redline suggestions
5. Generate executive summary
6. Route to appropriate reviewer

**Continuous compliance monitoring:** An agent continuously tracks regulatory developments across jurisdictions, replacing manual scanning of government websites with automated surveillance that triggers alerts when changes affect operations.

**Financial impact:** Organizations recover 2–5% of annual contract value through proactive AI-powered contract management. For a $500M contract portfolio, that is **$10–25M in protected revenue**.

**Human-in-the-loop:** Legal teams combine the agent's processing capacity with a lawyer's nuanced judgment for complex decisions.

---

### 7.4 Customer Support

**Gartner prediction:** By 2029, agentic AI will autonomously resolve **80% of common customer service issues** without human intervention, leading to a **30% reduction in operational costs**.

**Current deployments:**
- Issue classification, triage, and resolution — end-to-end without human hand-off for Tier 1 issues
- Context-aware escalation to human agents for complex cases
- 43% of organizations expect AI to lower contact center costs by ≥30% within three years

---

### 7.5 Pricing Optimization

**Agentic pricing:** Autonomous systems that set, negotiate, or recommend prices using explicit goals, planning algorithms, simulation environments, and real-time market intelligence.

**Real-world result:** A major U.S. retailer deployed an autonomous pricing layer across 15% of inventory and identified markdown optimization opportunities worth **$2.4 million**.

The loop: monitor market prices → simulate pricing scenarios → test price changes on a segment → measure revenue/margin impact → keep winners → expand.

---

## Sources (Iteration 1)

- [Shopify Engineering — Autoresearch isn't just for training models](https://shopify.engineering/autoresearch)
- [Karpathy autoresearch — GitHub](https://github.com/karpathy/autoresearch)
- [blockchain.news — 5 Business Use Cases](https://blockchain.news/ainews/autoresearch-by-andrej-karpathy-latest-agentic-research-workflow-guide-and-5-business-use-cases)
- [MindStudio — AutoResearch Loop for Business Optimization](https://www.mindstudio.ai/blog/what-is-autoresearch-loop-karpathy-business-optimization)
- [MindStudio — AutoResearch for Marketing](https://www.mindstudio.ai/blog/karpathy-autoresearch-pattern-marketing-automation)
- [MindStudio — Cold Email Optimization](https://www.mindstudio.ai/blog/autoresearch-cold-email-optimization-github-actions)
- [DataCamp — Guide to AutoResearch](https://www.datacamp.com/tutorial/guide-to-autoresearch)
- [StrategyArena — 2,000 Strategy Experiments Every Night](https://strategyarena.io/en/blog/karpathy-autoresearch-strategy-arena)
- [Salesforce — Agentic AI in Pharma](https://www.salesforce.com/healthcare-life-sciences/life-sciences-artificial-intelligence/agentic-ai-in-pharma/)
- [Firethering — Shopify 19% Better Model](https://firethering.com/karpathy-autoresearch-ai-agent/)
- [adelzaalouk.me — From Autoresearch to Autoimprove](https://adelzaalouk.me/2026/mar/15/autoimprove-autonomous-optimization/)
- [aibyaakash.com — The Ultimate Autoresearch Guide](https://www.aibyaakash.com/p/autoresearch-guide)
- [o-mega.ai — Karpathy Autoresearch 2026 Guide](https://o-mega.ai/articles/karpathy-autoresearch-complete-2026-guide)
- [MarkTechPost — Karpathy Open-Sources Autoresearch](https://www.marktechpost.com/2026/03/08/andrej-karpathy-open-sources-autoresearch-a-630-line-python-tool-letting-ai-agents-run-autonomous-ml-experiments-on-single-gpus/)
- [ecommercefastlane — Autoresearch isn't just for training models](https://ecommercefastlane.com/autoresearch-isnt-just-for-training-models-2026-shopify/)

---

## 8. Emerging Directions (Iteration 3)

### 8.1 Multi-Agent Swarms & Distributed AutoResearch

Karpathy's original vision was explicitly SETI@home-scale: "asynchronously massively collaborative for agents — think SETI@home style," emulating an entire research community rather than a single PhD student.

**Community implementations in 2026:**

- **Generic Swarm (Varun Mathur / Agentic General Intelligence v3.0.10):** The Karpathy loop made fully generic — propose an optimization problem in plain English, the network spins up a distributed swarm, no code required. Compounds intelligence across all domains simultaneously.
- **ClawTeam (HKUDS):** Agent Swarm Intelligence where agents self-organize into collaborative teams, divide complex work, share insights in real-time, and converge on solutions. An intelligent leader agent orchestrates specialized sub-agents across multiple GPUs, dynamically reallocating resources based on real-time performance.
- **Multi-Agent AutoResearch with Open Source Models:** Community-built multi-agent loops using local/open-source LLMs instead of proprietary APIs.

**Academic research:** "An Empirical Study of Multi-Agent Collaboration for Automated Research" (arXiv 2603.29632) examines collaborative agentic research architectures.

---

### 8.2 Open-Source Ecosystem & Variants

The Karpathy autoresearch pattern has spawned a growing ecosystem:

| Project | Scope | Key Feature |
|---------|-------|-------------|
| `karpathy/autoresearch` | ML training on single GPU | Original 630-line Python, MIT license |
| `davebcn87/pi-autoresearch` | Any quantifiable metric | Extends to test speed, JS bundle size, Lighthouse scores, build times |
| `autoimprove` (Claude Code skill) | Any repo type | `/autoimprove` command: detects repo type, scaffolds config, builds eval harness, generates safety tests, establishes baseline, starts loop |
| `awesome-autoresearch` (alvinreal, yibie) | Curated index | Community list of all autoresearch-style systems |
| `kyegomez/swarms` | Enterprise multi-agent | Production-ready multi-agent orchestration |

**Key design insight (pi-autoresearch):**
> "The extension is domain-agnostic infrastructure. The skill encodes domain knowledge. This separation means one extension serves unlimited domains."

---

### 8.3 Business ROI Benchmarks

**Headline enterprise ROI numbers (2026):**

| Metric | Value |
|--------|-------|
| Average ROI from agentic AI deployments | **171%** |
| U.S. enterprise average ROI | **192%** |
| vs. traditional automation | **3× higher ROI** |

**Documented case studies:**

| Company | Application | Measured Result |
|---------|------------|----------------|
| Klarna | AI customer service agent | $60M saved, workload of 853 employees |
| General Mills | AI supply chain optimization | $20M+ in savings since FY2024 |
| Healthcare providers | AI documentation agents | 42% reduction in documentation time, 66 min/day saved |
| Salesforce | AI contract automation | $5M in legal cost reduction |
| Shopify | pi-autoresearch / Liquid engine | −53% parse time, −61% allocations |

**Time-to-ROI ranges:**
- Customer service: **2 weeks**
- Marketing optimization: **4–6 weeks**
- Supply chain orchestration: **12+ months**

---

## Sources (Iteration 2)

- [Deloitte — Agentic Supply Chain in Manufacturing](https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/agentic-supply-chain-artificial-intelligence-manufacturing.html)
- [AWS — Transform Supply Chain Logistics with Agentic AI](https://aws.amazon.com/blogs/industries/transform-supply-chain-logistics-with-agentic-ai/)
- [IBM — AI Agents in Supply Chain](https://www.ibm.com/think/topics/ai-agents-supply-chain)
- [AIHR — Top 9 AI Agents for Recruiting](https://www.aihr.com/blog/ai-agents-for-recruiting/)
- [Phenom — AI Recruiting in 2026](https://www.phenom.com/blog/recruiting-ai-guide)
- [GEP — AI Agent-Driven Contract Compliance Audits](https://www.gep.com/blog/strategy/ai-agent-driven-contract-compliance-audits)
- [MindStudio — Build AI Agents for Legal Contract Review](https://www.mindstudio.ai/blog/build-ai-agents-legal-contract-review)
- [Gartner — Agentic AI Will Resolve 80% of Customer Service Issues by 2029](https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290)
- [Medium — Agentic AI Rewrites Commercial Pricing Economics](https://lawrence-emenike.medium.com/transforming-pricing-how-agentic-ai-rewrites-commercial-economics-bb5df865d4c2)
- [Eightfold AI — AI Agents for Recruiting](https://eightfold.ai/blog/ai-agents-recruiting/)

## Sources (Iteration 3)

- [Varun Mathur on X — Generic Distributed Swarm AutoResearch](https://x.com/varun_mathur/status/2032671842230501729)
- [arXiv 2603.29632 — Multi-Agent Collaboration for Automated Research](https://arxiv.org/html/2603.29632)
- [GitHub HKUDS/ClawTeam — Agent Swarm Intelligence](https://github.com/HKUDS/ClawTeam)
- [GitHub davebcn87/pi-autoresearch](https://github.com/davebcn87/pi-autoresearch)
- [GitHub alvinreal/awesome-autoresearch](https://github.com/alvinreal/awesome-autoresearch)
- [adelzaalouk.me — From Autoresearch to Autoimprove](https://adelzaalouk.me/2026/mar/15/autoimprove-autonomous-optimization/)
- [Medium — Turning Autoresearch into a Universal Skill](https://medium.com/@k.balu124/i-turned-andrej-karpathys-autoresearch-into-a-universal-skill-1cb3d44fc669)
- [Agent Wars — Pi-Autoresearch Open Source](https://agent-wars.com/news/2026-03-14-pi-autoresearch-autonomous-experiment-loop-llm-training-frontend-metrics)
- [NextBigFuture — Karpathy on Autoresearch and Self-Improvement Era](https://www.nextbigfuture.com/2026/03/andrej-karpathy-on-code-agents-autoresearch-and-the-self-improvement-loopy-era-of-ai.html)
- [AIMonk — 12 Agentic AI Enterprise Case Studies 2025–2026](https://aimonk.com/agentic-ai-examples-enterprise-roi-case-studies/)
- [OneReach.ai — Agentic AI Stats 2026: ROI & Market Trends](https://onereach.ai/blog/agentic-ai-adoption-rates-roi-market-trends/)

## Sources (Iteration 4 — Implementation & Benchmarks)

- [MindStudio — How to Use AutoResearch to Optimize Any Business Metric](https://www.mindstudio.ai/blog/autoresearch-optimize-business-metrics-autonomously)
- [thecreatorsai.com — Autoresearch: The Loop That Improves Your Work While You Sleep](https://thecreatorsai.com/p/autoresearch-the-loop-that-improves)
- [GlobalAdvisors — Term: Karpathy's Loop / AutoResearch](https://globaladvisors.biz/2026/04/20/term-karpathys-loop-often-referred-to-as-autoresearch-auto-loop-or-auto-optimization/)
- [verdent.ai — AutoResearch Explained](https://www.verdent.ai/guides/what-is-autoresearch-karpathy)
- [o-mega.ai — Self-Improving AI Agents 2026 Guide](https://o-mega.ai/articles/self-improving-ai-agents-the-2026-guide)
- [CNBC — Silent Failure at Scale: AI Risks](https://www.cnbc.com/2026/03/01/ai-artificial-intelligence-economy-business-risks.html)
- [IBM — 10 AI Dangers and Risks](https://www.ibm.com/think/insights/10-ai-dangers-and-risks-and-how-to-manage-them)
- [Anthropic — Labor Market Impacts of AI](https://www.anthropic.com/research/labor-market-impacts)
- [HBR — Research: How AI Is Changing the Labor Market](https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market)
- [genesysgrowth — Landing Page Conversion Stats 2026](https://genesysgrowth.com/blog/landing-page-conversion-stats-for-marketing-leaders)

---

## 9. Risks, Limitations & Ethical Concerns (Iteration 5)

### 9.1 Technical Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Metric gaming** | Agent optimizes a proxy that diverges from true business value | Choose metrics that directly reflect real outcomes; monitor downstream metrics |
| **Overfitting** | Improvements in the test window don't generalize; especially acute in trading | Use held-out validation sets, rolling time windows |
| **Scope creep** | Agent changes things outside the defined boundary | Strict file/directory/API constraints in loop config |
| **Silent failure** | Loop appears to run but produces no meaningful change | Instrument loop health; alert on flat metric sequences |
| **Compute cost** | 100–700 experiments × GPU hours × LLM API calls accumulates rapidly | Set hard experiment budgets and cost ceilings before running |

### 9.2 Business & Organizational Risks

- **Lack of causal understanding** — evolutionary approach finds *what* works, not *why*; knowledge transfer is limited and results can be brittle
- **Single-variable constraint** — slows learning but required for interpretability; multi-variable simultaneous changes make results uninterpretable
- **Regulatory non-compliance** — in financial services, insurance, and healthcare, autonomous decisions must be explainable; "the agent found it" is not an acceptable audit trail in most jurisdictions
- **Algorithmic bias amplification** — if evaluation data reflects historical biases (e.g., CRM lead scoring on skewed past conversions), the loop can amplify discriminatory patterns
- **Over-reliance and execution gap** — AI is embedded but doesn't consistently translate to sustainable value creation when strategic context or human judgment is absent

### 9.3 Future of Work Implications

Autoresearch accelerates the broader AI substitution trend in knowledge work:

| Metric | Value (2026) |
|--------|-------------|
| Jobs displaced by AI per month (US) | ~25,000 |
| New AI-related roles created per month (US) | ~9,000 |
| Net monthly job displacement (US) | ~16,000 |
| Workforce needing new skills by 2027 | 80% globally |
| AI skill salary premium | Up to 56% above peers |

**Roles most affected by autoresearch-style automation:**
- Market Research Analysts (automated data synthesis)
- Junior software engineers doing iterative parameter tuning
- A/B testing specialists (manual experiment design)
- Data scientists performing routine model tuning

**New high-value roles emerging:**
- Autoresearch engineers / "loop strategists" — define what to optimize, set constraints
- AI product managers — translate business problems into measurable loop targets
- MLOps engineers supporting continuous experiment infrastructure
- Prompt engineers / agent architects

---

## Sources (Iteration 5 — Risks & Future of Work)

- [CNBC — Silent Failure at Scale: AI Business Risks](https://www.cnbc.com/2026/03/01/ai-artificial-intelligence-economy-business-risks.html)
- [IBM — 10 AI Dangers and Risks](https://www.ibm.com/think/insights/10-ai-dangers-and-risks-and-how-to-manage-them)
- [Anthropic — Labor Market Impacts of AI](https://www.anthropic.com/research/labor-market-impacts)
- [HBR — How AI Is Changing the Labor Market](https://hbr.org/2026/03/research-how-ai-is-changing-the-labor-market)
- [Deloitte — Four Emerging Categories of GenAI Risks](https://www.deloitte.com/us/en/insights/topics/digital-transformation/four-emerging-categories-of-gen-ai-risks.html)
- [Medium — When Algorithms Go Wrong: Financial AI Crisis](https://medium.com/@cliu2263/when-algorithms-go-wrong-the-growing-crisis-in-financial-ai-f9da05adf377)
- [DemandSage — 77 AI Job Replacement Statistics 2026](https://www.demandsage.com/ai-job-replacement-stats/)
- [SecondTalent — AI Impact on Job Market 2026](https://www.secondtalent.com/resources/ai-impact-job-market-2026/)

---

## 10. Market Landscape & Vendor Ecosystem (Iteration 6)

### 10.1 Agentic AI Market Size Forecasts

The market for agentic AI (the broader category in which AutoResearch sits) is one of the fastest-growing segments in enterprise tech:

| Year | Market Size Estimate | CAGR |
|------|---------------------|------|
| 2025 | $7.3B | — |
| 2026 | $9.9B–$10.9B | ~43% |
| 2030 | $47B–$52.6B | ~44% |
| 2031 | $57.4B | 42% |
| 2034 | $139B–$199B | 40–44% |

**Investment:** AI investments projected to reach **$1.3 trillion by 2029**, fueled by agentic AI systems.

**Adoption forecast:** 50% of enterprises using GenAI will deploy autonomous AI agents by 2027 (up from 25% in 2025).

---

### 10.2 Vendor & Platform Landscape

**Hyperscaler platforms** (cloud-native agentic loops):
- **Google Vertex AI** — cloud-native LLM and agentic AI platform
- **Microsoft Copilot Studio** — low-code agent builder integrated with Microsoft 365
- **AWS** — agentic supply chain, Bedrock Agents
- **Databricks (Mosaic AI)** — unified data + ML + production agents on lakehouse architecture

**Enterprise AI agent platforms:**
- **Anthropic** — partnered with Accenture, Deloitte, PwC; Claude as the reasoning engine in many enterprise loops
- **OpenAI** — formal partnerships with McKinsey, BCG, Accenture, Capgemini
- **Salesforce** — agentic AI in pharma, CRM (Agentforce)
- **SAP** — agentic supply chain and ERP optimization

**Market trend:** In Q1–Q2 2026, vendors shifted from per-user/month pricing to **outcome-based models** — customers pay per resolution or completed action (directly aligning vendor incentives with loop results).

---

### 10.3 Content & SEO Autoresearch Applications

The pattern has been adapted for creative and content domains:

**Content/SEO loop mechanics:**
- *Artifact:* Documentation pages, blog posts, ad copy, email templates
- *Metric:* SEO score, click-through rate, open rate, conversion rate
- *Agent action:* Rewrite headlines, restructure content, adjust metadata
- *Loop cadence:* Run overnight, surface a report by morning

**Documented content applications:**
- Background agents in MindStudio run on a schedule; loop runs overnight, reports surface in the morning — "Karpathy-style"
- Skills/prompt optimization: single-file instructions, measurable output quality, small changes compound fast
- Social media content: iterating on hooks, posting times, hashtag strategies with engagement rate as the metric

**GitHub stars signal:** Karpathy's announcement received **21,000+ GitHub stars** and **8.6 million views** within days — the fastest adoption signal of any tool in its category.

---

### 10.4 Autoresearch for Product Managers

Aakash Gupta's "PM's Guide to Karpathy's Autoresearch" frames the pattern for product teams:

- PMs can define the optimization problem (the *goal*) and the metric (the *scoreboard*)
- The agent handles hypothesis generation, testing, and iteration
- The PM's role shifts from running experiments to *interpreting results* and *setting the next optimization target*
- Applicable to: onboarding flows, feature adoption funnels, in-app messaging, pricing page copy

---

## Sources (Iteration 6)

- [Fortune Business Insights — Agentic AI Market Forecast](https://www.fortunebusinessinsights.com/agentic-ai-market-114233)
- [Precedence Research — Agentic AI Market Size to $199B by 2034](https://www.precedenceresearch.com/agentic-ai-market)
- [Motley Fool — Agentic AI Market Could Grow 10X by 2030](https://www.fool.com/investing/2026/03/19/prediction-the-agentic-ai-market-could-grow-10x-by/)
- [Kai Waehner — Enterprise Agentic AI Landscape 2026](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/)
- [Sema4.ai — Best Enterprise AI Platforms of 2026](https://sema4.ai/blog/best-ai-platforms-of-2026/)
- [thecreatorsai.com — AutoResearch: The Loop That Improves Your Work While You Sleep](https://thecreatorsai.com/p/autoresearch-the-loop-that-improves)
- [aimaker.substack.com — How I Built a Skill That Makes All My Other Skills Better](https://aimaker.substack.com/p/how-i-built-skill-improves-all-skills-karpathy-autoresearch-loop)
- [news.aakashg.com — PM's Guide to Karpathy's Autoresearch](https://www.news.aakashg.com/p/autoresearch-guide-for-pms)
- [sidsaladi.substack.com — Autoresearch 101 Builder's Playbook](https://sidsaladi.substack.com/p/autoresearch-101-builders-playbook)
- [Karpathy on X — Original Announcement Thread](https://x.com/karpathy/status/2030371219518931079)

---

## 11. Industry Verticals Deep Dive (Iteration 7)

### 11.1 Healthcare Operations

**Adoption:** 61% of healthcare organizations are already building or implementing agentic AI, with 98% of surveyed executives expecting ≥10% cost savings.

**Applications of the autoresearch loop in healthcare:**
- **Patient scheduling optimization:** AI agents run 24/7, integrate calendars in real time, proactively contact patients via preferred channels, factor in provider schedules, patient history, and environmental variables (weather patterns) to maximize utilization
- **Administrative workflow loops:** Medical documentation, insurance claims processing, coding — the agent iterates autonomously on accuracy and throughput
- **Clinical documentation:** 42% reduction in documentation time, saving ~66 minutes per clinician per day (from earlier case study data)
- **EHR / system integration:** Agents orchestrate end-to-end workflows across EHRs, scheduling tools, payer portals, and patient engagement platforms

**Documented result:** Healthcare providers using AI documentation agents save ~66 minutes/day; extrapolated across a hospital system, this represents thousands of recovered clinical hours per year.

---

### 11.2 Energy & Utilities

**Market:** Agentic AI in energy — $657M in 2025, forecast **$14.9B by 2035** (CAGR 36.65%).

**Autoresearch-style loops in energy:**
- **Grid optimization:** AI continuously analyzes electricity demand, generation capacity, and grid performance to optimize power distribution — reducing grid losses autonomously
- **Predictive maintenance:** Agents detect subtle sensor anomalies, cross-reference historical failure patterns, check maintenance logs, calculate risk of continued operation, and dispatch maintenance crews — without a human in the loop
- **Renewable energy operations:** Autonomous context-aware systems that plan, decide, and act across the generation and distribution value chain
- **Smart city infrastructure:** Agentic analytics convert dashboard insights into automated operational tasks across millions of connected assets

**Microsoft deployment:** Azure-powered agentic systems managing KPI monitoring, outage forecasting, and automated field alerting for state-level transmission utilities.

---

### 11.3 Education & Personalized Learning

The autoresearch optimization loop maps onto personalized learning systems:

- **Adaptive curriculum generation:** AI generates a Directed Acyclic Graph (DAG) of prerequisite topics, continuously updating the path based on learner performance
- **DeepTutor (HKUDS):** Agent-native educational AI that adapts interactions based on real-time learner context — not a static chatbot
- **AI tutoring RCT results (Nature):** AI tutoring outperforms in-class active learning in a randomized controlled trial
- **Optimization target:** Mastery rate, time-to-concept, or assessment score — the loop adjusts pacing, content format, and explanation style

**The loop:** Student answers a question → agent evaluates response → agent adjusts difficulty and explanation style → next question — repeating indefinitely.

---

### 11.4 Cybersecurity

The autoresearch loop applied to threat detection and response:

**Defense (blue team) applications:**
- Agentic monitoring retains context across events, expands monitoring to related entities (users, hosts, processes, network flows), and triggers investigative actions when initial detections warrant deeper inspection
- The agent doesn't just flag anomalous behavior — it investigates activity, assesses probable next steps, and enables autonomous threat detection
- Semi-autonomous response: agent handles detection and analysis; human handles high-impact response decisions

**Key limitation acknowledged:** AI can detect *what* is anomalous; human analysts determine *why* it matters and what business context applies. Judgment calls in sophisticated threat hunting still require human oversight (2026 consensus).

**Emerging threat (red team):** Memory poisoning attacks on AI agents — adversaries implant malicious information into an agent's long-term memory, which persists across sessions (unlike standard prompt injection). This is an autoresearch-specific risk when agents maintain state.

---

## Sources (Iteration 7)

- [OneReach.ai — AI Agents in Healthcare 2026](https://onereach.ai/blog/ai-agents-in-healthcare-for-real-patient-care/)
- [Deloitte — Agentic AI in Health Care Operating Model](https://www.deloitte.com/us/en/insights/industry/health-care/agentic-ai-health-care-operating-model-change.html)
- [AHA — Amazon Introduces Agentic AI for Health Care Providers](https://www.aha.org/aha-center-health-innovation-market-scan/2026-03-24-amazon-introduces-agentic-ai-health-care-providers)
- [Microsoft Cloud Blog — Agentic AI Transforming Renewable Energy](https://www.microsoft.com/en-us/microsoft-cloud/blog/energy-and-resources/2026/04/21/how-agentic-ai-is-transforming-renewable-energy-operations-realizing-the-energy-frontier/)
- [Precedence Research — Agentic AI in Energy Market $14.9B by 2035](https://www.precedenceresearch.com/agentic-ai-in-energy-market)
- [XenonStack — Agentic AI in Energy Sector](https://www.xenonstack.com/blog/agentic-ai-energy-sector)
- [GitHub HKUDS/DeepTutor — Agent-Native Personalized Learning](https://github.com/HKUDS/DeepTutor)
- [Nature — AI Tutoring Outperforms In-Class Active Learning (RCT)](https://www.nature.com/articles/s41598-025-97652-6)
- [Cyble — Agentic AI in Cybersecurity 2026](https://cyble.com/knowledge-hub/agentic-ai-in-cybersecurity-smarter-threat-detection/)
- [arXiv 2601.05293 — Survey of Agentic AI and Cybersecurity](https://arxiv.org/html/2601.05293v1)
- [PMC — Review of Agentic AI in Cybersecurity](https://pmc.ncbi.nlm.nih.gov/articles/PMC12569510/)

---

## 12. Financial Services & Real Estate (Iteration 8)

### 12.1 Banking & Financial Services

**Adoption rate:** 44% of finance teams using agentic AI in 2026 — up **600%+ from 2025**. Enterprise-level ROI averages **2.3× within 13 months**.

**Market size:** Agentic AI in financial services on track to reach **$33.26B by 2030**.

**Applications of the autoresearch loop:**

| Use Case | Autonomous Loop Behavior |
|----------|-------------------------|
| Fraud detection | Continuously learns from emerging fraud patterns; updates detection rules without human intervention |
| Loan underwriting | Verifies documents, assesses income consistency, pulls credit history, generates decision, cross-checks fraud databases — all in minutes |
| KYC/AML compliance | McKinsey: productivity gains of **200–2,000%** in compliance domains through end-to-end autonomous execution |
| Portfolio management | Agent monitors positions, runs scenario analyses, rebalances autonomously within defined risk parameters |
| Customer onboarding | Iterates on communication sequences and documentation requests to minimize drop-off |

**Real-world deployments:** HSBC, Citi, UBS, DBS, ING — reporting cost reductions of **20–40%** and revenue uplifts of **10–30%**.

**Entry pattern observed:** Agentic AI enters through high-volume, rules-adjacent workflows — customer service (75% of banks), fraud detection (66%), loan processing (60%) — then expands.

---

### 12.2 Real Estate

**Adoption (2026):** 97% of brokerage leaders report agents actively using AI; 82% of real estate professionals use AI tools as part of workflow.

**Autoresearch-adjacent applications:**
- **Automated Valuation Models (AVMs):** Continuously ingest satellite imagery, permit data, neighborhood trends, climate risk scores, and hyperlocal sales velocity to update property valuations — faster and more accurate than manual appraisals for standard residential
- **Market analysis automation:** Energent.ai autonomously transforms unstructured real estate documents into presentation-ready insights with 94.4% accuracy, processing 1,000+ files per prompt
- **Lead optimization loops:** Agents iterate on outreach sequences, property matching, and follow-up timing to maximize qualified showings

**Potential value:** McKinsey estimates AI could generate **$110–$180B in annual value** for the U.S. real estate sector.

**Execution gap:** Only 5% of commercial real estate firms that started AI initiatives have achieved all program goals — the gap between aspiration and execution remains wide.

---

## Sources (Iteration 8)

- [Azilen — Agentic AI in Financial Services 2026](https://www.azilen.com/blog/agentic-ai-in-financial-services/)
- [Deloitte — Agentic AI in Banking](https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-banking.html)
- [AppInventiv — Agentic AI in Banking: Fraud, Compliance & Credit](https://appinventiv.com/blog/agentic-ai-in-banking/)
- [Kore.ai — AI Agents in Finance & Banking: 12 Proven Use Cases](https://www.kore.ai/blog/ai-agents-in-finance-banking-12-proven-use-cases-2026)
- [AWS — Agentic AI in Financial Services Multi-Agent Patterns](https://aws.amazon.com/blogs/industries/agentic-ai-in-financial-services-choosing-the-right-pattern-for-multi-agent-systems/)
- [GrowthFactor — AI Property Valuation 2026](https://www.growthfactor.ai/resources/blog/ai-property-valuation)
- [Energent.ai — AI Tools for Market Analysis Real Estate 2026](https://www.energent.ai/energent/compare/en/ai-tools-for-market-analysis-real-estate)
- [esferasoft — How AI is Changing Real Estate USA 2026](https://www.esferasoft.com/blog/how-ai-is-changing-real-estate-in-usa/)

---

## 13. Insurance & Strategic Framing (Iteration 9)

### 13.1 Insurance Underwriting & Claims

**Adoption:** 22% of insurers plan agentic AI in production by end of 2026. Market growing from $5.76B (2025) to $7.26B (2026) — **26% YoY growth**.

**The multi-agent underwriting loop (McKinsey framework):**
1. **Intake agent** — ingests submission data
2. **Risk profiling agent** — builds comprehensive risk profiles
3. **Pricing/product agent** — structures the policy
4. **Compliance agent** — reviews for regulatory adherence
5. **Decision orchestrator** — aggregates input; routes to auto-approval or human escalation

**Results:** Quote-to-bind times reduced by up to **99%** (days → minutes).

**Actuarial applications:** AI agents eliminate the data gathering and cleaning bottleneck that consumes 60–80% of actuarial time, reading financial statements, claims reports, and policy documents to extract and structure actuarial metrics.

**Human role shift:** Underwriters reposition as **portfolio strategists and complex risk specialists**, supported by agents handling volume processing.

---

### 13.2 The "Self-Improvement Loopy Era" — Karpathy's Strategic Framing

Karpathy's term for this moment: the **"self-improvement loopy era"** — where agents running continuous self-improvement loops on code and research become standard across frontier labs and eventually every organization.

**What this means for business strategy:**
- The unit of optimization is no longer a human experimenter's time — it is **compute + loop speed**
- Organizations that can define measurable metrics for their core value drivers and wire up a loop will compound improvements at machine speed
- The bottleneck shifts from *running experiments* to *choosing what to optimize* — a fundamentally strategic, human activity
- Every competitive advantage becomes more ephemeral: if a loop can find it, competitors can run the same loop

**Karpathy's vision for the future:**
> "Make autoresearch asynchronously massively collaborative for agents — think SETI@home style — emulating a research community rather than a single PhD student."

**Agentic engineering (2026 framing):** "Humans no longer write most code. Instead, they direct, supervise, and orchestrate agents." The same shift is happening in research, marketing, finance, and operations.

---

### 13.3 Cross-Industry Summary Table

| Industry | Key Loop | Metric | Documented Result |
|----------|----------|--------|------------------|
| Software (Shopify) | Code optimization | Latency µs | −53% parse time |
| ML research | Architecture/hyperparam | Validation loss | 20 optimizations in 700 experiments |
| Marketing (email) | Copy variants | Reply rate | 2–4% → 8–12% |
| Marketing (landing page) | Headline/CTA | CVR | 15–40% lift |
| Financial trading | Strategy params | Win rate | 31% → 55% |
| Banking | KYC/AML workflows | Throughput | 200–2,000% productivity gain |
| Insurance | Underwriting flow | Quote-to-bind time | −99% (days → minutes) |
| Drug discovery | Molecular structure | Binding affinity | −40% cost, −60% timeline |
| Healthcare ops | Scheduling/documentation | Clinician time | 66 min/day recovered |
| Energy | Grid/maintenance | Downtime / efficiency | Real-time autonomous dispatch |
| Sales CRM | Lead scoring | Qualified meetings | 3× in 30 days |
| Legal | Contract review | Cycle time / risk capture | $10–25M recovered per $500M portfolio |
| Supply chain | Scheduling/inventory | Downtime, cost | 50%+ of executives deploying agents |

---

## Sources (Iteration 9)

- [NextBigFuture — Karpathy on Self-Improvement Loopy Era](https://www.nextbigfuture.com/2026/03/andrej-karpathy-on-code-agents-autoresearch-and-the-self-improvement-loopy-era-of-ai.html)
- [Fortune — Why Everyone Is Talking About Karpathy's Autonomous AI Research Agent](https://fortune.com/2026/03/17/andrej-karpathy-loop-autonomous-ai-agents-future/)
- [VentureBeat — Karpathy's Autoresearch: Revolutionary Implications](https://venturebeat.com/technology/andrej-karpathys-new-open-source-autoresearch-lets-you-run-hundreds-of-ai)
- [InsureTechTrends — 5 Ways Agentic AI Is Transforming Insurance Underwriting](https://insuretechtrends.com/5-ways-agentic-ai-is-transforming-insurance-underwriting-in-2026/)
- [PYMNTS — AI Agents Running the Back Office at Insurance Giants](https://www.pymnts.com/artificial-intelligence-2/2026/ai-agents-are-now-running-the-back-office-at-insurance-giants/)
- [Vantage Point — Insurtech Trends 2026: Claims and Underwriting](https://vantagepoint.io/blog/sf/insights/insurtech-trends-2026-ai-claims-underwriting)
- [Roots.ai — Insurance AI Predictions 2026](https://www.roots.ai/blog/10-insurance-ai-predictions-2026-forecasting-shift-from-promise-performance)
- [StartupHub.ai — Karpathy Auto-Research AI Self-Improvement](https://www.startuphub.ai/ai-news/ai-research/2026/andrej-karpathy-s-auto-research-ai-self-improvement)
- [TeamDay.ai — Self-Improving AI Agents from Karpathy's Lab](https://www.teamday.ai/blog/self-improving-ai-agents-karpathy-atlas)

---

## 14. Paid Advertising & Adoption Barriers (Iteration 10)

### 14.1 Paid Advertising Creative Optimization

One of the most direct business applications of the autoresearch loop is **programmatic ad creative optimization**.

**The advertising autoresearch loop:**
- *Artifact:* Ad creative (image, copy, headline, CTA)
- *Metric:* Cost per acquisition (CPA), return on ad spend (ROAS), or click-through rate
- *Platform:* Meta, Google, TikTok — their native optimization engines already operate this way
- *Loop cadence:* Real-time, continuous

**Roberto Nickson's framing (quoted widely in the community):**
> "Karpathy just open-sourced the pattern that will turn every business function into a self-optimizing loop. The 'autoresearch' model applied to advertising: you define success (purchases, app installs, whatever) and set a budget. Meta/Google/TT's infinite-content-machine generates thousands of ad variations, tests real-time against live audiences, keeps what works, kills what doesn't. A 'campaign' moves from a fixed asset to a living organism ever-evolving toward your stated goals."

**Volume transformation (Eric Siu, Single Grain):**
> "Most marketing teams run ~30 experiments a year. The next generation will run 36,500+. Easily. They'll run experiments while they sleep."

---

### 14.2 Enterprise Adoption Barriers

**100% of enterprises plan to expand agentic AI adoption in 2026** (CrewAI survey), yet 79% face adoption challenges — a double-digit increase from 2025.

**Top barriers:**

| Barrier | % Reporting |
|---------|-------------|
| Integration with existing systems | 46% |
| Data readiness / integration challenges | 35% |
| Insufficient talent/skills | 33% |
| Security and risk concerns | Top barrier overall |
| No formal plan for supervising agents | 36% of executives |
| Can't immediately "pull the plug" on rogue agent | 35% of executives |

**Cultural friction:**
- 54% of C-suite executives say AI adoption is "tearing their company apart"
- 29% of employees (44% of Gen Z) admit to actively **sabotaging** their company's AI strategy
- Primary fear: job elimination

**Key implementation lessons (what succeeds):**
1. Start with governed pilots in areas with **documented ROI**
2. Get data infrastructure right *before* scaling
3. Measure everything; be willing to shut down what doesn't work
4. Hybrid approach: 47% combine off-the-shelf agents with custom development
5. Spread super-user practices enterprise-wide — the failure mode is usually *not* lack of talent but lack of systems to scale what's working

**Gartner hype cycle position (2026):** Agentic AI is at the Peak of Inflated Expectations — real enterprise deployments are working but the gap between aspiration and systematic scale is still wide for most organizations.

---

## Sources (Iteration 10)

- [Writer.com — Enterprise AI Adoption 2026: Why 79% Face Challenges](https://writer.com/blog/enterprise-ai-adoption-2026/)
- [Gartner — Hype Cycle for Agentic AI 2026](https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai)
- [BusinessWire — 100% of Enterprises Plan to Expand Agentic AI (CrewAI Survey)](https://www.businesswire.com/news/home/20260211693427/en/Agentic-AI-Reaches-Tipping-Point-100-of-Enterprises-Plan-to-Expand-Adoption-in-2026-New-CrewAI-Survey-Finds)
- [WEF — 3 Obstacles to Agentic AI Adoption](https://www.weforum.org/stories/2025/12/3-obstacles-to-ai-adoption-and-innovation-and-how-to-overcome-them/)
- [CIO — Agentic AI in 2026: More Mixed Than Mainstream](https://www.cio.com/article/4107315/agentic-ai-in-2026-more-mixed-than-mainstream.html)
- [McKinsey — State of AI Trust in 2026](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/state-of-ai-trust-in-2026-shifting-to-the-agentic-era)
- [Roberto Nickson on X — Autoresearch Applied to Advertising](https://x.com/rpnickson/status/2030881849472340280)
- [VentureBeat — Karpathy's Autoresearch: Revolutionary Implications](https://venturebeat.com/technology/andrej-karpathys-new-open-source-autoresearch-lets-you-run-hundreds-of-ai)
- [MindStudio — Autonomous Marketing Optimization Agent](https://www.mindstudio.ai/blog/autonomous-marketing-optimization-agent-autoresearch-loop)
- [Fortune — 'The Karpathy Loop': 700 Experiments, 2 Days](https://fortune.com/2026/03/17/andrej-karpathy-loop-autonomous-ai-agents-future/)
