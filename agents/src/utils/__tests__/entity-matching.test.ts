import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Entity matching tests for Issue #22
 *
 * Bug: getCompanyByName uses substring matching (.ilike('%name%'))
 * which causes "Nova Leap" to match "NovaResp" or "Novagevity".
 *
 * Fix: Try exact match first (case-insensitive), fall back to substring
 * only if no exact match found.
 */

// Mock the Supabase client
const mockSelect = vi.fn();
const mockIlike = vi.fn();
const mockLimit = vi.fn();
const mockMaybeSingle = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

// Need to reset module cache so getSupabaseClient creates a fresh client
beforeEach(() => {
  vi.clearAllMocks();

  // Chain: from('companies').select('*').ilike('name', ...).limit(1).maybeSingle()
  mockFrom.mockReturnValue({ select: mockSelect });
  mockSelect.mockReturnValue({ ilike: mockIlike });
  mockIlike.mockReturnValue({ limit: mockLimit });
  mockLimit.mockReturnValue({ maybeSingle: mockMaybeSingle, single: mockSingle });

  // Set env vars for Supabase client initialization
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test-key';
});

describe('getCompanyByName - Entity Matching', () => {
  it('returns exact match when company name matches exactly (case-insensitive)', async () => {
    const novaLeap = { id: '1', name: 'Nova Leap Health Corp' };

    // Exact match succeeds
    mockMaybeSingle.mockResolvedValueOnce({ data: novaLeap, error: null });

    // Re-import to get fresh module with mocked deps
    const { getCompanyByName } = await import('../supabase.js');

    const result = await getCompanyByName('Nova Leap Health Corp');

    // Should have called ilike with exact name (no % wildcards)
    expect(mockIlike).toHaveBeenCalledWith('name', 'Nova Leap Health Corp');
    expect(result).toEqual(novaLeap);
  });

  it('does NOT fall back to substring when exact match succeeds', async () => {
    const novaLeap = { id: '1', name: 'Nova Leap Health Corp' };

    // Exact match succeeds
    mockMaybeSingle.mockResolvedValueOnce({ data: novaLeap, error: null });

    const { getCompanyByName } = await import('../supabase.js');
    await getCompanyByName('Nova Leap Health Corp');

    // ilike should only be called ONCE (exact match), not twice (no fallback)
    expect(mockIlike).toHaveBeenCalledTimes(1);
  });

  it('falls back to substring match when no exact match found', async () => {
    const novaLeap = { id: '1', name: 'Nova Leap Health Corp' };

    // Exact match returns null
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    // Substring fallback returns result
    mockMaybeSingle.mockResolvedValueOnce({ data: novaLeap, error: null });

    const { getCompanyByName } = await import('../supabase.js');
    const result = await getCompanyByName('Nova Leap');

    // First call: exact match (no wildcards)
    expect(mockIlike).toHaveBeenNthCalledWith(1, 'name', 'Nova Leap');
    // Second call: substring match (with wildcards)
    expect(mockIlike).toHaveBeenNthCalledWith(2, 'name', '%Nova Leap%');
    expect(result).toEqual(novaLeap);
  });

  it('returns null when neither exact nor substring match found', async () => {
    // Both attempts return null
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const { getCompanyByName } = await import('../supabase.js');
    const result = await getCompanyByName('Nonexistent Corp');

    expect(result).toBeNull();
  });

  it('uses maybeSingle instead of single to avoid PGRST116 errors', async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const { getCompanyByName } = await import('../supabase.js');
    await getCompanyByName('Anything');

    // Should use maybeSingle (returns null for no rows) not single (throws for no rows)
    expect(mockMaybeSingle).toHaveBeenCalled();
    expect(mockSingle).not.toHaveBeenCalled();
  });
});
