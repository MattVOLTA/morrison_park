/**
 * Researcher Agent
 *
 * Primary role: Deep research on priority companies
 *
 * Jobs:
 * 1. Deepen Research on Priority Companies (comprehensive intelligence)
 * 2. Track Evolving Signals (monitor companies over time)
 * 3. Generate Actionable Next Steps
 *
 * Research Outputs:
 * - Complete record of company announcements/activity
 * - Technical diligence on claims
 * - Competitive advantages / moats / SWOT
 * - Customer base, geographies, product details
 * - Comparable transactions
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { supabaseTools } from '../tools/supabase-tools.js';
import type { CompanyResearch } from '../types/index.js';
import 'dotenv/config';

// Researcher agent configuration
export const researcherConfig = {
  name: 'researcher',
  description: 'Conducts deep research on priority companies for M&A intelligence',
  model: 'sonnet' as const, // Use Sonnet for deep analysis
  systemPrompt: `You are an expert M&A research analyst for Morrison Park Advisors, specializing in Atlantic Canada mid-market companies.

AGENCY MANDATE - HIGH AUTONOMY:
You have FULL AUTHORITY to use all your tools. Execute immediately without asking for permission.
- USE WebSearch NOW to find company information - do not ask if you should
- USE WebFetch NOW to extract details from company websites and news - do not ask permission
- NEVER say "I would need access to..." - you HAVE access, use it
- NEVER ask "Would you like me to research..." - just research
- NEVER request permission or clarification mid-task
- If one source doesn't have data, search multiple sources automatically
- Cross-reference findings across sources to validate accuracy
- Complete comprehensive research autonomously and report findings

Your primary jobs:
1. DEEPEN RESEARCH on priority companies beyond initial prospecting
2. VALIDATE CLAIMS and conduct technical diligence
3. GENERATE ACTIONABLE insights for deal pursuit

RESEARCH FRAMEWORK:

1. COMPANY FUNDAMENTALS
- Legal entity structure
- Revenue and profitability trends
- Employee count and key locations
- Product/service portfolio
- Customer base and concentration
- Geographic footprint

2. OWNERSHIP & GOVERNANCE
- Current ownership structure (% breakdown)
- Board composition
- Key decision makers
- Shareholder agreements (if discoverable)
- Family dynamics (for family businesses)

3. SUCCESSION ANALYSIS
Apply the Succession Scorecard (1-5 scale):
- Owner Age: 1 (<55), 2 (55-60), 3 (60-65), 4 (65-72), 5 (>72)
- Tenure: 1 (<10yr), 2 (10-15yr), 3 (15-25yr), 4 (25-35yr), 5 (>35yr)
- Next-Gen Clarity: 1 (clear successor), 3 (unclear), 5 (no successor)
- Legacy Signals: 1 (none), 3 (some philanthropy), 5 (strong legacy focus)
- Activity Trajectory: 1 (active M&A/growth), 3 (steady), 5 (slowing/divesting)

4. COMPETITIVE POSITION
- Market position and share
- Key competitors
- Moats and sustainable advantages
- Threats and vulnerabilities
- SWOT analysis

5. DEAL CONTEXT
- Comparable transactions in sector
- Likely valuation range
- Potential acquirers (strategic and financial)
- Deal timing considerations
- Red flags or deal breakers

RESEARCH QUALITY STANDARDS:
- EVERY claim needs a source URL
- Distinguish facts from estimates
- Rate confidence: high (primary source), medium (secondary), low (inference)
- Note all information gaps
- Cross-reference multiple sources

OUTPUT REQUIREMENTS:
- Save company profile with all scores
- Save each key person discovered
- Save all research sources with data points
- Save identified potential acquirers
- Update pipeline stage appropriately`,
  tools: [
    'Read',
    'Grep',
    'Glob',
    'WebSearch',
    'WebFetch',
    'mcp__mpa-supabase__save_company',
    'mcp__mpa-supabase__get_company',
    'mcp__mpa-supabase__save_signal',
    'mcp__mpa-supabase__get_signals',
    'mcp__mpa-supabase__save_key_person',
    'mcp__mpa-supabase__save_research_source',
    'mcp__mpa-supabase__save_potential_acquirer',
    'mcp__mpa-supabase__save_investor',
    'mcp__mpa-supabase__link_company_investor',
    'mcp__mpa-supabase__update_pipeline'
  ]
};

/**
 * Run the Researcher Agent with a specific task
 */
export async function runResearcher(task: string, options?: {
  maxBudgetUsd?: number;
}) {
  const results: {
    companyData: Partial<CompanyResearch> | null;
    sourceCount: number;
    errors: string[];
  } = {
    companyData: null,
    sourceCount: 0,
    errors: []
  };

  const response = query({
    prompt: task,
    options: {
      model: 'claude-sonnet-4-5',
      systemPrompt: researcherConfig.systemPrompt,
      mcpServers: {
        'mpa-supabase': supabaseTools
      },
      allowedTools: researcherConfig.tools,
      maxBudgetUsd: options?.maxBudgetUsd || 2.0,
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
            console.log(`[Researcher] Session started: ${sessionId}`);
          } else if (message.subtype === 'completion') {
            console.log('[Researcher] Research completed');
          }
          break;

        case 'assistant':
          console.log('[Researcher]', message.content);
          break;

        case 'tool_call':
          console.log(`[Researcher] Tool: ${message.tool_name}`);
          break;

        case 'tool_result':
          if (message.tool_name?.includes('save_research_source')) {
            results.sourceCount++;
          }
          break;

        case 'error':
          console.error('[Researcher] Error:', message.error);
          results.errors.push(message.error?.message || 'Unknown error');
          break;
      }
    }
  } catch (error) {
    console.error('[Researcher] Fatal error:', error);
    results.errors.push((error as Error).message);
  }

  return { sessionId, results };
}

// Specialized research tasks
export const researcherTasks = {
  /**
   * Full company deep dive
   */
  fullCompanyProfile: (companyName: string) => `
Conduct a COMPREHENSIVE DEEP DIVE on ${companyName}.

Research all aspects:

1. COMPANY FUNDAMENTALS
- Confirm legal name and corporate structure
- Find revenue estimates (from awards, grants, news)
- Count employees (LinkedIn, news, company website)
- Map all locations and facilities
- Document products/services offered
- Identify major customers if possible

2. OWNERSHIP & PEOPLE
- Research current ownership structure
- Profile ALL executives and board members:
  - Full name and current title
  - Estimated age (graduation dates, career timeline)
  - Years at company
  - LinkedIn profile URL
  - Ownership stake if discoverable
- Look for family relationships
- Note any recent leadership changes

3. SUCCESSION SCORECARD
Calculate each dimension (1-5):
- Owner Age: Find birth year or estimate from career start
- Tenure: Years as owner/CEO
- Next-Gen Clarity: Is there an obvious successor?
- Legacy Signals: Philanthropy, awards, foundations
- Activity Trajectory: Growing, steady, or slowing?

4. RECENT ACTIVITY (last 24 months)
- All press releases and announcements
- Awards and recognitions
- New contracts or partnerships
- M&A activity (acquiring or divesting)
- Major hires or departures
- Capital raises or investments

5. COMPETITIVE ANALYSIS
- Direct competitors
- Market position estimate
- Competitive advantages
- Key differentiators
- Threats and challenges

6. DEAL ANALYSIS
- Comparable M&A transactions
- Estimate valuation range
- Identify 5+ potential strategic acquirers
- Identify 3+ PE firms active in sector
- List deal considerations and risks

SAVE ALL DATA:
- Company profile with scores
- Each key person with source
- All research sources
- Potential acquirers with rationale
- Update pipeline stage to "researching"

Conclude with:
- Executive Summary (3 paragraphs)
- Deal Hypothesis (most likely transaction type)
- Recommended Next Steps
- Key Unknowns requiring further research
`,

  /**
   * Technical/claim validation
   */
  validateClaims: (companyName: string, claims: string) => `
VALIDATE the following claims about ${companyName}:

${claims}

For each claim:
1. Search for corroborating evidence
2. Find primary sources if possible
3. Note any contradicting information
4. Rate confidence (high/medium/low)

Save research sources for each validated claim.

Output:
- Claim-by-claim validation
- Evidence found (with URLs)
- Confidence assessment
- Red flags or concerns
`,

  /**
   * Competitive landscape analysis
   */
  competitiveAnalysis: (companyName: string, industry: string) => `
Analyze the COMPETITIVE LANDSCAPE for ${companyName} in the ${industry} sector.

Research:
1. Direct competitors (same products/services)
2. Indirect competitors (substitutes)
3. Market size and growth
4. Market share estimates
5. Competitive dynamics (consolidating? fragmenting?)

For each key competitor:
- Company profile
- Ownership structure
- Recent M&A activity
- Strengths vs ${companyName}
- Weaknesses vs ${companyName}

Provide:
- Competitive positioning map
- SWOT analysis for ${companyName}
- Consolidation opportunities
- Potential acquirer interest
`,

  /**
   * M&A comparable transactions
   */
  findComparables: (companyName: string, industry: string, revenueRange?: string) => `
Find COMPARABLE M&A TRANSACTIONS for ${companyName}.

Search criteria:
- Industry: ${industry}
- Revenue range: ${revenueRange || 'similar to target'}
- Geography: Atlantic Canada preferred, then rest of Canada
- Time period: Last 5 years

For each comparable:
- Buyer and seller names
- Transaction date
- Deal value if disclosed
- Revenue/EBITDA multiples if available
- Strategic rationale
- Source URL

Analyze:
- Valuation range for ${companyName}
- Most active buyers in space
- Deal structure patterns
- Timing considerations

Save potential acquirers identified from comparables.
`,

  /**
   * Monitor company for new developments
   */
  monitorUpdates: (companyName: string, lastCheckDate?: string) => `
Check for NEW DEVELOPMENTS on ${companyName}${lastCheckDate ? ` since ${lastCheckDate}` : ''}.

Search for:
1. New press releases or announcements
2. Leadership changes
3. Financial news
4. M&A rumors or activity
5. New contracts or partnerships
6. Regulatory filings
7. Social media announcements
8. Industry publication mentions

For each finding:
- Summarize the development
- Assess signal type (sell-side, buy-side, growth)
- Rate importance (high/medium/low)
- Save as signal in database

Update:
- Pipeline notes with key developments
- Next action if warranted
`
};

// Run standalone if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const companyName = process.argv[2] || 'Imperial Manufacturing Group';
  const task = researcherTasks.fullCompanyProfile(companyName);

  runResearcher(task)
    .then(result => {
      console.log('\n--- Researcher Results ---');
      console.log('Session:', result.sessionId);
      console.log('Sources saved:', result.results.sourceCount);
      if (result.results.errors.length > 0) {
        console.log('Errors:', result.results.errors);
      }
    })
    .catch(console.error);
}
