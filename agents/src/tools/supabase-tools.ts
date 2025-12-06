import { createSdkMcpServer, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import * as db from '../utils/supabase.js';

/**
 * Custom MCP tools for Supabase database operations
 * These tools allow agents to persist research findings and track pipeline state
 */
export const supabaseTools = createSdkMcpServer({
  name: 'mpa-supabase',
  version: '1.0.0',
  tools: [
    // Company operations
    tool(
      'save_company',
      'Save or update a company profile in the database. Use this after researching a company.',
      {
        name: z.string().describe('Company name'),
        legalName: z.string().optional().describe('Legal/registered company name'),
        location: z.string().describe('City or town location'),
        province: z.enum(['NS', 'NB', 'PEI', 'NL']).describe('Atlantic Canada province'),
        industry: z.string().optional().describe('Primary industry'),
        foundedYear: z.number().optional().describe('Year the company was founded'),
        website: z.string().url().optional().describe('Company website URL'),
        ownershipType: z.enum(['founder-owned', 'family-held', 'employee-owned', 'pe-backed', 'public', 'other']).optional(),
        revenueEstimate: z.number().optional().describe('Estimated annual revenue in millions CAD'),
        employeeCount: z.number().optional().describe('Number of employees'),
        scoreOwnerAge: z.number().min(1).max(5).optional().describe('Succession score: owner age (1-5)'),
        scoreTenure: z.number().min(1).max(5).optional().describe('Succession score: tenure (1-5)'),
        scoreNextgenClarity: z.number().min(1).max(5).optional().describe('Succession score: next-gen clarity (1-5)'),
        scoreLegacySignals: z.number().min(1).max(5).optional().describe('Succession score: legacy signals (1-5)'),
        scoreActivityTrajectory: z.number().min(1).max(5).optional().describe('Succession score: activity trajectory (1-5)'),
        confidence: z.enum(['high', 'medium', 'low']).optional().describe('Overall research confidence'),
        markdownContent: z.string().optional().describe('Full markdown profile content')
      },
      async (args) => {
        try {
          const company = await db.upsertCompany({
            name: args.name,
            legal_name: args.legalName,
            location: args.location,
            province: args.province,
            industry: args.industry,
            founded_year: args.foundedYear,
            website: args.website,
            ownership_type: args.ownershipType,
            revenue_estimate: args.revenueEstimate,
            employee_count: args.employeeCount,
            score_owner_age: args.scoreOwnerAge,
            score_tenure: args.scoreTenure,
            score_nextgen_clarity: args.scoreNextgenClarity,
            score_legacy_signals: args.scoreLegacySignals,
            score_activity_trajectory: args.scoreActivityTrajectory,
            confidence: args.confidence,
            markdown_content: args.markdownContent
          });
          return {
            content: [{ type: 'text', text: `Company saved: ${company.name} (ID: ${company.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error saving company: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'get_company',
      'Look up a company by name in the database',
      {
        name: z.string().describe('Company name to search for')
      },
      async (args) => {
        try {
          const company = await db.getCompanyByName(args.name);
          if (!company) {
            return {
              content: [{ type: 'text', text: `No company found matching "${args.name}"` }]
            };
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(company, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'list_companies',
      'Get all companies from the database, sorted by succession score',
      {},
      async () => {
        try {
          const companies = await db.getAllCompanies();
          return {
            content: [{ type: 'text', text: JSON.stringify(companies, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Signal operations
    tool(
      'save_signal',
      'Record a transaction signal detected for a company. CRITICAL: Always include source_url.',
      {
        companyId: z.string().uuid().describe('Company UUID'),
        signalType: z.enum(['sell_side', 'buy_side', 'growth', 'leadership', 'financial', 'strategic']).describe('Type of signal'),
        signalCategory: z.string().describe('Specific category (e.g., "owner_age", "new_contract", "ceo_hire")'),
        description: z.string().describe('Detailed description of the signal'),
        sourceUrl: z.string().url().describe('URL source for this signal - REQUIRED'),
        confidence: z.enum(['high', 'medium', 'low']).describe('Confidence level'),
        signalDate: z.string().optional().describe('Date of the signal (ISO format)')
      },
      async (args) => {
        try {
          const signal = await db.insertSignal({
            company_id: args.companyId,
            signal_type: args.signalType,
            signal_category: args.signalCategory,
            description: args.description,
            source_url: args.sourceUrl,
            confidence: args.confidence,
            signal_date: args.signalDate
          });
          return {
            content: [{ type: 'text', text: `Signal saved: ${args.signalType} - ${args.signalCategory} (ID: ${signal.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error saving signal: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'get_signals',
      'Get all signals for a company',
      {
        companyId: z.string().uuid().describe('Company UUID')
      },
      async (args) => {
        try {
          const signals = await db.getSignalsByCompany(args.companyId);
          return {
            content: [{ type: 'text', text: JSON.stringify(signals, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'get_recent_signals',
      'Get the most recent signals across all companies',
      {
        limit: z.number().min(1).max(100).default(20).describe('Number of signals to return')
      },
      async (args) => {
        try {
          const signals = await db.getRecentSignals(args.limit);
          return {
            content: [{ type: 'text', text: JSON.stringify(signals, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Connection operations
    tool(
      'save_connection',
      'Save a relationship/connection path to a company. Use for warm intro mapping.',
      {
        companyId: z.string().uuid().describe('Company UUID'),
        connectionType: z.enum(['board', 'conference', 'philanthropy', 'advisor', 'alumni', 'investor', 'personal', 'other']),
        connectionDetail: z.string().describe('Details about the connection'),
        potentialIntroducer: z.string().optional().describe('Name of person who could make introduction'),
        introducerRelationship: z.string().optional().describe('How Ken/MPA knows the introducer'),
        sourceUrl: z.string().url().describe('URL source for this connection - REQUIRED')
      },
      async (args) => {
        try {
          const connection = await db.insertConnection({
            company_id: args.companyId,
            connection_type: args.connectionType,
            connection_detail: args.connectionDetail,
            potential_introducer: args.potentialIntroducer,
            introducer_relationship: args.introducerRelationship,
            source_url: args.sourceUrl
          });
          return {
            content: [{ type: 'text', text: `Connection saved: ${args.connectionType} (ID: ${connection.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'get_connections',
      'Get all connection paths for a company',
      {
        companyId: z.string().uuid().describe('Company UUID')
      },
      async (args) => {
        try {
          const connections = await db.getConnectionsByCompany(args.companyId);
          return {
            content: [{ type: 'text', text: JSON.stringify(connections, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Investor operations
    tool(
      'save_investor',
      'Save or update an investor profile (PE firm, family office, etc.)',
      {
        name: z.string().describe('Investor name'),
        investorType: z.enum(['pe', 'family_office', 'strategic', 'angel', 'institutional']),
        website: z.string().url().optional(),
        sectors: z.array(z.string()).optional().describe('Industry sectors they invest in'),
        geographicFocus: z.array(z.string()).optional().describe('Geographic regions they focus on'),
        sourceUrl: z.string().url().describe('URL source - REQUIRED')
      },
      async (args) => {
        try {
          const investor = await db.upsertInvestor({
            name: args.name,
            investor_type: args.investorType,
            website: args.website,
            sectors: args.sectors,
            geographic_focus: args.geographicFocus,
            source_url: args.sourceUrl
          });
          return {
            content: [{ type: 'text', text: `Investor saved: ${investor.name} (ID: ${investor.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'link_company_investor',
      'Link a company to an investor (shows shared investor relationships)',
      {
        companyId: z.string().uuid().describe('Company UUID'),
        investorId: z.string().uuid().describe('Investor UUID'),
        investmentDate: z.string().optional().describe('Date of investment (ISO format)'),
        investmentAmount: z.number().optional().describe('Investment amount in millions CAD'),
        boardSeat: z.boolean().default(false).describe('Whether investor has a board seat'),
        sourceUrl: z.string().url().describe('URL source - REQUIRED')
      },
      async (args) => {
        try {
          const link = await db.linkCompanyInvestor({
            company_id: args.companyId,
            investor_id: args.investorId,
            investment_date: args.investmentDate,
            investment_amount: args.investmentAmount,
            board_seat: args.boardSeat,
            source_url: args.sourceUrl
          });
          return {
            content: [{ type: 'text', text: `Company-investor link created (ID: ${link.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'get_shared_investors',
      'Find companies that share investors with a given company',
      {
        companyId: z.string().uuid().describe('Company UUID')
      },
      async (args) => {
        try {
          const investors = await db.getInvestorsByCompany(args.companyId);
          // For each investor, get other companies they've invested in
          const sharedCompanies: Record<string, unknown[]> = {};
          for (const inv of investors) {
            if (inv.investor_id) {
              const otherCompanies = await db.getCompaniesByInvestor(inv.investor_id);
              const filtered = otherCompanies.filter(c => c.company_id !== args.companyId);
              if (filtered.length > 0) {
                sharedCompanies[(inv.investors as { name: string })?.name || inv.investor_id] = filtered;
              }
            }
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(sharedCompanies, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Pipeline operations
    tool(
      'update_pipeline',
      'Update the pipeline stage/priority for a company',
      {
        companyId: z.string().uuid().describe('Company UUID'),
        stage: z.enum(['prospect', 'researching', 'outreach', 'engaged', 'active_deal', 'closed', 'passed']),
        priority: z.number().min(1).max(5).describe('Priority 1-5 (5 is highest)'),
        clientType: z.enum(['sell_side', 'buy_side', 'growth_capital']),
        nextAction: z.string().optional().describe('Next action to take'),
        nextActionDate: z.string().optional().describe('Date for next action (ISO format)'),
        notes: z.string().optional().describe('Pipeline notes')
      },
      async (args) => {
        try {
          const pipeline = await db.upsertPipeline({
            company_id: args.companyId,
            stage: args.stage,
            priority: args.priority,
            client_type: args.clientType,
            next_action: args.nextAction,
            next_action_date: args.nextActionDate,
            notes: args.notes
          });
          return {
            content: [{ type: 'text', text: `Pipeline updated: ${args.stage} (priority: ${args.priority})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    tool(
      'get_pipeline',
      'Get active pipeline (all companies not closed/passed)',
      {},
      async () => {
        try {
          const pipeline = await db.getActivePipeline();
          return {
            content: [{ type: 'text', text: JSON.stringify(pipeline, null, 2) }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Key people operations
    tool(
      'save_key_person',
      'Save a key person (owner, executive, board member) for a company',
      {
        companyId: z.string().uuid().describe('Company UUID'),
        name: z.string().describe('Person name'),
        title: z.string().optional().describe('Job title'),
        role: z.enum(['owner', 'executive', 'board', 'other']),
        ownershipPercentage: z.number().min(0).max(100).optional(),
        ageEstimate: z.number().optional().describe('Estimated age'),
        tenureYears: z.number().optional().describe('Years at company'),
        linkedinUrl: z.string().url().optional(),
        notes: z.string().optional(),
        sourceUrl: z.string().url().describe('URL source - REQUIRED')
      },
      async (args) => {
        try {
          const person = await db.insertKeyPerson({
            company_id: args.companyId,
            name: args.name,
            title: args.title,
            role: args.role,
            ownership_percentage: args.ownershipPercentage,
            age_estimate: args.ageEstimate,
            tenure_years: args.tenureYears,
            linkedin_url: args.linkedinUrl,
            notes: args.notes,
            source_url: args.sourceUrl
          });
          return {
            content: [{ type: 'text', text: `Key person saved: ${person.name} (ID: ${person.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Research source operations
    tool(
      'save_research_source',
      'Save a research source with URL. CRITICAL for M&A credibility.',
      {
        companyId: z.string().uuid().describe('Company UUID'),
        sourceName: z.string().describe('Name/description of the source'),
        sourceUrl: z.string().url().describe('URL - REQUIRED'),
        sourceType: z.enum(['company_website', 'press_release', 'news', 'linkedin', 'industry_report', 'government_filing', 'other']),
        dataPoints: z.array(z.string()).optional().describe('What data points came from this source'),
        confidence: z.enum(['high', 'medium-high', 'medium', 'low'])
      },
      async (args) => {
        try {
          const source = await db.insertResearchSource({
            company_id: args.companyId,
            source_name: args.sourceName,
            source_url: args.sourceUrl,
            source_type: args.sourceType,
            data_points: args.dataPoints,
            confidence: args.confidence
          });
          return {
            content: [{ type: 'text', text: `Source saved: ${source.source_name} (ID: ${source.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    ),

    // Potential acquirer operations
    tool(
      'save_potential_acquirer',
      'Save a potential acquirer for a target company',
      {
        companyId: z.string().uuid().describe('Target company UUID'),
        acquirerName: z.string().describe('Name of potential acquirer'),
        acquirerType: z.enum(['strategic', 'pe', 'family_office']),
        rationale: z.string().optional().describe('Why they would be interested'),
        recentDeals: z.string().optional().describe('Their recent M&A activity'),
        sourceUrl: z.string().url().describe('URL source - REQUIRED')
      },
      async (args) => {
        try {
          const acquirer = await db.insertPotentialAcquirer({
            company_id: args.companyId,
            acquirer_name: args.acquirerName,
            acquirer_type: args.acquirerType,
            rationale: args.rationale,
            recent_deals: args.recentDeals,
            source_url: args.sourceUrl
          });
          return {
            content: [{ type: 'text', text: `Potential acquirer saved: ${acquirer.acquirer_name} (ID: ${acquirer.id})` }]
          };
        } catch (error) {
          return {
            content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
            isError: true
          };
        }
      }
    )
  ]
});
