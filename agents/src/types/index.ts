// Re-export database types
export * from '../../../idea_cards/types/database.types.js';

// Agent-specific types

export interface AgentConfig {
  name: string;
  description: string;
  model: 'sonnet' | 'haiku' | 'opus';
  tools: string[];
  systemPrompt: string;
}

export interface SignalDetection {
  companyName: string;
  signalType: 'sell_side' | 'buy_side' | 'growth' | 'leadership' | 'financial' | 'strategic';
  signalCategory: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
  signalDate?: Date;
}

export interface CompanyResearch {
  companyId?: string;
  name: string;
  legalName?: string;
  location: string;
  province: 'NS' | 'NB' | 'PEI' | 'NL';
  industry?: string;
  foundedYear?: number;
  website?: string;
  ownershipType?: 'founder-owned' | 'family-held' | 'employee-owned' | 'pe-backed' | 'public' | 'other';
  revenueEstimate?: number;
  employeeCount?: number;
  successionScores?: {
    ownerAge: number;
    tenure: number;
    nextGenClarity: number;
    legacySignals: number;
    activityTrajectory: number;
  };
  keyPeople?: KeyPersonResearch[];
  signals?: SignalDetection[];
  connections?: ConnectionResearch[];
  sources?: SourceResearch[];
}

export interface KeyPersonResearch {
  name: string;
  title?: string;
  role: 'owner' | 'executive' | 'board' | 'other';
  ownershipPercentage?: number;
  ageEstimate?: number;
  tenureYears?: number;
  linkedinUrl?: string;
  notes?: string;
  sourceUrl: string;
}

export interface ConnectionResearch {
  connectionType: 'board' | 'conference' | 'philanthropy' | 'advisor' | 'alumni' | 'investor' | 'personal' | 'other';
  connectionDetail: string;
  potentialIntroducer?: string;
  introducerRelationship?: string;
  sourceUrl: string;
}

export interface SourceResearch {
  sourceName: string;
  sourceUrl: string;
  sourceType: 'company_website' | 'press_release' | 'news' | 'linkedin' | 'industry_report' | 'government_filing' | 'other';
  dataPoints?: string[];
  confidence: 'high' | 'medium-high' | 'medium' | 'low';
}

export interface InvestorResearch {
  name: string;
  investorType: 'pe' | 'family_office' | 'strategic' | 'angel' | 'institutional';
  website?: string;
  sectors?: string[];
  geographicFocus?: string[];
  portfolioCompanies?: string[];
  sourceUrl: string;
}

export interface PipelineUpdate {
  companyId: string;
  stage: 'prospect' | 'researching' | 'outreach' | 'engaged' | 'active_deal' | 'closed' | 'passed';
  priority: 1 | 2 | 3 | 4 | 5;
  clientType: 'sell_side' | 'buy_side' | 'growth_capital';
  nextAction?: string;
  nextActionDate?: Date;
  notes?: string;
}

// Agent message types
export type AgentMessageType =
  | 'system'
  | 'assistant'
  | 'tool_call'
  | 'tool_result'
  | 'error';

export interface AgentMessage {
  type: AgentMessageType;
  content?: string;
  toolName?: string;
  input?: Record<string, unknown>;
  result?: unknown;
  error?: Error;
  sessionId?: string;
  subagentName?: string;
}

// Task routing types for orchestrator
export interface TaskRequest {
  id: string;
  type: 'prospect' | 'research' | 'connect' | 'pipeline_update';
  companyName?: string;
  companyId?: string;
  query?: string;
  priority: number;
  createdAt: Date;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  agentUsed: string;
  data?: unknown;
  error?: string;
  completedAt: Date;
}
