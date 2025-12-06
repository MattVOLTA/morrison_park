# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI proof-of-concept for Morrison Park Advisors (MPA), a Canadian investment bank. The project tests whether Claude Code skills can generate actionable M&A deal intelligence for Atlantic Canada mid-market companies.

**Core hypothesis:** AI can surface "Idea Cards" with novel, actionable M&A opportunities by researching companies and identifying succession signals, deal readiness indicators, and potential acquirers.

## Project Structure

- **Research & Strategy Documents** (root): Background on Ken Skinner (MPA), Morrison Park overview, competitive research, ideal customer profile, and the skills-based POC approach
- **`.claude/skills/`**: Claude Code skills for M&A intelligence workflows
- **`idea_cards/`**: Output from the enrichment skill - company profiles and the dashboard HTML

## Key Skill: atlantic-company-enricher

Located at `.claude/skills/atlantic-company-enricher/SKILL.md`

This skill researches Atlantic Canada companies (NS, NB, PEI, NL) for M&A purposes. Key features:
- Structured company profiles with ownership, succession signals, deal readiness
- Succession Scorecard (1-5 ratings across 5 dimensions)
- Potential acquirer identification (strategic + PE buyers)
- **CRITICAL**: Every data point requires a source URL for verification

Invoke when user asks to "research", "enrich", or "profile" an Atlantic Canada company.

## Deployment

Static HTML dashboard hosted on Netlify. Configuration in `netlify.toml`:
- Publish directory: `idea_cards/`
- Single index.html serves the dashboard

## Workflow

1. User provides company names to research
2. Run atlantic-company-enricher skill to generate profiles
3. Output goes to `idea_cards/` as markdown
4. Ken Skinner reviews and scores outputs (accuracy, novelty, actionability)
5. Iterate based on feedback; kill if novelty < 2.5 after 5 companies

## Atlantic Canada Context

- Smaller market where relationships matter significantly
- Many family-held businesses across generations
- Strong regional identity ("Maritimer" vs. "come from away")
- Seasonal industries (fishing, tourism) have different cycles
- Government/university connections often relevant

## Kill Criteria

This is a POC with explicit failure conditions:
- atlantic-company-enricher: Kill if avg novelty < 2.5 after 5 companies
- If 2+ skills killed in Phase 1-2: Stop and reassess core hypothesis
