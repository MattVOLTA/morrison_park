# Morrison Park -- Project Log

> Chronological record of project events across all data sources.
> Use `/log` to add new entries. Use `/log refresh` to pull recent events from external sources.

---

## March 2026

### 2026-03-29 — Session: Ken email recap and relationship status check

> Reviewed and summarized Ken Skinner's last 5 emails chronologically (March 9–24) to re-establish context on the relationship state and outstanding threads.

- **Type**: session
- **Discovered**:
  - Ken's March 9 NFLD feedback proposed three engines: (1) refine current search, (2) real-time monitoring/alerts, (3) CRM ideation/prediction layer
  - Ken asked March 10 about switching from ChatGPT to Claude for Morrison Park's work
  - Ken forwarded an AI cold outreach email March 12, impressed by quality — "this is relevant to what we are doing"
  - Ken's March 24 reply: back from Spring Break, finds Claude comparison helpful, believes AI stronger on words than numbers, subscribes to Bloomberg/S&P Capital IQ/Pitchbook, onboarding MadeMarket CRM, wants to connect in Halifax
- **Sources**: Gmail search `from:kskinner@morrisonpark.com` → 5 messages (19cd5063db73ea07, 19cd89553e61fc23, 19ce1f952a0bc566, 19ce2137b2e58fad, 19d1d56796da26f9)
- **Next**: Reply to Ken's March 24 email — acknowledge AI/numbers insight, note MadeMarket integration potential, lock down Halifax visit date

---

### 2026-03-15 — Session: Epic #20 complete, Gen 1 re-enrichment, email to Ken

> Closed all 4 phases of Epic #20 (Ken's NFLD trip feedback). Shipped pipeline stages, entity matching, dashboard UI enhancements, re-enriched all 18 Gen 1 companies, added markdown rendering, and emailed Ken with a full update and call request.

- **Type**: session
- **Created**:
  - PR [#27](https://github.com/MattVOLTA/morrison_park/pull/27) — dashboard UI enhancements (company narrative, succession evidence, sources placeholder)
  - 54 key_people records + 192 research_sources records across 18 Gen 1 companies → Supabase
  - 7 new transaction signals (BA Richard acquired, Elanco sold to Merck, ICPEI acquired by Desjardins, Northumberland MBO, Site 20/20 growth investment, MacLeod Lorway/Cal LeGrow merger, City Wide/Telus acquisition)
  - Email to Ken: "Dashboard updates + let's talk about the three engines" → Gmail 19cf39b57da57cd4
  - Todoist task: "Waiting for reply: Ken Skinner" with waiting-reply label
- **Modified**:
  - `idea_cards/index.html` — renderMarkdown() function converts raw markdown to styled HTML in Company Profile section
  - `idea_cards/index.html` — succession scorecard shows owner age, tenure years, next-gen names alongside scores
  - `idea_cards/index.html` — research sources section always renders with placeholder for empty companies
- **Resolved**:
  - Epic #20 closed (all 4 phases: #21 pipeline/revenue, #22 entity matching, #23 UI enhancements, #24 re-enrichment)
  - Phase 3 browser-verified in Chrome: company narrative, succession evidence, and sources all rendering correctly
  - Markdown rendering fixed (was showing raw `##` and `**` syntax)
- **Discovered**:
  - Phase 4 enrichment uncovered several post-transaction companies: Elanco ($1.75B CAD to Merck), ICPEI (Desjardins), BA Richard (Champlain Seafood), City Wide (Telus/Altima)
  - All 36 companies now have 10+ research sources (was 0 for 18 Gen 1 companies)
- **Sources**: GitHub PRs #25/#27, Supabase MCP, Gmail (Google Workspace MCP), Chrome browser tools
- **Next**:
  - [ ] Call with Ken to discuss three engines (search refinement, real-time monitoring, CRM ideation)
  - [ ] Confidence ratings with source info behind revenue/employee estimates
  - [ ] Full company address + contact info for key person (deferred to Amberly)

---

## February 2026

### 2026-02-27 — Session: Dashboard UX upgrades, one-pager template, Ken call follow-up

> Shipped filter persistence and LinkedIn expand on person cards. Built MPA-style one-pager template modeled on Ken's analyst format. Pulled Ken's meeting transcript, downloaded his one-pager PDF, and drafted follow-up email.

- **Type**: session
- **Created**:
  - MPA-style one-pager template (`idea_cards/one-pager.html`) with teal section bars, footnoted citations, print-friendly layout
  - Gmail draft to Ken summarizing dashboard updates and next steps
- **Modified**:
  - `idea_cards/index.html` — filter persistence via localStorage (province, sort-by, pipeline stage survive refresh)
  - `idea_cards/index.html` — expandable LinkedIn intel on person cards with chevron toggle
  - `idea_cards/index.html` — "View One-Pager" link in company header
  - `netlify.toml` — removed catch-all rewrite that blocked one-pager route
- **Discovered**:
  - Ken sent one-pager PDF ("Newfoundland and Labrador Outreach List - March 2, 2026") with 13 NL companies for upcoming trip
  - Ken's analyst format: Company Overview, Products/Services, Capital Raising, M&A Activity, Management & Board (two-col), Company News (footnoted), Industry Tailwinds
  - Netlify `status: 200` rewrites override static file serving — must remove catch-all for multi-page static sites
- **Resolved**: Fireflies transcript from today's 30-min call with Ken — captured action items and priorities
- **Sources**: Fireflies MCP, Gmail (Google Workspace MCP), GitHub PR [#18](https://github.com/MattVOLTA/morrison_park/pull/18), Netlify deploy preview
- **Next**:
  - [ ] Debug one-pager "Loading..." state on deploy preview (Supabase query may be failing)
  - [ ] Merge PR #18 to deploy one-pager to production
  - [ ] Populate one-pager with real company data and test PDF export
  - [ ] Add source citations to existing company profiles per Ken's feedback

---

### 2026-02-22 — Session: Pipeline self-service shipped + Ken notified

> Built and shipped pipeline edit form, stage filter, and sidebar badges for the dashboard. Emailed Ken with walkthrough of new features. Updated Todoist tasks.

- **Type**: session
- **Created**:
  - Pipeline edit form with 6 fields (stage, priority, client type, next action, date, notes) → [idea_cards/index.html](idea_cards/index.html)
  - Sidebar stage filter dropdown with 8 pipeline stages + "No Status" option
  - Pipeline stage badges on sidebar company items
  - `submitPipeline()` JS handler following existing `submitFeedback()` upsert pattern
  - PR [#5](https://github.com/MattVOLTA/morrison_park/pull/5) on branch `feature/4-pipeline-self-service`
- **Modified**:
  - `company_dashboard_view` — added `pipeline_priority` column via migration → Supabase
  - Pipeline data defaults — set `priority=3, client_type=sell_side` for all 31 companies → Supabase
  - `applyFilters()` — added stage filtering with province+stage combination support
  - CLAUDE.md — added Todoist integration docs (correct env file, token var, API version, section IDs)
- **Resolved**: Todoist API integration — was using wrong env file (`Laurie/.env`) and wrong var name (`TODOIST_API_KEY`). Corrected to `Morrison Park/.env` with `TODOIST_API_TOKEN` and REST v1 API.
- **Sources**: Supabase MCP, GitHub (`gh`), Gmail (Google Workspace MCP), Todoist REST v1 API
- **Next**:
  - [ ] Merge PR #5 after confirming Netlify preview
  - [ ] Build St. John's NL regional scan (due before call with Ken)
  - [ ] Ken to review pipeline status for all 31 companies
  - [ ] Ken to confirm call time (Thu Feb 26 or Fri Feb 27)

---

### 2026-02-22 -- Todoist project created with initial tasks
- **Source**: Todoist
- Created Morrison Park project (ID: `6g4JH95McmPHjwGV`) with 4 tasks: Reply to Ken's Feb 17 follow-up email, Build St. John's regional test, Schedule call with Ken to discuss next steps, Refine enricher skill based on Ken's Dec 4 feedback

### 2026-02-22 -- Session: Saint John NB regional scan complete

> Ran first agent team scan for Saint John, New Brunswick. 6 companies researched in parallel using 3-agent team, saved to Supabase and markdown. Also cleaned up 2 duplicate database records.

- **Created**: 6 company profiles for Saint John NB region:
  - [Crosby Foods](idea_cards/04_crosby_foods.md) -- food mfg, 5th gen family, $20M rev, growth mode (14/25)
  - [Eddy Group](idea_cards/05_eddy_group.md) -- wholesale distribution, 130 years, HQ fire May 2024 (16/25)
  - [Bourque Industrial](idea_cards/06_bourque_industrial.md) -- metal fabrication, 3rd gen, Ontario expansion (15/25)
  - [Groupe Savoie](idea_cards/07_groupe_savoie.md) -- hardwood mfg, $150M+, founder ~75, actively acquiring (17/25)
  - [Rodd Hotels & Resorts](idea_cards/08-rodd-hotels-resorts.md) -- hospitality, 3rd gen, 7 properties (15/25)
  - [Arrow Construction Products](idea_cards/09-arrow-construction-products.md) -- construction distribution, 47 years (16/25)
- **Resolved**: Merged duplicate records: "Northumberland Ferries" + "Northumberland Ferries Limited" into 1 record; "CoLab" + "CoLab Software" into 1 record. Ken's feedback preserved on both.
- **Decided**: Corrected scan region from St. John's NL to Saint John NB. NL scan was rolled back (6 companies deleted from Supabase + markdown files removed).
- **Discovered**: Agent teams (TeamCreate) work well for parallel company research. 3 researchers completing 2 companies each in ~10 minutes total.

**Sources**: Perplexity deep research + search, Supabase MCP, morrison_park database

**Next**:
- [ ] Deploy dashboard so Ken can see NB results
- [ ] Schedule call with Ken once he confirms a time
- [ ] Refine enricher skill based on Ken's Dec 4 feedback

---

### 2026-02-22 -- Replied to Ken, committed to St. John's scan

> Ran full data source sync, confirmed Ken's Feb 17 follow-up was still unanswered, drafted and sent a reply committing to a St. John's regional scan today and proposing call times.

- **Resolved**: Replied to Ken's Feb 17 follow-up email (5 days unanswered) → Gmail message `19c85bbec93d2010` in thread `19aa25eb02e84a4b`
- **Discovered**: No new emails, meetings, or transcripts with Ken since Feb 17. All action items already tracked in Todoist.

**Sources Consulted**
- Todoist: 4 open tasks in Morrison Park project (`6g4JH95McmPHjwGV`), p4 reply task due Feb 24
- Gmail: Fetched full Ken thread, confirmed Feb 17 is most recent from Ken
- Calendar: Checked Feb 23 – Mar 5, identified open slots for call (Thu Feb 26 3PM, Fri Feb 27 11AM)
- Fireflies: No new transcripts with Ken since Dec 2025

**Next Steps**
- [ ] Run atlantic-company-enricher for St. John's NL companies (promised Ken today)
- [ ] Update Netlify dashboard with St. John's results
- [ ] Call with Ken once he confirms a time

---

### 2026-02-17 -- Ken follows up asking to push pilot forward
- **Source**: Gmail
- Ken emailed asking what he can do to push the pilot forward. Noted he's been "impressed with the results and keen to refine further and put into practice." Hoping to visit Halifax but possibly not until late March.

---

## January 2026

### 2026-01-13 -- Batch 4 company research: health/tech companies added to Supabase
- **Source**: Supabase
- Researched and stored 10 companies: Planetary Technologies (NS), City Wide Communications (NS), Phillips Foods Canada (NB), Novagevity/Sperri (NS), NovaResp Technologies (NS), CoLab (NL), ABK Biomedical (NS), Sparrow BioAcoustics (NL), MedReddie (NS), Tracktile (PEI)

### 2026-01-12 -- Ken rates iteration as "exceptional"
- **Source**: Gmail
- Ken emailed: "In short, this is exceptional. Highly additive to our existing systems. There are several things here that are new to me and actionable."
- Requested a St. John's regional test for an upcoming BD trip. Asked if system could identify action items by region. Planning Halifax visit before end of Feb.

### 2026-01-12 -- Ken's detailed feedback scores recorded in Supabase (Batch 2)
- **Source**: Supabase
- Scored 10 companies: BA Richard (4/5/3), Imperial Manufacturing Group (5/4/5 -- gold standard), Northumberland Ferries Limited (3/1/1), Maritime Truss (3/5/3), CKF Inc (4/1/4), CBCL Limited (2/3/4), Site 20/20 (5/1/4), CoLab Software (3/2/4), AlterBiota (3/5/4), Nova Leap (3/5/4), Mysa (3/5/4), Elanco (1/5/2)
- Imperial Manufacturing Group scored highest: found BEFORE any transaction activity, novel to Ken, immediately actionable

### 2026-01-09 -- Ken's feedback scores recorded in Supabase (Batch 1)
- **Source**: Supabase
- First batch of feedback: MacLeod Lorway (4/5/4), Cal LeGrow (4/5/4), Northumberland Ferries (5/1/1 -- accurate but already known), Stevens Group (4/4/3)

### 2026-01-02 -- Matt resends dashboard link after Ken lost the email
- **Source**: Gmail
- Ken emailed on Jan 1 saying he lost the previous email with the dashboard link. Matt resent the Netlify dashboard link on Jan 2 with instructions to rate companies.

### 2026-01-02 -- Git: fix duplicate Supabase declaration error
- **Source**: GitHub
- Commit `c072bdb`: fix resolve duplicate supabase declaration error

### 2026-01-02 -- Batch 3 company research added to Supabase
- **Source**: Supabase
- Researched and stored 7 companies: Site 20/20 (NS), AlterBiota (NS), Northumberland Ferries (PEI), Nova Leap Health Corp (NS), Cal LeGrow Insurance (NL), MacLeod Lorway Financial Group (NS), Mysa Smart Thermostats (NL)

---

## December 2025

### 2025-12-18 -- Ken & Andy meeting: ecosystem connections
- **Source**: Fireflies
- 49-minute call between Ken Skinner and Andy Farnsworth. Covered Morrison Park's role as independent investment bank, Virtual Hallway's healthcare potential, Volta Builders Network, and Newfoundland ecosystem connections.
- Action items: Ken to follow up with Virtual Hallway CEO, inform Andy of St. John's travel plans. Andy to connect Ken with NL ecosystem contacts (Technel, Genesis), share Volta Builders Network link.

### 2025-12-15 -- Lark Max microphone email exchange
- **Source**: Gmail
- Ken asked Matt about a Lark Max microphone for meeting transcription. Multi-message exchange about the hardware and Fireflies integration.

### 2025-12-08 -- Ken asks about microphone for meetings
- **Source**: Gmail
- Ken emailed about a "nifty microphone" he saw, sparking conversation about meeting capture tools.

### 2025-12-06 -- Batch 2 company research added to Supabase
- **Source**: Supabase
- Researched and stored 7 companies: Northumberland Ferries Limited (PEI), BA Richard (NB), CKF Inc (NS), Maritime Truss Limited (NS), CoLab Software (NL), Elanco Aquaculture (PEI), ICPEI (PEI)

### 2025-12-05 -- Batch 1 company research added to Supabase
- **Source**: Supabase
- First companies stored in database: Imperial Manufacturing Group (NB), Stevens Group of Companies (NS), CBCL Limited (NS)

### 2025-12-05 -- Git: multi-agent system and project reorganization
- **Source**: GitHub
- 4 commits on this date: implemented multi-agent system for M&A deal intelligence, added high autonomy mode to all agents, improved message handling in orchestrator, reorganized project structure and added slash commands

### 2025-12-04 -- Ken sends massive detailed feedback ("the big purge")
- **Source**: Gmail
- Ken's longest email of the project. Provided exhaustive feedback on all company profiles (IMG, Stevens, CBCL, Acadian, Protocase, Emmerson, Sustainable Blue). Key feedback themes:
- Expanded client types beyond sell-side: buy-side (acquisition targets) and growth (capital raise) mandates
- Requested consistent sections across reports: major customers, geographies, competitive advantages
- Highlighted value of shared investor maps (Jim Lawley / Robert Richardson across Sustane, Oberland, Sustainable Blue)
- Suggested Insights Podcast and AllNovaScotia as data sources

### 2025-12-02 -- Ken provides 3 test companies + deep context
- **Source**: Gmail
- Ken sent detailed context on Acadian Seaplants, Protocase, and Emmerson Packaging as test companies, plus bonus company Sustainable Blue. Included proprietary knowledge about each: JP Deveau's reticence, Doug Milburn's billion-dollar ambition, Emmerson owner's US growth plans, Sustainable Blue's closed aquaculture system.

### 2025-12-02 -- Matt sends company profiles via Netlify dashboard
- **Source**: Gmail
- Matt shared the dashboard link (morrison-park.netlify.app) showing AI-generated profiles of Ken's test companies. Asked Ken to evaluate what was missing vs. what was valuable.

### 2025-12-02 -- Git: idea cards and Netlify deployment
- **Source**: GitHub
- 3 commits: added comprehensive M&A intelligence for four Atlantic Canada companies, added original company profiles with enrichment skill documentation, added Netlify configuration to serve idea cards dashboard

### 2025-12-01 -- Matt sends first ICP doc + initial idea cards
- **Source**: Gmail
- Matt shared an Ideal Customer Profile via Coda doc. Also sent initial idea cards from the system. Ken responded: "Wow! For a first attempt this is quite impressive."

### 2025-12-01 -- Git: initial commit
- **Source**: GitHub
- Commit `620960c`: Initial commit: Morrison Park Advisors AI POC foundation

---

## November 2025

### 2025-11-30 -- Ken sends "Informed Ideation OS" executive summary
- **Source**: Gmail
- Ken articulated his full vision: "Informed Ideation OS" that fuses CRM with public data to propose evidence-backed ideas (M&A pairings, capital solutions, partnerships, exec placements). Two-step plan: (1) build comprehensive market maps, (2) build predictive ideation algorithm. Concluded: "I would be excited to work on this with you. Let's build it!"

### 2025-11-25 -- Seasoned Pros next steps email (Ken cc'd)
- **Source**: Gmail
- Kevin MacIntyre from Seasoned Pros sent next steps email with Ken cc'd. Ken was introduced to Volta's program through the Seasoned Pros engagement.

### 2025-11-24 -- Matt responds to Ken's interest in Volta program
- **Source**: Gmail
- Matt proposed a 30-min discovery call to discuss MPA going through Volta's program. Offered Nov 26 time slots.

### 2025-11-24 -- Ken emails about putting MPA through Volta's program
- **Source**: Gmail
- Ken responded in the "New name for program!" thread, expressing interest in MPA participating. Also sent a separate email ("Matt | Ken") the same day.

### 2025-11-20 -- Ken's initial email asking to join Volta's program
- **Source**: Gmail
- Ken emailed Matt after a Seasoned Pros session: "I only half joked about my firm, MPA, going through this program and now I am not joking at all!" Asked Matt to consider having an investment bank go through the program.

### 2025-11-12 -- Seasoned Pros meeting (Ken involved)
- **Source**: Gmail
- Calendar hold and related emails for a Seasoned Pros session. Ken was included as a participant alongside Volta team (Matt, Jaco, J. Curry) and Seasoned Pros team (Kevin, Rick, Eric).

### 2025-11-10 -- AI development email thread (Seasoned Pros context)
- **Source**: Gmail
- Multi-party email thread about "AI development" involving Ken, Kevin MacIntyre (Seasoned Pros), Rick Emberley, and Volta team. Ken contributed context about Morrison Park's AI implementation needs.

### 2025-11-07 -- Ken responds in AI development thread
- **Source**: Gmail
- Ken replied in the Seasoned Pros AI development thread with context about his firm's needs.

### 2025-11-06 -- AI2Market intro and AI development discussions
- **Source**: Gmail
- Ken emailed about AI2Market intro (forwarded from Jeff Larsen at Dalhousie). Separate AI development thread discussion about Seasoned Pros engagement.

### 2025-11-05 -- Rick Emberley starts AI development thread
- **Source**: Gmail
- Rick Emberley (Seasoned Pros) initiated the "AI development" email thread with Matt, Kevin, Eric, and Ken cc'd.

---

## October 2025

### 2025-10-31 -- Meeting follow-up (Seasoned Pros)
- **Source**: Gmail
- Rick Emberley emailed Matt and Ken about "Today's meeting." Matt replied the same day. Part of the Seasoned Pros engagement context.

### 2025-10-24 -- Ken forwards AI2Market intro
- **Source**: Gmail
- Ken forwarded an "Intro for AI2Market" email to Matt (cc: J. Curry). Matt was OOO and sent a delayed response.

### 2025-10-06 -- AI2Market intro thread continues
- **Source**: Gmail
- Matt responded to Ken's AI2Market intro forwarded from Jeff Larsen.

### 2025-10-04 -- Ken follows up on AI2Market intro
- **Source**: Gmail
- Ken sent another message in the AI2Market intro thread.

---

## September 2025

### 2025-09-16 -- Email exchange about AI2Market
- **Source**: Gmail
- Matt and Ken exchanged messages about AI2Market intro. Ken provided additional context.

### 2025-09-12 -- Ken continues AI2Market thread
- **Source**: Gmail
- Ken emailed further details in the AI2Market intro thread.

### 2025-09-11 -- Ken continues AI2Market thread
- **Source**: Gmail
- Ken sent another message about AI2Market.

### 2025-09-09 -- Ken continues AI2Market thread
- **Source**: Gmail
- Ken emailed about AI2Market introduction.

---

## August 2025

### 2025-08-29 -- Ken follows up after initial meeting
- **Source**: Gmail
- Ken emailed Matt the day after their first call, continuing the AI2Market intro discussion thread.

### 2025-08-28 -- First meeting: Ken & Matt via Zoom
- **Source**: Fireflies
- 32-minute Zoom call. Ken presented Seasoned Pros, a recruiting agency with 12,000 professionals. Discussed AI potential in recruitment (ChatGPT Pro for job leads, agentic AI for candidate matching). Matt introduced Volta's revamped support program for AI startups. In-person meeting scheduled for September 23.
- This was the initial introduction -- Ken was connected to Matt through the Seasoned Pros engagement.

### 2025-08-27 -- Jeff Larsen introduces Ken and Matt
- **Source**: Gmail
- Jeff Larsen (Dalhousie) sent the original "Intro for AI2Market" email connecting Matt and Ken. Matt responded the same day.

---

*Log generated 2026-02-22 from Gmail, Fireflies, GitHub, Supabase, and Todoist.*
