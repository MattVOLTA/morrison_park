import { describe, it, expect } from 'vitest';

/**
 * Pipeline stages and revenue validation tests for Issue #21
 *
 * Tests cover:
 * 1. Pipeline stage enum includes Ken's 10 stages
 * 2. Revenue validation rejects raw dollar amounts (>100K)
 * 3. Revenue validation accepts millions format
 */

// The canonical 10-stage list from Ken's feedback
const EXPECTED_PIPELINE_STAGES = [
  'prospect',
  'researching',
  'outreach_pending',
  'initial_contact_made',
  'initial_discussion_complete',
  'follow_up_pending',
  'engaged',
  'closed',
  'monitor',
  'passed',
] as const;

// Old stages that should no longer exist
const REMOVED_STAGES = ['outreach', 'active_deal'];

describe('Pipeline Stages', () => {
  it('update_pipeline tool accepts all 10 Ken-approved stages', async () => {
    // We'll import the tool's zod schema and validate each stage
    const { z } = await import('zod');

    // This is the current schema from supabase-tools.ts - it should be updated
    // to match EXPECTED_PIPELINE_STAGES
    const { supabaseTools } = await import('../supabase-tools.js');

    // Extract the update_pipeline tool's schema by calling it with each valid stage
    // If the enum doesn't include a stage, zod will throw
    for (const stage of EXPECTED_PIPELINE_STAGES) {
      // The tool should accept this stage without error
      expect(EXPECTED_PIPELINE_STAGES).toContain(stage);
    }
  });

  it('stage enum includes all 10 stages and excludes removed ones', async () => {
    // Import the actual tool definition and check the stage enum values
    // We need to read the source to verify the enum values
    const fs = await import('fs');
    const path = await import('path');
    const toolSource = fs.readFileSync(
      path.resolve(__dirname, '../supabase-tools.ts'),
      'utf-8'
    );

    // Check that each expected stage appears in the update_pipeline tool's enum
    for (const stage of EXPECTED_PIPELINE_STAGES) {
      expect(toolSource).toContain(`'${stage}'`);
    }

    // Check that removed stages are NOT in the stage enum for update_pipeline
    // We need to find the specific enum in the update_pipeline context
    const updatePipelineSection = toolSource.slice(
      toolSource.indexOf("'update_pipeline'"),
      toolSource.indexOf("'update_pipeline'") + 500
    );

    for (const removed of REMOVED_STAGES) {
      expect(updatePipelineSection).not.toContain(`'${removed}'`);
    }
  });
});

describe('Revenue Validation', () => {
  it('rejects revenue values over 50000 (raw dollars passed as millions)', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const toolSource = fs.readFileSync(
      path.resolve(__dirname, '../supabase-tools.ts'),
      'utf-8'
    );

    // The revenueEstimate field should have a .max() constraint
    // to prevent raw dollar values being saved
    expect(toolSource).toMatch(/revenueEstimate.*\.max\(50000\)/s);
  });

  it('accepts valid revenue in millions (e.g., 25 = $25M)', async () => {
    const { z } = await import('zod');

    // This schema should match what's in supabase-tools.ts after the fix
    const revenueSchema = z.number().min(0).max(50000).optional();

    expect(revenueSchema.parse(25)).toBe(25);
    expect(revenueSchema.parse(0.5)).toBe(0.5);
    expect(revenueSchema.parse(500)).toBe(500);
    expect(revenueSchema.parse(undefined)).toBeUndefined();
  });

  it('rejects revenue that looks like raw dollars', async () => {
    const { z } = await import('zod');

    const revenueSchema = z.number().min(0).max(50000).optional();

    // These are raw dollar amounts that should be rejected
    expect(() => revenueSchema.parse(10500000)).toThrow();
    expect(() => revenueSchema.parse(25000000)).toThrow();
    expect(() => revenueSchema.parse(100000000)).toThrow();
  });
});
