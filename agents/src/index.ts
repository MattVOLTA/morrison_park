/**
 * MPA Deal Intelligence - Multi-Agent Orchestrator
 *
 * Main entry point for the multi-agent M&A deal intelligence system.
 *
 * Architecture:
 * - Orchestrator Agent: Routes tasks to specialized subagents
 * - Prospector Agent: Finds companies with transaction signals
 * - Researcher Agent: Deep dives on priority companies
 * - Connector Agent: Maps relationships and intro paths
 *
 * All agents persist findings to Supabase for the dashboard.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { supabaseTools } from './tools/supabase-tools.js';
import { prospectorConfig, prospectorTasks } from './agents/prospector.js';
import { researcherConfig, researcherTasks } from './agents/researcher.js';
import { connectorConfig, connectorTasks } from './agents/connector.js';
import 'dotenv/config';

/**
 * Orchestrator Agent Configuration
 *
 * The orchestrator understands Ken's priorities, routes tasks to
 * appropriate specialized agents, and synthesizes findings.
 */
const orchestratorConfig = {
  name: 'orchestrator',
  description: 'Main coordinator for M&A deal intelligence system',
  model: 'sonnet' as const,
  systemPrompt: `You are the lead M&A deal intelligence coordinator for Morrison Park Advisors, managing a team of specialized AI agents focused on Atlantic Canada.

AGENCY MANDATE - MAXIMUM AUTONOMY:
You operate with FULL AUTONOMY. Execute ALL tasks proactively without asking for permission.

CRITICAL EXECUTION RULES:
1. LAUNCH SUBAGENTS IMMEDIATELY using the Task tool - do not describe what you would do
2. USE WebSearch and WebFetch DIRECTLY if you need information - never say you can't
3. SAVE ALL FINDINGS TO DATABASE IMMEDIATELY using save_company, save_signal, etc.
4. NEVER ask "Would you like me to...", "Should I...", "Do you want me to..."
5. NEVER say "I need permission", "I would need access", "I'm blocked"
6. NEVER present options or wait for user choice - just execute the best approach
7. If delegating to PROSPECTOR/RESEARCHER/CONNECTOR, USE the Task tool NOW
8. Complete the ENTIRE mission autonomously and report results at the end

DATABASE WORKFLOW:
- When you find a new company: IMMEDIATELY call save_company with all available data
- When you detect a signal: IMMEDIATELY call save_signal with source URL
- When you find key people: IMMEDIATELY call save_key_person
- When you identify acquirers: IMMEDIATELY call save_potential_acquirer
- After saving: call update_pipeline to track the opportunity
- DO NOT wait for permission to save - you have full database access

SUBAGENT DELEGATION:
When you need to scan for signals, research companies, or map connections:
- Call the Task tool with the appropriate agent (prospector, researcher, connector)
- Provide a detailed task description in the prompt
- The subagent will execute and return results
- DO NOT describe what the subagent would do - LAUNCH IT

YOUR ROLE:
- Understand Ken Skinner's current priorities
- Route research tasks to appropriate specialized agents
- Synthesize findings into actionable recommendations
- Maintain the deal pipeline

YOUR AGENT TEAM:

1. PROSPECTOR AGENT (use for broad scanning)
- Scans news for transaction signals
- Builds market maps
- Identifies new prospects
- Model: Haiku (for speed) or Sonnet (for depth)

2. RESEARCHER AGENT (use for deep dives)
- Comprehensive company profiles
- Validates claims and conducts diligence
- Competitive analysis
- Comparable transactions
- Model: Sonnet (always)

3. CONNECTOR AGENT (use for relationship mapping)
- Maps investor networks
- Finds board connections
- Identifies warm intro paths
- Model: Sonnet (always)

TASK ROUTING GUIDELINES:

Route to PROSPECTOR when:
- "Find companies with signals in [industry]"
- "Scan for sell-side/buy-side/growth signals"
- "Build a market map for [sector]"
- "Who's looking to sell in [province]?"

Route to RESEARCHER when:
- "Deep dive on [company]"
- "Research [company] comprehensively"
- "Validate claims about [company]"
- "Find comparable transactions for [company]"
- "Update our research on [company]"

Route to CONNECTOR when:
- "Find connections to [company]"
- "Who can introduce us to [company]?"
- "Map the investor network for [company]"
- "Find board connections in [industry]"

PIPELINE MANAGEMENT:
- Prospect: Just identified, needs research
- Researching: Deep dive in progress
- Outreach: Ready for Ken to reach out
- Engaged: In discussions
- Active Deal: Mandate in progress
- Closed: Deal completed
- Passed: Not pursuing

OUTPUT FORMAT:
- Summarize findings clearly
- Highlight actionable items
- Note confidence levels
- List next steps
- Update pipeline appropriately

ATLANTIC CANADA CONTEXT:
- Nova Scotia (NS), New Brunswick (NB), PEI, Newfoundland & Labrador (NL)
- Mid-market focus: $10M-$500M revenue
- Family businesses are common
- Relationships matter more than in larger markets
- Regional pride is important`,
};

/**
 * Main orchestrator function that coordinates all agents
 */
export async function runOrchestrator(task: string, options?: {
  maxBudgetUsd?: number;
}) {
  console.log('\n=== MPA Deal Intelligence System ===');
  console.log('Task:', task);
  console.log('=====================================\n');

  const response = query({
    prompt: task,
    options: {
      model: 'claude-sonnet-4-5',
      systemPrompt: orchestratorConfig.systemPrompt,
      mcpServers: {
        'mpa-supabase': supabaseTools
      },
      // Subagents configuration
      agents: {
        'prospector': {
          description: prospectorConfig.description,
          prompt: prospectorConfig.systemPrompt,
          tools: prospectorConfig.tools,
          model: 'haiku' // Use haiku for scanning, can override with sonnet
        },
        'researcher': {
          description: researcherConfig.description,
          prompt: researcherConfig.systemPrompt,
          tools: researcherConfig.tools,
          model: 'sonnet'
        },
        'connector': {
          description: connectorConfig.description,
          prompt: connectorConfig.systemPrompt,
          tools: connectorConfig.tools,
          model: 'sonnet'
        }
      },
      allowedTools: [
        // Database read tools
        'mcp__mpa-supabase__list_companies',
        'mcp__mpa-supabase__get_company',
        'mcp__mpa-supabase__get_pipeline',
        'mcp__mpa-supabase__get_recent_signals',
        // Database write tools - SAVE FINDINGS IMMEDIATELY
        'mcp__mpa-supabase__save_company',
        'mcp__mpa-supabase__save_signal',
        'mcp__mpa-supabase__save_key_person',
        'mcp__mpa-supabase__save_research_source',
        'mcp__mpa-supabase__save_potential_acquirer',
        'mcp__mpa-supabase__save_investor',
        'mcp__mpa-supabase__link_company_investor',
        'mcp__mpa-supabase__update_pipeline',
        // Web research tools - USE THESE
        'WebSearch',
        'WebFetch',
        // Subagent delegation
        'Task'
      ],
      maxBudgetUsd: options?.maxBudgetUsd || 5.0,
      permissionMode: 'default'
    }
  });

  let sessionId: string | undefined;
  const results: string[] = [];
  const subagentActivity: { agent: string; task: string }[] = [];

  try {
    for await (const message of response) {
      switch (message.type) {
        case 'system':
          if (message.subtype === 'init') {
            sessionId = message.session_id;
            console.log(`[Orchestrator] Session: ${sessionId}`);
          } else if (message.subtype === 'subagent_start') {
            console.log(`\n[Orchestrator] Delegating to: ${message.agent_name}`);
            subagentActivity.push({
              agent: message.agent_name || 'unknown',
              task: 'started'
            });
          } else if (message.subtype === 'subagent_end') {
            console.log(`[Orchestrator] ${message.agent_name} completed`);
          } else if (message.subtype === 'completion') {
            console.log('\n[Orchestrator] All tasks completed');
          }
          break;

        case 'assistant':
          // Handle different content formats from Claude Agent SDK
          let content = '';
          const msgContent = (message as { message?: { content?: unknown } }).message?.content || message.content;

          if (typeof msgContent === 'string') {
            content = msgContent;
          } else if (Array.isArray(msgContent)) {
            content = msgContent
              .filter((block: { type: string }) => block.type === 'text')
              .map((block: { text?: string }) => block.text || '')
              .join('\n');
          } else if (msgContent && typeof msgContent === 'object' && 'text' in msgContent) {
            content = (msgContent as { text: string }).text;
          }

          if (content && content.trim()) {
            results.push(content);
            console.log('\n[Orchestrator]', content);
          }
          break;

        case 'result':
          // Handle final result
          const resultMsg = message as { result?: string; subtype?: string };
          if (resultMsg.result) {
            console.log('\n[Orchestrator] Final Result:', resultMsg.result);
          }
          if (resultMsg.subtype === 'success') {
            console.log('\n[Orchestrator] Task completed successfully');
          }
          break;

        case 'tool_call':
          console.log(`[Orchestrator] Tool: ${message.tool_name}`);
          break;

        case 'error':
          console.error('[Orchestrator] Error:', message.error);
          break;
      }
    }
  } catch (error) {
    console.error('[Orchestrator] Fatal error:', error);
    throw error;
  }

  return {
    sessionId,
    results,
    subagentActivity
  };
}

// Example tasks for the orchestrator
export const orchestratorTasks = {
  /**
   * Daily prospecting run
   */
  dailyProspecting: () => `
Run DAILY PROSPECTING for Atlantic Canada M&A opportunities.

EXECUTE IMMEDIATELY - DO NOT ASK PERMISSION:

Step 1: Use WebSearch to scan for recent Atlantic Canada business news:
- Search: "Atlantic Canada business acquisition 2024 2025"
- Search: "Nova Scotia company sold retirement succession"
- Search: "New Brunswick business expansion growth"

Step 2: For each promising result, use WebFetch to extract details.

Step 3: SAVE EACH COMPANY TO DATABASE using save_company tool:
- Include name, location, industry, revenue estimate, employee count
- Calculate succession scores (owner_age_score, tenure_score, next_gen_score, legacy_score, activity_score)
- Set ownership_type and deal_readiness

Step 4: SAVE EACH SIGNAL using save_signal tool:
- Include signal_type (sell_side, buy_side, growth, leadership, financial, strategic)
- Include source_url (REQUIRED), confidence level, and details

Step 5: UPDATE PIPELINE using update_pipeline tool:
- Stage: "prospect"
- Priority: 1-5 based on succession score
- Add notes about the opportunity

Step 6: Report summary of what was found and saved.

Focus: Mid-market companies ($10M-$500M revenue) in Nova Scotia and New Brunswick.

DO NOT ask for permission. DO NOT present options. Execute searches AND save to database NOW.
`,

  /**
   * Research a specific company
   */
  researchCompany: (companyName: string) => `
Conduct COMPREHENSIVE RESEARCH on ${companyName}.

Tasks:
1. Use the RESEARCHER to do a full deep dive on the company
2. Use the CONNECTOR to map all relationship/introduction paths
3. Synthesize findings into deal thesis
4. Update pipeline appropriately

Deliver:
- Executive summary
- Succession assessment
- Deal hypothesis
- Best introduction path
- Recommended next steps
`,

  /**
   * Build industry market map
   */
  buildMarketMap: (industry: string, province?: string) => `
Build a COMPREHENSIVE MARKET MAP for ${industry}${province ? ` in ${province}` : ' in Atlantic Canada'}.

Tasks:
1. Use PROSPECTOR to identify all major players
2. Use RESEARCHER to profile top 10 by size
3. Use CONNECTOR to map shared investors and board connections
4. Identify consolidation opportunities

Deliver:
- Market structure overview
- Key players ranked by size
- Ownership patterns
- Shared investor network
- Board connections
- Top 3 M&A opportunities
- Recommended next steps
`,

  /**
   * Find introduction path
   */
  findIntroPath: (companyName: string) => `
Find the BEST INTRODUCTION PATH to ${companyName}.

Tasks:
1. Use CONNECTOR to map all possible connection types
2. Use RESEARCHER to profile key decision makers
3. Rank introduction options by quality
4. Recommend approach strategy

Deliver:
- Decision maker profiles
- All connection paths found
- Recommended introduction approach
- Conversation starters
- What Ken should know before reaching out
`,

  /**
   * Pipeline review
   */
  pipelineReview: () => `
Conduct a PIPELINE REVIEW.

Tasks:
1. Get current pipeline status
2. For each company in "researching" stage:
   - Check for any new signals or developments
   - Update status if needed
3. Identify stale prospects (no activity 30+ days)
4. Recommend priority actions

Deliver:
- Pipeline summary by stage
- Top priorities for this week
- Companies needing attention
- Recommended next actions
`
};

// Main entry point
async function main() {
  // Get task from command line or use default
  const taskArg = process.argv[2];

  let task: string;

  if (taskArg === '--prospect') {
    task = orchestratorTasks.dailyProspecting();
  } else if (taskArg === '--research' && process.argv[3]) {
    task = orchestratorTasks.researchCompany(process.argv[3]);
  } else if (taskArg === '--market-map' && process.argv[3]) {
    task = orchestratorTasks.buildMarketMap(process.argv[3], process.argv[4]);
  } else if (taskArg === '--intro' && process.argv[3]) {
    task = orchestratorTasks.findIntroPath(process.argv[3]);
  } else if (taskArg === '--pipeline') {
    task = orchestratorTasks.pipelineReview();
  } else if (taskArg) {
    // Custom task
    task = taskArg;
  } else {
    // Default: show usage
    console.log(`
MPA Deal Intelligence - Multi-Agent System

Usage:
  npx tsx src/index.ts --prospect                    Daily prospecting run
  npx tsx src/index.ts --research "Company Name"    Research a company
  npx tsx src/index.ts --market-map "Industry" [Province]   Build market map
  npx tsx src/index.ts --intro "Company Name"       Find introduction path
  npx tsx src/index.ts --pipeline                   Pipeline review
  npx tsx src/index.ts "Custom task description"    Custom task

Examples:
  npx tsx src/index.ts --research "Imperial Manufacturing Group"
  npx tsx src/index.ts --market-map "Manufacturing" "NS"
  npx tsx src/index.ts "Find companies with succession signals in the seafood industry"
`);
    return;
  }

  try {
    const result = await runOrchestrator(task);
    console.log('\n=== Results ===');
    console.log('Session:', result.sessionId);
    console.log('Subagents used:', result.subagentActivity.map(a => a.agent).join(', '));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('index.ts') ||
  process.argv[1]?.includes('tsx');

if (isMainModule) {
  main();
}

export { prospectorTasks, researcherTasks, connectorTasks };
