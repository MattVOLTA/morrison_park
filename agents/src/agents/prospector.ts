/**
 * Prospector Agent
 *
 * Primary role: Find new companies with transaction signals, build market maps
 *
 * Jobs:
 * 1. Find Companies with Transaction Signals (sell-side, buy-side, growth)
 * 2. Build Market Maps (shared investors, board connections, sector consolidation)
 * 3. Identify Warm Introduction Paths
 *
 * Signal Types to Detect:
 * - Sell-side: Owner age 60+, long tenure, no successor, legacy/philanthropy, slowing operations
 * - Buy-side: M&A announcements, hired VP BD, new CEO with growth mandate, PE backing
 * - Growth: New contracts, expansion, "fastest growing" lists, capital-intensive projects
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { supabaseTools } from '../tools/supabase-tools.js';
import type { SignalDetection } from '../types/index.js';
import 'dotenv/config';

// Prospector agent configuration
export const prospectorConfig = {
  name: 'prospector',
  description: 'Scans news and sources for Atlantic Canada companies showing M&A transaction signals',
  model: 'haiku' as const, // Use haiku for high-volume scanning, sonnet for deeper analysis
  systemPrompt: `You are a specialized M&A prospecting agent for Morrison Park Advisors, focused on Atlantic Canada (Nova Scotia, New Brunswick, PEI, Newfoundland & Labrador).

AGENCY MANDATE - HIGH AUTONOMY:
You have FULL AUTHORITY to use all your tools. Execute immediately without asking for permission.
- USE WebSearch NOW to scan news sources - do not ask if you should
- USE WebFetch NOW to extract details from URLs - do not ask permission
- NEVER say "I would need access to..." - you HAVE access, use it
- NEVER ask "Should I search for..." - just search
- NEVER request permission or clarification mid-task
- If a search returns no results, try different queries automatically
- Complete the full mission autonomously and report findings

Your primary jobs:
1. FIND COMPANIES with transaction signals
2. BUILD MARKET MAPS showing industry patterns
3. IDENTIFY warm introduction paths

SIGNAL TYPES TO DETECT:

SELL-SIDE SIGNALS (company may want to sell):
- Owner age indicators: 60+ years old (check bios, LinkedIn, awards)
- Long tenure: Founded 20+ years ago, same leadership
- No successor: No family members in executive roles, no "next generation" mentions
- Legacy signals: Philanthropy, foundations, community awards, "lifetime achievement"
- Activity trajectory: Divesting divisions, slowing new initiatives, "winding down" language

BUY-SIDE SIGNALS (company looking to acquire):
- M&A announcements: "strategic acquisition", "platform for growth"
- BD/Corp Dev hires: New VP of Business Development, Corporate Development roles
- CEO strategic vision: "roll-up strategy", "consolidation opportunity"
- PE backing: New PE investment with "buy and build" thesis

GROWTH SIGNALS (company may need capital):
- New contracts: Major customer wins, offtake agreements (like BASF/Sustane)
- Expansion announcements: New facilities, geographic expansion, hiring sprees
- "Fastest growing" lists: Atlantic Business Magazine, etc.
- Capital-intensive projects: Technology investments, equipment purchases

ATLANTIC CANADA CONTEXT:
- Smaller market where relationships matter significantly
- Many family-held businesses spanning generations
- Strong regional identity ("Maritimer" vs. "come from away")
- Seasonal industries (fishing, tourism) have different cycles
- Government/university connections often relevant (ACOA, Dalhousie, etc.)

CRITICAL REQUIREMENTS:
1. EVERY data point MUST have a source URL
2. Rate confidence honestly (high/medium/low)
3. Note information gaps explicitly
4. Focus on mid-market companies ($10M-$500M revenue)

When you detect signals, save them to the database with all required fields.`,
  tools: [
    'Read',
    'Grep',
    'Glob',
    'WebSearch',
    'WebFetch',
    'mcp__mpa-supabase__save_company',
    'mcp__mpa-supabase__get_company',
    'mcp__mpa-supabase__list_companies',
    'mcp__mpa-supabase__save_signal',
    'mcp__mpa-supabase__get_recent_signals',
    'mcp__mpa-supabase__save_investor',
    'mcp__mpa-supabase__link_company_investor',
    'mcp__mpa-supabase__update_pipeline',
    'mcp__mpa-supabase__save_research_source'
  ]
};

/**
 * Run the Prospector Agent with a specific task
 */
export async function runProspector(task: string, options?: {
  model?: 'sonnet' | 'haiku';
  maxBudgetUsd?: number;
}) {
  const results: {
    signals: SignalDetection[];
    companiesFound: string[];
    errors: string[];
  } = {
    signals: [],
    companiesFound: [],
    errors: []
  };

  const response = query({
    prompt: task,
    options: {
      model: options?.model === 'sonnet' ? 'claude-sonnet-4-5' : 'claude-haiku-3-5',
      systemPrompt: prospectorConfig.systemPrompt,
      mcpServers: {
        'mpa-supabase': supabaseTools
      },
      allowedTools: prospectorConfig.tools,
      maxBudgetUsd: options?.maxBudgetUsd || 1.0,
      permissionMode: 'default'
    }
  });

  let sessionId: string | undefined;

  try {
    for await (const message of response) {
      switch (message.type) {
        case 'system':
          if (message.subtype === 'init') {
            sessionId = message.session_id;
            console.log(`[Prospector] Session started: ${sessionId}`);
          } else if (message.subtype === 'completion') {
            console.log('[Prospector] Task completed');
          }
          break;

        case 'assistant':
          console.log('[Prospector]', message.content);
          break;

        case 'tool_call':
          console.log(`[Prospector] Tool: ${message.tool_name}`);
          break;

        case 'tool_result':
          // Parse results for signals found
          if (message.tool_name?.includes('save_signal')) {
            console.log(`[Prospector] Signal saved`);
          }
          break;

        case 'error':
          console.error('[Prospector] Error:', message.error);
          results.errors.push(message.error?.message || 'Unknown error');
          break;
      }
    }
  } catch (error) {
    console.error('[Prospector] Fatal error:', error);
    results.errors.push((error as Error).message);
  }

  return { sessionId, results };
}

// Specialized prospecting tasks
export const prospectorTasks = {
  /**
   * Scan for sell-side signals in a specific industry
   */
  scanIndustryForSellSide: (industry: string, province?: string) => `
Scan for SELL-SIDE signals in the ${industry} industry${province ? ` in ${province}` : ' across Atlantic Canada'}.

Look for companies showing signs they may want to sell:
1. Owners approaching retirement (60+)
2. Founding families with no clear successor
3. Recent philanthropy or legacy activities
4. Slowing business activity or divestitures

For each company found:
- Save the company profile with succession scores
- Save each signal with source URL
- Add to pipeline as "prospect" with appropriate priority

Search sources:
- Atlantic Business Magazine
- Local business news (Chronicle Herald, Telegraph-Journal, etc.)
- Press releases mentioning "founder", "retirement", "succession"
- Award announcements (lifetime achievement, community service)
`,

  /**
   * Scan for buy-side signals
   */
  scanForBuySide: (region?: string) => `
Scan for BUY-SIDE signals in ${region || 'Atlantic Canada'}.

Look for companies actively acquiring or positioning for acquisition:
1. Recent M&A announcements
2. New VP of Business Development or Corp Dev hires
3. PE-backed companies with platform thesis
4. CEOs discussing "consolidation" or "roll-up" strategy

For each company found:
- Save company profile
- Save buy-side signals with source URL
- Note recent acquisition activity
- Add to pipeline as "prospect" (buy-side client type)

Search sources:
- Press releases with "acquisition", "strategic investment"
- LinkedIn job postings for BD/Corp Dev roles
- Private equity announcements
- Industry consolidation news
`,

  /**
   * Scan for growth signals
   */
  scanForGrowthSignals: (industry?: string) => `
Scan for GROWTH signals in ${industry ? `the ${industry} sector` : 'Atlantic Canada'}.

Look for fast-growing companies that may need capital:
1. Major new contracts or partnerships
2. Expansion announcements (new facilities, geographic)
3. "Fastest growing" list appearances
4. Capital-intensive projects underway

For each company found:
- Save company profile with revenue/employee estimates
- Save growth signals with source URL
- Note capital needs indicators
- Add to pipeline as "prospect" (growth_capital client type)

Search sources:
- Fastest growing company lists
- Contract/partnership announcements
- Expansion and hiring news
- Technology/equipment investments
`,

  /**
   * Build a market map for an industry
   */
  buildMarketMap: (industry: string, province?: string) => `
Build a MARKET MAP for the ${industry} industry${province ? ` in ${province}` : ' in Atlantic Canada'}.

Create a comprehensive view of:
1. All major players (companies over $10M revenue)
2. Ownership structure of each (family, PE-backed, strategic)
3. Recent M&A activity in the sector
4. Shared investors across companies
5. Board connections between companies

For each company:
- Save company profile
- Save investors and link to companies
- Note any shared investor patterns (like Sustane/Oberland/Sustainable Blue)
- Identify consolidation trends

Output a summary showing:
- Market structure
- Key players by size
- Ownership patterns
- Consolidation opportunities
- Potential acquirers interested in the space
`,

  /**
   * Research a specific company for signals
   */
  researchCompanySignals: (companyName: string) => `
Research ${companyName} for M&A transaction signals.

Conduct deep research to find:
1. Ownership structure and key people
2. Recent news and announcements
3. Any sell-side signals (owner age, succession issues)
4. Any buy-side signals (M&A activity)
5. Any growth signals (expansion, capital needs)
6. Investor relationships

Save all findings:
- Company profile with succession scores
- All detected signals with source URLs
- Key people with ownership %
- Research sources with confidence levels

Provide analysis:
- Transaction readiness assessment
- Most likely deal type (sell-side, buy-side, growth)
- Recommended next steps
`
};

// Run standalone if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const task = process.argv[2] || prospectorTasks.scanIndustryForSellSide('manufacturing', 'NS');

  runProspector(task, { model: 'sonnet' })
    .then(result => {
      console.log('\n--- Prospector Results ---');
      console.log('Session:', result.sessionId);
      console.log('Signals found:', result.results.signals.length);
      console.log('Companies found:', result.results.companiesFound.length);
      if (result.results.errors.length > 0) {
        console.log('Errors:', result.results.errors);
      }
    })
    .catch(console.error);
}
