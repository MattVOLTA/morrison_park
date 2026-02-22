# Claude Code Project Optimizer Skill

## Overview

This skill audits projects for Claude Code best practices and provides pragmatic, implementation-ready recommendations. It analyzes the use (or lack) of hooks, MCP servers, skills, sub-agents, and .claude.md files.

**Key principle**: Recommend only what solves actual problems in the specific project, not theoretical feature maximization.

## Skill Activation

The skill activates when users ask to:
- "Audit this project for Claude Code best practices"
- "Review my Claude Code setup"
- "How can I improve my Claude Code configuration?"
- "Analyze this project for optimization opportunities"

## What It Does

1. **Scans project structure** - Identifies current Claude Code setup
2. **Asks targeted questions** - Understands actual pain points (3-5 questions)
3. **Applies decision framework** - Uses the Master Integration Guide's decision matrix
4. **Generates comprehensive audit** - Creates `CLAUDE_CODE_AUDIT.md` with:
   - Current maturity assessment (Week 1 → Month 4)
   - Prioritized recommendations with detailed explanations
   - Implementation roadmap
   - Decision rationale (teaches the framework)

## Progressive Disclosure

The skill follows progressive disclosure:
- **SKILL.md**: Lean workflow and process (~500 words)
- **references/**: Detailed best practices guides (loaded on-demand)
  - `claude-md-guide.md` → CLAUDE_MD_BEST_PRACTICES.md
  - `hooks-guide.md` → HOOKS_BEST_PRACTICES.md
  - `mcp-guide.md` → MCP_SERVERS_BEST_PRACTICES.md
  - `skills-guide.md` → SKILLS_BEST_PRACTICES.md
  - `subagents-guide.md` → SUBAGENTS_BEST_PRACTICES.md
  - `integration-guide.md` → MASTER_INTEGRATION_GUIDE.md

## Output Format

Generates a single comprehensive document: `CLAUDE_CODE_AUDIT.md`

Each recommendation includes:
- **The Gap**: What's missing and why it matters
- **The Impact**: Quantified consequences (time, errors, context usage)
- **The Solution**: Implementation-ready explanation (approval = implicit instruction)
- **Benefits**: Specific improvements the user will see
- **Implementation Time**: Realistic estimate

## Philosophy

### High Freedom with Implementation-Ready Explanations
The skill uses high freedom - it adapts explanations to each project's context, but those explanations are detailed enough to serve as implicit implementation instructions. When the user approves a recommendation, Claude already knows exactly how to implement it from the explanation.

### Education Through Practice
Users don't just get recommendations - they learn the decision-making framework (the decision matrix from the Master Integration Guide) so they can apply it independently in the future.

### Pragmatic, Not Theoretical
Every recommendation must solve an actual problem the user experiences. The skill explicitly avoids:
- Recommending features just to use them
- Forcing all 5 layers on every project
- Skipping to Month 4 complexity for Week 1 projects
- Over-promising benefits or minimizing effort

## Testing the Skill

### Test Case 1: Minimal Project (Week 1)
```
Project: New React app, no .claude.md, no hooks
Expected: Recommend .claude.md + protected files hook (essentials only)
Should NOT recommend: Skills, sub-agents, complex MCP setup
```

### Test Case 2: Growing Project (Month 1)
```
Project: Has .claude.md (800 lines!), no hooks, uses GitHub manually
Expected:
- Prune .claude.md
- Add formatting + protected files hooks
- Recommend GitHub MCP server
Should NOT recommend: Advanced sub-agents, multiple skills
```

### Test Case 3: Team Project (Month 2+)
```
Project: Has .claude.md, basic hooks, uses external services, multiple repos
Expected:
- Identify cross-project knowledge → Skills
- External services → MCP servers
- Large codebase exploration → Explore sub-agent
Should: Follow progressive complexity, prioritize by actual pain points
```

## Usage Example

```
User: "Can you audit this project for Claude Code best practices?"

Claude (loads claude-code-project-optimizer skill):
1. Scans project structure
2. Asks 3-5 targeted questions about pain points
3. Analyzes using decision matrix
4. Generates CLAUDE_CODE_AUDIT.md
5. Walks through findings collaboratively
6. Implements approved recommendations
```

## Success Criteria

A successful audit:
- ✓ User understands WHY recommendations were made
- ✓ Recommendations solve actual problems user experiences
- ✓ Implementation is clear enough to proceed after approval
- ✓ User learns the decision framework for future application
- ✓ Nothing recommended without clear practical benefit

## File Structure

```
claude-code-project-optimizer/
├── SKILL.md                    # Core workflow (~500 words)
├── README.md                   # This file
└── references/                 # Reference materials (loaded on-demand)
    ├── claude-md-guide.md     → ../../../CLAUDE_MD_BEST_PRACTICES.md
    ├── hooks-guide.md         → ../../../HOOKS_BEST_PRACTICES.md
    ├── mcp-guide.md           → ../../../MCP_SERVERS_BEST_PRACTICES.md
    ├── skills-guide.md        → ../../../SKILLS_BEST_PRACTICES.md
    ├── subagents-guide.md     → ../../../SUBAGENTS_BEST_PRACTICES.md
    └── integration-guide.md   → ../../../MASTER_INTEGRATION_GUIDE.md
```

## Integration with Other Skills

This skill complements but doesn't overlap with:
- **skill-developer**: Creates new skills (this one analyzes if skills are needed)
- **Documentation skills**: Provides how-to guides (this one audits current state)
- **Setup assistants**: Configure new projects (this one optimizes existing ones)

## Maintenance

The reference materials are symbolic links to the source best practices guides. When those guides are updated, the skill automatically uses the latest version.

To update the skill's core workflow:
- Edit `SKILL.md` to change audit process, questions, or output format
- Reference guides update independently
- Test with representative projects after changes

## Version

- **Created**: December 10, 2024
- **Based on**: Master Integration Guide (5-layer architecture)
- **Target**: Claude Code developers wanting to optimize their setup
- **Platforms**: Claude.ai, Claude Code CLI, Claude API

---

## The Goal

**Enable developers to adopt Claude Code features through education and practical application.**

Not "use everything because it exists" - but "use what solves your actual problems, understand why it works, and learn to make these decisions yourself."
