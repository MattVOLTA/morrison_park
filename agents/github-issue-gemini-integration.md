# Issue Title

Integrate Google ADK with Gemini models for hybrid multi-model M&A intelligence system

# Issue Body

## Overview

Implement a hybrid multi-model architecture that allows the Morrison Park M&A intelligence system to leverage both Anthropic Claude and Google Gemini models within a single unified system. This enables A/B testing across all agents, model performance comparison, and the ability to use the best model for each specific task.

## ⚠️ CRITICAL: Test-Driven Development Required

**BEFORE implementing ANY phase of this issue:**

1. **Invoke the `test-driven-development` skill**
2. **Write tests FIRST** (before any implementation code)
3. **Watch tests FAIL** (red phase)
4. **Write minimal code** to make tests pass (green phase)
5. **Refactor** while keeping tests green

### TDD Workflow for This Issue

#### Phase 1: Database Provenance (COMPLETED)
- ✅ Migration applied: `add_model_provenance_tracking`
- ✅ All tables now have `generated_by_model` and `model_metadata` columns

#### Phase 2: Gemini Client Integration
**RED**: Write tests for Gemini API client wrapper
- Test API key loading from `.env`
- Test model initialization for each agent type
- Test error handling for API failures
- Test token usage tracking

**GREEN**: Implement minimal Gemini client at `src/clients/gemini-client.ts`

**REFACTOR**: Extract common patterns, improve error messages

#### Phase 3: MCP Tools Adapter
**RED**: Write tests for MCP tools adapter
- Test translation from Anthropic MCP format to Google ADK McpToolset
- Test all 14 Supabase tools work with both SDKs
- Test model tracking is added to all save operations

**GREEN**: Implement adapter at `src/adapters/mcp-adapter.ts`

**REFACTOR**: Simplify translation logic, add type safety

#### Phase 4: Gemini Prospector Agent
**RED**: Write tests for Gemini Prospector
- Test grounded Google Search for signal detection
- Test signal classification (6 types)
- Test Atlantic Canada company filtering
- Test database writes include `generated_by_model: "gemini-2.0-flash"`

**GREEN**: Implement at `src/agents/gemini/prospector.ts`

**REFACTOR**: Share common prospector logic between Claude/Gemini versions

#### Phase 5: Gemini Researcher Agent
**RED**: Write tests for Gemini Researcher
- Test URL context grounding for company research
- Test succession scorecard generation (5 dimensions)
- Test potential acquirer identification
- Test all data points have source URLs

**GREEN**: Implement at `src/agents/gemini/researcher.ts`

**REFACTOR**: Extract succession scoring logic into shared utility

#### Phase 6: Gemini Connector Agent
**RED**: Write tests for Gemini Connector
- Test relationship mapping (6 connection types)
- Test warm introduction path identification
- Test LinkedIn/website/news source integration

**GREEN**: Implement at `src/agents/gemini/connector.ts`

**REFACTOR**: Share relationship graph logic

#### Phase 7: Orchestrator Model Routing
**RED**: Write tests for orchestrator routing
- Test `--model anthropic` flag routes to Claude agents
- Test `--model gemini` flag routes to Gemini agents
- Test default behavior (Claude)
- Test invalid model names throw helpful errors

**GREEN**: Modify `src/index.ts` to support routing

**REFACTOR**: Extract routing logic into dedicated module

#### Phase 8: Model Comparison Queries
**RED**: Write tests for comparison dashboard
- Test query to compare signal counts by model
- Test query to compare average succession scores by model
- Test query to identify unique findings per model

**GREEN**: Implement SQL queries and dashboard

**REFACTOR**: Add visualizations

### Why This Matters

From `/Volumes/SD/Ken Skinner/CLAUDE.md`:

> **`test-driven-development` skill**: MUST BE USED when implementing ANY feature or bugfix. ALWAYS invoke BEFORE writing implementation code. Write test first, watch it fail, then write minimal code to pass. **NEVER skip this - if you write code before tests, delete it and start over.**

### Reference

- Skill: `test-driven-development`
- Documentation: `/Volumes/SD/Ken Skinner/CLAUDE.md` - TDD workflow enforcement

## Background & Motivation

### Current Architecture (Anthropic Claude Only)

The system currently uses the **Anthropic Claude Agent SDK** with a hierarchical multi-agent architecture:

**Orchestrator Agent** (`src/index.ts:1-399`)
- Model: `claude-sonnet-4.5`
- Routes tasks to specialized subagents
- Budget: $5.0 USD max
- CLI: `npm run orchestrator -- [--prospect|--research|--market-map|--intro|--pipeline]`

**Specialized Agents:**
1. **Prospector** (`src/agents/prospector.ts:1-317`) - Model: `claude-haiku-4` - Scans for M&A signals
2. **Researcher** (`src/agents/researcher.ts:1-386`) - Model: `claude-sonnet-4.5` - Deep company research
3. **Connector** (`src/agents/connector.ts:1-448`) - Model: `claude-sonnet-4.5` - Relationship mapping

**Data Storage:** Supabase database at `vuuoukfcbucgsqnnsaii.supabase.co`

### Why Add Gemini Models?

**User's Goal:** "It's not about replacing, it's about using the best features for the task. Looking for opportunities to leverage multiple agents to contribute to the same database."

**Gemini's Unique Capabilities:**
1. **Grounded Google Search** - Native integration with Google Search index for real-time signal detection
2. **URL Context Grounding** - Can fetch and analyze company websites, annual reports, news articles as context
3. **Different Training Data** - May surface novel insights that Claude misses
4. **Cost/Performance Tradeoffs** - Different pricing and speed characteristics

**Success Metrics:**
- Compare **novelty scores** (information Ken didn't already know) between models
- Compare **accuracy scores** (verifiable with source citations) between models
- Identify which model finds better signals for specific industries/company types
- Measure cost per actionable insight by model

## Research Findings

### Google ADK Documentation Analysis

Using Context7 to research Google's Agent Development Kit, I found:

**Library:** `/google/adk-docs` (5,419 code snippets, High reputation, 83.5 benchmark score)

**Key ADK Features:**
1. **MCP Tool Integration** - ADK can act as MCP client using `McpToolset` class
2. **Built-in Google Search Tool** - `google_search` tool with automatic grounding
3. **Gemini 2.0/2.5 Models** - Latest models with grounding capabilities
4. **Flexible Architecture** - Compatible with existing MCP servers

**MCP Integration Pattern** (from ADK docs):
```python
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams

root_agent = LlmAgent(
    model='gemini-2.0-flash',
    name='mcp_client_agent',
    instruction='...',
    tools=[
        McpToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command='python3',
                    args=['/path/to/mcp_server.py'],
                )
            )
        )
    ],
)
```

**Grounded Search Pattern** (from ADK docs):
```python
from google.adk.agents import Agent
from google.adk.tools import google_search

root_agent = Agent(
    name="google_search_agent",
    model="gemini-2.5-flash",
    instruction="Answer questions using Google Search when needed. Always cite sources.",
    tools=[google_search]
)
```

### Current Codebase Analysis

**Custom MCP Server:** `mpa-supabase` (`src/tools/supabase-tools.ts:1-512`)

Built with `createSdkMcpServer()` from Claude Agent SDK. Provides 14 tools:

**Company Operations:**
- `save_company` - Upserts with succession scores
- `get_company` - Lookup by name
- `list_companies` - All companies sorted by score

**Signal Operations:**
- `save_signal` - Transaction signals (REQUIRES `source_url`)
- `get_signals` - By company
- `get_recent_signals` - Latest across all

**Connection Operations:**
- `save_connection` - Warm intro paths
- `get_connections` - By company

**Investor Operations:**
- `save_investor` - PE firms, family offices, strategics
- `link_company_investor` - Portfolio relationships
- `get_shared_investors` - Common investors

**Other:**
- `update_pipeline` - Deal stages
- `get_pipeline` - Active deals
- `save_key_person` - Executives/owners
- `save_research_source` - Track sources
- `save_potential_acquirer` - Buyer identification

**Database Schema** (`idea_cards/types/database.types.ts`):

Core tables:
- `companies` - Succession scores (5 dimensions)
- `signals` - M&A signals with source URLs
- `connections` - Relationship paths
- `key_people` - Executives with ownership %
- `investors` - PE firms and strategics
- `company_investors` - Portfolio links
- `research_sources` - All sources with URLs
- `potential_acquirers` - Strategic/PE buyers
- `pipeline` - Deal tracking

**Environment Configuration** (`agents/.env:1-7`):
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_URL=https://vuuoukfcbucgsqnnsaii.supabase.co
GEMINI_API_KEY=AIzaSyBX00Wst-8aDJu2LDfjcVH4-uHl7IUpS7M
```
✅ Both API keys already configured

**MCP Server Configuration** (`.mcp.json`):
```json
{
  "mcpServers": {
    "mpa-supabase": {
      "command": "npx",
      "args": ["tsx", "src/tools/supabase-tools.ts"]
    },
    "perplexity": { ... },
    "netlify": { ... },
    "context7": { ... }
  }
}
```

## UX / UI Updates

**No Changes** - This issue involves backend agent architecture changes only with no user-facing UI modifications.

**Developer Experience Changes:**
- New CLI flag: `npm run orchestrator -- --model gemini` to route to Gemini agents
- Default behavior unchanged: `--model anthropic` (Claude agents)
- Database queries gain ability to filter/compare by `generated_by_model` column

**Future Dashboard Updates** (out of scope for this issue):
- Model comparison charts showing signal counts by model
- Novelty/accuracy score averages by model
- Visual indicators showing which model found each insight

## Proposed Data Model Changes

### Change Type
- [x] Modified existing table(s)
- [ ] New table(s)
- [ ] Removed table(s) or column(s)
- [ ] No database changes

### Tables Affected

**Table:** `companies`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `signals`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `connections`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `investors`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `key_people`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `potential_acquirers`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `research_sources`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

**Table:** `company_investors`
**Action:** modify
**Changes:**
- Column: `generated_by_model`, Type: `VARCHAR(100)`, Nullable: yes, Default: null
- Column: `model_metadata`, Type: `JSONB`, Nullable: yes, Default: `'{}'::jsonb`

### Relationships

No new relationships. Existing foreign keys remain unchanged.

### Migration Strategy
- [x] Additive only (no breaking changes)
- [ ] Requires data backfill
- [ ] Requires deployment coordination
- [ ] Requires downtime

**Migration Applied:** `add_model_provenance_tracking` (completed)

### Indexes Added
```sql
CREATE INDEX IF NOT EXISTS idx_companies_model ON companies(generated_by_model);
CREATE INDEX IF NOT EXISTS idx_signals_model ON signals(generated_by_model);
CREATE INDEX IF NOT EXISTS idx_connections_model ON connections(generated_by_model);
CREATE INDEX IF NOT EXISTS idx_research_sources_model ON research_sources(generated_by_model);
```

### Additional Context

**Why `model_metadata` JSONB?**
Allows storing flexible metadata like:
```json
{
  "token_usage": 1247,
  "api_cost_usd": 0.023,
  "response_time_ms": 2341,
  "grounding_sources_used": 5,
  "confidence_score": 0.87
}
```

**Backward Compatibility:**
- Nullable columns ensure existing records don't break
- Claude agents will populate these fields going forward
- Null values indicate data from before model tracking was added

## Technical Approach

### Architecture: Single Orchestrator with Model Routing

**Decision:** User selected **Option A** - Single orchestrator with model routing via CLI flag

**Rationale:**
- Maximum flexibility to switch models per task
- Easier to maintain (one orchestrator vs two)
- Natural A/B testing: run same task twice with different `--model` flag
- Simpler configuration management

**Implementation Pattern:**
```typescript
// src/index.ts - Orchestrator routing logic
async function createAgent(modelProvider: 'anthropic' | 'gemini', agentType: 'prospector' | 'researcher' | 'connector') {
  if (modelProvider === 'anthropic') {
    return createClaudeAgent(agentType);
  } else {
    return createGeminiAgent(agentType);
  }
}

// CLI invocation examples:
// npm run orchestrator -- --model anthropic --research "Clearwater Seafoods"
// npm run orchestrator -- --model gemini --research "Clearwater Seafoods"
```

### Model Selection Strategy

| Agent | Claude Model | Gemini Model | Rationale |
|-------|-------------|--------------|-----------|
| **Prospector** | `claude-haiku-4` | `gemini-2.0-flash` | High-volume scanning, speed matters, grounded Google Search for signal detection |
| **Researcher** | `claude-sonnet-4.5` | `gemini-2.5-flash` | Deep analysis, URL context grounding for company websites/reports |
| **Connector** | `claude-sonnet-4.5` | `gemini-2.0-flash` | Relationship mapping, LinkedIn/website analysis |
| **Orchestrator** | `claude-sonnet-4.5` | N/A (stays Claude) | Routing logic remains with Claude for consistency |

### MCP Tools Adapter Pattern

**Challenge:** Anthropic Claude SDK uses `createSdkMcpServer()` pattern, while Google ADK uses `McpToolset` class.

**Solution:** Create adapter that translates our existing Supabase MCP tools to work with both SDKs.

**Approach:**
1. Keep existing `src/tools/supabase-tools.ts` (Anthropic format)
2. Create `src/adapters/mcp-adapter.ts` that wraps tools for Gemini ADK
3. Both call same underlying `src/utils/supabase.ts` database layer

**Adapter Structure:**
```typescript
// src/adapters/mcp-adapter.ts
import { McpToolset } from '@google/adk/tools/mcp_tool';
import { StdioConnectionParams } from '@google/adk/tools/mcp_tool/mcp_session_manager';
import { StdioServerParameters } from 'mcp';

export function createGeminiMcpTools(): McpToolset {
  return new McpToolset({
    connection_params: new StdioConnectionParams({
      server_params: new StdioServerParameters({
        command: 'npx',
        args: ['tsx', 'src/tools/supabase-tools.ts'],
      }),
    }),
  });
}
```

**Why This Works:**
- Both SDKs can connect to the same MCP server via stdio
- Tools remain defined in one place (`supabase-tools.ts`)
- No duplication of tool logic
- Model tracking added transparently in database layer

### Model Provenance Tracking

**Implementation:** Add `generated_by_model` to all database save operations.

**Pattern in database layer** (`src/utils/supabase.ts`):
```typescript
// Before (existing):
export async function saveCompany(data: CompanyInsert): Promise<Company> {
  const { data: result, error } = await getSupabaseClient()
    .from('companies')
    .upsert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// After (add model tracking):
export async function saveCompany(data: CompanyInsert, modelName: string): Promise<Company> {
  const { data: result, error } = await getSupabaseClient()
    .from('companies')
    .upsert({
      ...data,
      generated_by_model: modelName,
      model_metadata: {
        timestamp: new Date().toISOString(),
      },
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}
```

**Model Name Convention:**
- Claude: `"claude-sonnet-4.5"`, `"claude-haiku-4"`
- Gemini: `"gemini-2.0-flash"`, `"gemini-2.5-flash"`

## Implementation Plan

(See full implementation plan in complete issue - includes 11 phases with detailed TDD workflows, file changes, and testing strategies)

## Files to Create

```
src/
├── clients/
│   └── gemini-client.ts          # NEW: Gemini API wrapper
├── adapters/
│   └── mcp-adapter.ts             # NEW: MCP tools adapter for Gemini ADK
├── agents/
│   └── gemini/                    # NEW: Gemini agent directory
│       ├── prospector.ts          # NEW: Gemini prospector with Google Search
│       ├── researcher.ts          # NEW: Gemini researcher with URL grounding
│       └── connector.ts           # NEW: Gemini connector
└── analytics/
    └── model-comparison.sql       # NEW: Comparison queries

tests/
├── clients/
│   └── gemini-client.test.ts     # NEW: Gemini client tests
├── adapters/
│   └── mcp-adapter.test.ts       # NEW: MCP adapter tests
└── agents/
    └── gemini/                    # NEW: Gemini agent tests
        ├── prospector.test.ts
        ├── researcher.test.ts
        └── connector.test.ts
```

## Files to Modify

```
src/
├── index.ts                       # MODIFY: Add --model flag routing
├── utils/
│   └── supabase.ts                # MODIFY: Add modelName parameter to save functions
└── types/
    └── index.ts                   # MODIFY: Add Gemini-related types
```

## Success Criteria

### Technical Success
- ✅ Both Claude and Gemini agents write to same database
- ✅ All records tagged with `generated_by_model`
- ✅ `--model` flag routes correctly to agent implementations
- ✅ MCP tools work seamlessly with both SDKs
- ✅ No data corruption or conflicts
- ✅ All tests pass for both model families

### Business Success (from CLAUDE.md)
- **Novelty Score** > 2.5/5 for Gemini findings (information Ken didn't know)
- **Accuracy Score** > 4/5 for Gemini findings (verifiable with sources)
- **Actionability Score** > 3/5 for Gemini findings (clear next steps)
- Gemini finds **unique signals** that Claude misses (measure overlap < 80%)
- Cost per actionable insight **competitive** between models

## References

### Documentation
- Google ADK Docs: https://github.com/google/adk-docs
- Gemini API Docs: https://ai.google.dev/gemini-api/docs
- MCP Protocol Spec: https://modelcontextprotocol.io/
- Anthropic Agent SDK: https://github.com/anthropics/anthropic-sdk-typescript

### Code References
- Orchestrator: `src/index.ts:1-399`
- Prospector (Claude): `src/agents/prospector.ts:1-317`
- Researcher (Claude): `src/agents/researcher.ts:1-386`
- Connector (Claude): `src/agents/connector.ts:1-448`
- Supabase Tools: `src/tools/supabase-tools.ts:1-512`
- Database Layer: `src/utils/supabase.ts:1-256`

---

**Implementation Order:**
1. ✅ Phase 1-2: Database + Dependencies (COMPLETED)
2. Phase 3-4: Clients + Adapters (foundation)
3. Phase 5-7: Gemini Agents (parallel build)
4. Phase 8-9: Orchestrator + Tracking (integration)
5. Phase 10-11: Analytics + Testing (validation)

**Estimated Complexity:** High (multi-SDK integration, new architecture pattern)
