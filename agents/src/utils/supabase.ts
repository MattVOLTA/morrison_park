import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/index.js';

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    }

    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

// Company operations
export async function upsertCompany(company: Database['public']['Tables']['companies']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('companies')
    .upsert(company, { onConflict: 'name' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCompanyByName(name: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .ilike('name', `%${name}%`)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getAllCompanies() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('company_dashboard_view')
    .select('*')
    .order('succession_composite', { ascending: false });

  if (error) throw error;
  return data;
}

// Signal operations
export async function insertSignal(signal: Database['public']['Tables']['signals']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('signals')
    .insert(signal)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSignalsByCompany(companyId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('company_id', companyId)
    .order('signal_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRecentSignals(limit = 20) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('signals')
    .select(`
      *,
      companies (name, province, industry)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Connection operations
export async function insertConnection(connection: Database['public']['Tables']['connections']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('connections')
    .insert(connection)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConnectionsByCompany(companyId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('company_id', companyId);

  if (error) throw error;
  return data;
}

// Investor operations
export async function upsertInvestor(investor: Database['public']['Tables']['investors']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('investors')
    .upsert(investor, { onConflict: 'name' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function linkCompanyInvestor(link: Database['public']['Tables']['company_investors']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('company_investors')
    .upsert(link, { onConflict: 'company_id,investor_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInvestorsByCompany(companyId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('company_investors')
    .select(`
      *,
      investors (*)
    `)
    .eq('company_id', companyId);

  if (error) throw error;
  return data;
}

export async function getCompaniesByInvestor(investorId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('company_investors')
    .select(`
      *,
      companies (*)
    `)
    .eq('investor_id', investorId);

  if (error) throw error;
  return data;
}

// Pipeline operations
export async function upsertPipeline(pipeline: Database['public']['Tables']['pipeline']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('pipeline')
    .upsert(pipeline, { onConflict: 'company_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPipelineByStage(stage: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('pipeline')
    .select(`
      *,
      companies (name, province, industry, succession_readiness)
    `)
    .eq('stage', stage)
    .order('priority', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActivePipeline() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('pipeline')
    .select(`
      *,
      companies (name, province, industry, succession_readiness)
    `)
    .not('stage', 'in', '("closed","passed")')
    .order('priority', { ascending: false });

  if (error) throw error;
  return data;
}

// Key people operations
export async function insertKeyPerson(person: Database['public']['Tables']['key_people']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('key_people')
    .insert(person)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Research sources operations
export async function insertResearchSource(source: Database['public']['Tables']['research_sources']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('research_sources')
    .insert(source)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Potential acquirers operations
export async function insertPotentialAcquirer(acquirer: Database['public']['Tables']['potential_acquirers']['Insert']) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('potential_acquirers')
    .insert(acquirer)
    .select()
    .single();

  if (error) throw error;
  return data;
}
