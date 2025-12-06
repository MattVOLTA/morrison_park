/**
 * Connector Agent
 *
 * Primary role: Map relationships and identify warm introduction paths
 *
 * Jobs:
 * 1. Map shared investor networks across companies
 * 2. Find board connections and overlapping relationships
 * 3. Identify warm introduction paths to target companies
 *
 * Relationship Types:
 * - Shared investors (PE firms, family offices)
 * - Board connections
 * - Conference/speaking circuit
 * - Philanthropy/university connections
 * - Professional advisors (lawyers, accountants)
 * - Alumni networks
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { supabaseTools } from '../tools/supabase-tools.js';
import type { ConnectionResearch } from '../types/index.js';
import 'dotenv/config';

// Connector agent configuration
export const connectorConfig = {
  name: 'connector',
  description: 'Maps relationship networks and identifies warm introduction paths to target companies',
  model: 'sonnet' as const,
  systemPrompt: `You are a relationship mapping specialist for Morrison Park Advisors, focused on finding warm introduction paths to Atlantic Canada companies.

AGENCY MANDATE - HIGH AUTONOMY:
You have FULL AUTHORITY to use all your tools. Execute immediately without asking for permission.
- USE WebSearch NOW to find board members, investors, and connections - do not ask if you should
- USE WebFetch NOW to extract LinkedIn profiles, press releases, and bios - do not ask permission
- NEVER say "I would need access to..." - you HAVE access, use it
- NEVER ask "Should I search for connections..." - just search
- NEVER request permission or clarification mid-task
- Search LinkedIn, company websites, news sources, university boards, etc. autonomously
- If one path doesn't reveal connections, try alternative approaches
- Complete comprehensive relationship mapping autonomously and report findings

Your primary jobs:
1. MAP SHARED INVESTOR NETWORKS
2. FIND BOARD CONNECTIONS between companies
3. IDENTIFY WARM INTRODUCTION PATHS

KEY INSIGHT FROM KEN SKINNER:
"The Cap Table is always of great interest to us... When we want to reach out to a company we always try to find a connection…at the company or the board or investors or mutual friends/contacts, anything to work with."

"Higher level strategy... is the connection among successful business people investing in local businesses with promise. These guys make meaningful investments in companies and then sit on the board, advise, and I am sure have influence on major decisions…like hiring an investment banker."

RELATIONSHIP TYPES TO MAP:

1. SHARED INVESTORS
- PE firms with multiple Atlantic portfolio companies
- Family offices investing regionally
- Strategic investors with sector focus
- Angel networks (First Angel Network, etc.)
Example: Sustane/Oberland/Sustainable Blue connection

2. BOARD CONNECTIONS
- Directors serving on multiple boards
- Retired executives on advisory boards
- Professional directors (lawyers, accountants)

3. CONFERENCE/SPEAKING CIRCUIT
- Industry conferences (Ocean Supercluster, etc.)
- Business awards (Top 50 CEO, etc.)
- Speaking engagements

4. PHILANTHROPY/UNIVERSITY
- University boards (Dalhousie, Acadia, etc.)
- Foundation involvement
- Hospital boards
- Community organizations

5. PROFESSIONAL ADVISORS
- Law firms (Stewart McKelvey, McInnes Cooper)
- Accounting firms (Grant Thornton, BDO)
- Investment bankers with prior relationships

6. ALUMNI NETWORKS
- Dalhousie MBA network (strong in region)
- Canadian Business schools
- Industry-specific associations

WARM INTRO QUALITY ASSESSMENT:
- Tier 1: Direct personal relationship
- Tier 2: Shared board/investor
- Tier 3: Same professional network
- Tier 4: Conference/event connection
- Tier 5: Cold (no connection found)

FOR EACH CONNECTION:
- Connection type
- Who can make the introduction
- How Ken/MPA knows the introducer
- Quality tier (1-5)
- Source URL (REQUIRED)

ATLANTIC CANADA CONTEXT:
- Small market = everyone knows everyone
- Family relationships matter
- Long memories (both positive and negative)
- University connections are strong (especially Dal)
- Professional firm relationships are valuable`,
  tools: [
    'Read',
    'Grep',
    'Glob',
    'WebSearch',
    'WebFetch',
    'mcp__mpa-supabase__get_company',
    'mcp__mpa-supabase__save_connection',
    'mcp__mpa-supabase__get_connections',
    'mcp__mpa-supabase__save_investor',
    'mcp__mpa-supabase__link_company_investor',
    'mcp__mpa-supabase__get_shared_investors',
    'mcp__mpa-supabase__save_key_person',
    'mcp__mpa-supabase__save_research_source'
  ]
};

/**
 * Run the Connector Agent with a specific task
 */
export async function runConnector(task: string, options?: {
  maxBudgetUsd?: number;
}) {
  const results: {
    connections: ConnectionResearch[];
    investorsMapped: number;
    errors: string[];
  } = {
    connections: [],
    investorsMapped: 0,
    errors: []
  };

  const response = query({
    prompt: task,
    options: {
      model: 'claude-sonnet-4-5',
      systemPrompt: connectorConfig.systemPrompt,
      mcpServers: {
        'mpa-supabase': supabaseTools
      },
      allowedTools: connectorConfig.tools,
      maxBudgetUsd: options?.maxBudgetUsd || 1.5,
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
            console.log(`[Connector] Session started: ${sessionId}`);
          } else if (message.subtype === 'completion') {
            console.log('[Connector] Connection mapping completed');
          }
          break;

        case 'assistant':
          console.log('[Connector]', message.content);
          break;

        case 'tool_call':
          console.log(`[Connector] Tool: ${message.tool_name}`);
          break;

        case 'tool_result':
          if (message.tool_name?.includes('save_connection')) {
            results.connections.push({} as ConnectionResearch);
          }
          if (message.tool_name?.includes('save_investor')) {
            results.investorsMapped++;
          }
          break;

        case 'error':
          console.error('[Connector] Error:', message.error);
          results.errors.push(message.error?.message || 'Unknown error');
          break;
      }
    }
  } catch (error) {
    console.error('[Connector] Fatal error:', error);
    results.errors.push((error as Error).message);
  }

  return { sessionId, results };
}

// Specialized connector tasks
export const connectorTasks = {
  /**
   * Find all connections to a specific company
   */
  findConnectionsToCompany: (companyName: string) => `
Find ALL possible WARM INTRODUCTION PATHS to ${companyName}.

Research connection opportunities:

1. INVESTOR CONNECTIONS
- Who are the company's investors?
- Do any shared investors exist with companies Ken knows?
- PE firms with Atlantic portfolios

2. BOARD CONNECTIONS
- Who is on the board of ${companyName}?
- What other boards do they serve on?
- Any connections through shared directors?

3. PROFESSIONAL NETWORK
- What law firm represents them?
- What accounting firm?
- Any known advisors or consultants?

4. UNIVERSITY/PHILANTHROPY
- University board memberships
- Foundation involvement
- Community organization leadership

5. INDUSTRY CONNECTIONS
- Industry association memberships
- Conference speaking/attendance
- Award recipients alongside

For EACH connection found:
- Save the connection with type and detail
- Name the potential introducer
- Note the relationship path
- Rate the connection quality (Tier 1-5)
- Include source URL

OUTPUT:
- Ranked list of introduction paths
- Best recommended approach
- Talking points for each path
- Risks or sensitivities to consider
`,

  /**
   * Map shared investor network
   */
  mapSharedInvestors: (companyName: string) => `
Map the SHARED INVESTOR NETWORK for ${companyName}.

Research:
1. Identify all known investors in ${companyName}
2. For each investor, find their other Atlantic Canada investments
3. Map connections between portfolio companies
4. Identify investors active in same sector

For each investor found:
- Save investor profile
- Link to ${companyName}
- Link to other portfolio companies
- Note board seats held

Find:
- Oberland Capital pattern (multiple related companies)
- PE firms with Atlantic focus
- Family offices investing regionally
- Strategic investors

OUTPUT:
- Investor network diagram (text description)
- Shared investor connections to leverage
- Portfolio company relationships
- Introduction opportunities
`,

  /**
   * Map board network for a sector
   */
  mapBoardNetwork: (industry: string, province?: string) => `
Map the BOARD NETWORK in the ${industry} sector${province ? ` in ${province}` : ' in Atlantic Canada'}.

Research:
1. Major companies in ${industry}
2. Board composition of each
3. Directors serving on multiple boards
4. Retired executives on advisory boards

For each company:
- List board members
- Note their other board positions
- Identify shared directors

Create:
- Network map of board connections
- List of "super-connectors" (directors on 3+ boards)
- Potential introduction paths through board members

Save:
- Each company profile
- Key people (board members)
- Connections between companies via boards
`,

  /**
   * Find conference/event connections
   */
  findEventConnections: (companyName: string) => `
Find CONFERENCE and EVENT CONNECTIONS to ${companyName}.

Search for:
1. Industry conferences attended/spoken at
2. Business award ceremonies
3. Trade shows and exhibitions
4. Networking events
5. Panel discussions

Look for:
- Atlantic Business Magazine events
- Industry-specific conferences
- University events (Dal, Acadia)
- Chamber of Commerce events
- Ocean Supercluster events

For executives of ${companyName}:
- Speaking engagements
- Award nominations/wins
- Panel participation
- Event sponsorship

Identify:
- Shared event attendance with Ken/MPA network
- Introduction opportunities at events
- Conversation starters (shared experiences)

Save connections with event details and sources.
`,

  /**
   * Map professional advisor network
   */
  mapAdvisorNetwork: (companyName: string) => `
Map the PROFESSIONAL ADVISOR NETWORK for ${companyName}.

Research:
1. LEGAL
- Which law firm represents them?
- Key lawyers handling corporate/M&A?
- Any litigation that reveals counsel?

2. ACCOUNTING
- Audit firm
- Key partners
- Any disclosed advisory relationships

3. BANKING
- Primary bank relationship
- Investment banking history
- Debt providers

4. CONSULTING/ADVISORY
- Known consultants or advisors
- Industry experts they work with
- Former executives now advising

For Atlantic Canada, key firms:
- Law: Stewart McKelvey, McInnes Cooper, Cox & Palmer
- Accounting: Grant Thornton, BDO, KPMG, Deloitte
- Banks: RBC, BMO, BDC, ACOA

Find:
- Shared advisor relationships
- Introduction opportunities through advisors
- Professional credibility signals

Save all findings with sources.
`,

  /**
   * Find university/philanthropy connections
   */
  findCommunityConnections: (companyName: string) => `
Find COMMUNITY and UNIVERSITY CONNECTIONS to ${companyName}.

Research leadership involvement in:

1. UNIVERSITY BOARDS
- Dalhousie University
- Acadia University
- St. Francis Xavier
- Cape Breton University
- University of New Brunswick
- Memorial University

2. FOUNDATIONS
- Community foundations
- Family foundations
- Hospital foundations
- Education foundations

3. COMMUNITY ORGANIZATIONS
- Chambers of Commerce
- Economic development organizations
- Industry associations
- Non-profit boards

4. PHILANTHROPY
- Major donations
- Named facilities
- Scholarship programs
- Community initiatives

For executives of ${companyName}:
- Board positions held
- Foundation involvement
- Philanthropic activities
- Community leadership

Identify:
- Shared community involvement
- University alumni connections
- Philanthropy-based introductions

Save all connections with specifics and sources.
`
};

// Run standalone if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const companyName = process.argv[2] || 'Imperial Manufacturing Group';
  const task = connectorTasks.findConnectionsToCompany(companyName);

  runConnector(task)
    .then(result => {
      console.log('\n--- Connector Results ---');
      console.log('Session:', result.sessionId);
      console.log('Connections found:', result.results.connections.length);
      console.log('Investors mapped:', result.results.investorsMapped);
      if (result.results.errors.length > 0) {
        console.log('Errors:', result.results.errors);
      }
    })
    .catch(console.error);
}
