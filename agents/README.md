# MPA Deal Intelligence - Multi-Agent System

A multi-agent system using the Anthropic Agent SDK to automate M&A deal intelligence for Morrison Park Advisors (MPA). The system identifies transaction signals, conducts deep research, and maps relationship networks for Atlantic Canada mid-market companies.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                        │
│  - Understands Ken's current priorities                      │
│  - Routes tasks to appropriate specialized agents            │
│  - Maintains persistent memory (Supabase)                    │
│  - Surfaces highest-priority opportunities                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PROSPECTOR   │    │   RESEARCHER  │    │   CONNECTOR   │
│    AGENT      │    │     AGENT     │    │     AGENT     │
├───────────────┤    ├───────────────┤    ├───────────────┤
│ - Scans news  │    │ - Deep dives  │    │ - Maps        │
│ - Finds       │    │ - Validates   │    │   relationships│
│   signals     │    │   claims      │    │ - Finds intro │
│ - Builds      │    │ - Competitor  │    │   paths       │
│   market maps │    │   analysis    │    │ - Tracks      │
│ - Scores      │    │ - Technical   │    │   shared      │
│   readiness   │    │   diligence   │    │   investors   │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌───────────────────┐
                    │    SUPABASE DB    │
                    │  (Persistent      │
                    │   Memory)         │
                    └───────────────────┘
```

## Agent Roles

### Prospector Agent
**Role**: Find new companies with transaction signals, build market maps

**Signal Types Detected**:
- **Sell-side**: Owner age 60+, long tenure, no successor, legacy/philanthropy, slowing operations
- **Buy-side**: M&A announcements, hired VP BD, new CEO with growth mandate, PE backing
- **Growth**: New contracts, expansion, "fastest growing" lists, capital-intensive projects

### Researcher Agent
**Role**: Deep research on priority companies

**Outputs**:
- Comprehensive company profiles
- Succession Scorecard (5 dimensions)
- Competitive analysis
- Comparable transactions
- Potential acquirer identification

### Connector Agent
**Role**: Map relationships and identify warm introduction paths

**Relationship Types**:
- Shared investors (PE firms, family offices)
- Board connections
- Conference/speaking circuit
- Philanthropy/university connections
- Professional advisors (lawyers, accountants)
- Alumni networks

## Setup

1. **Install dependencies**:
   ```bash
   cd agents
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the system**:
   ```bash
   # Daily prospecting
   npm run orchestrator -- --prospect

   # Research a company
   npm run orchestrator -- --research "Company Name"

   # Build market map
   npm run orchestrator -- --market-map "Manufacturing" "NS"

   # Find introduction path
   npm run orchestrator -- --intro "Company Name"

   # Pipeline review
   npm run orchestrator -- --pipeline
   ```

## Usage Examples

### Daily Prospecting
```bash
npm run orchestrator -- --prospect
```
Scans for new signals across Atlantic Canada and updates the pipeline.

### Company Research
```bash
npm run orchestrator -- --research "Imperial Manufacturing Group"
```
Conducts deep research and maps connections to the company.

### Market Map
```bash
npm run orchestrator -- --market-map "Seafood" "NS"
```
Maps all players in the Nova Scotia seafood industry.

### Custom Task
```bash
npm run orchestrator -- "Find companies in the tech sector with succession signals"
```

## Database Schema

The system uses these Supabase tables:

**Core Tables** (existing):
- `companies` - Company profiles with succession scores
- `key_people` - Executives, owners, board members
- `research_sources` - All sources with URLs
- `potential_acquirers` - Strategic & PE buyers
- `user_feedback` - Ken's scoring of outputs

**Multi-Agent Tables** (new):
- `investors` - PE firms, family offices, strategics
- `company_investors` - Links companies to investors
- `signals` - Transaction signals tracked over time
- `connections` - Warm introduction paths
- `pipeline` - Deal pipeline state

## Development

### Run individual agents
```bash
npm run prospector -- "Scan for sell-side signals in manufacturing"
npm run researcher -- "Imperial Manufacturing Group"
npm run connector -- "Imperial Manufacturing Group"
```

### Run tests
```bash
npm test
```

### Type checking
```bash
npm run typecheck
```

## Success Metrics

From Ken's POC evaluation criteria:
- **Novelty Score** > 2.5/5 (information Ken didn't already know)
- **Accuracy Score** > 4/5 (verifiable with source citations)
- **Actionability Score** > 3/5 (clear next steps)

## Critical Requirements

1. **Every data point MUST have a source URL** - Non-negotiable for M&A credibility
2. **Rate confidence honestly** (high/medium/low)
3. **Note information gaps** explicitly
4. **Focus on mid-market** ($10M-$500M revenue)
