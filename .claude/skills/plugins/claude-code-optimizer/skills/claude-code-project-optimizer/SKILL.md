---
name: claude-code-project-optimizer
description: Audits projects for Claude Code best practices (hooks, MCP servers, skills, sub-agents, .claude.md). Use when user asks to audit, review, or optimize their Claude Code setup. Provides pragmatic, implementation-ready recommendations based on actual project needs, not theoretical maximization.
---

# Claude Code Project Optimizer

## Purpose

Helps developers understand and adopt Claude Code features through practical analysis and education. Identifies gaps in current setup and provides implementation-ready recommendations that explain both the "what" and the "why" in a way that serves as implicit implementation instructions.

**Key principle**: Recommend features that solve actual problems in this specific project, not features for the sake of using them.

## Core Philosophy

This skill follows the **progressive complexity** principle from the Master Integration Guide:
- Week 1 projects don't need Month 4 complexity
- Start with .claude.md + Hooks (safety first)
- Add layers only when they solve real problems
- Never recommend "use everything because it exists"

## When to Use This Skill

Activate when the user asks to:
- "Audit this project for Claude Code best practices"
- "Review my Claude Code setup"
- "How can I improve my Claude Code configuration?"
- "Analyze this project for optimization opportunities"
- "What Claude Code features should I be using?"

Do NOT activate for:
- General Claude Code questions (that's for documentation)
- New project setup (different workflow)
- Troubleshooting specific features (different skill)

## Audit Workflow

### Phase 1: Project Scan (Automated)

Quickly scan the project to understand current state:

1. **Check for .claude directory structure:**
   - `.claude.md` or `CLAUDE.md` presence and size
   - `.claude/agents/` directory (sub-agents)
   - `.claude/settings.json` or `~/.claude/settings.json` (hooks)
   - `.mcp.json` or `~/.claude.json` (MCP servers)

2. **Assess project characteristics:**
   - Tech stack (package.json, requirements.txt, go.mod, etc.)
   - Project size (file count, complexity)
   - Team context (git history showing multiple contributors?)
   - Build/dev setup (scripts in package.json, Makefile, etc.)

3. **Identify current maturity level:**
   - **Week 1**: No .claude.md or minimal setup
   - **Month 1**: Has .claude.md, maybe some hooks
   - **Month 2**: Has .claude.md + hooks + maybe MCP
   - **Month 4**: Has multiple layers configured

### Phase 2: Targeted Questions (3-5 questions)

Ask questions tailored to gaps found during scan. Focus on understanding **actual pain points**, not theoretical needs.

**Question framework** (select 3-5 based on scan):

**For projects with no/minimal .claude.md:**
- "What do you find yourself repeatedly explaining to Claude about this project?"
- "What mistakes does Claude commonly make with this codebase?"
- "What commands or conventions should Claude always know?"

**For projects missing hooks:**
- "Does Claude ever forget to format code after editing?"
- "Are there files Claude should never be allowed to edit (like .env or package-lock.json)?"
- "Do you need an audit trail of commands Claude executes?"

**For projects that could use MCP:**
- "What external services does this project interact with frequently?" (GitHub, databases, APIs)
- "Do you find yourself manually running the same external commands for Claude?"
- "Would Claude benefit from direct access to live data sources?"

**For projects missing skills:**
- "Do you work on multiple projects that share domain knowledge?" (metrics, API standards, etc.)
- "Do you explain the same business logic or calculations across different codebases?"
- "Are there company-wide standards Claude should know?"

**For projects that could use sub-agents:**
- "Does your context window fill up when Claude explores large parts of the codebase?"
- "Do you wish Claude could review its own code with fresh eyes?"
- "Are there specialized tasks that need isolated focus?" (testing, security auditing, performance profiling)

### Phase 3: Analysis & Recommendations

Apply the decision matrix from `references/integration-guide.md` to determine what belongs where:

**Decision Framework** (from the Master Integration Guide):
```
Is this KNOWLEDGE?
├─ Project-specific? → .claude.md
└─ Cross-project & stable? → Skill

Is this SERVICE ACCESS?
└─ External APIs/databases? → MCP Server

Is this BEHAVIOR?
└─ Specialized mindset/context isolation? → Sub-Agent

Is this ENFORCEMENT?
└─ Must always happen? → Hook
```

**Check for anti-patterns** (from `references/integration-guide.md`):
- Duplication across layers
- Wrong layer for the job (e.g., Skills for project commands)
- Massive .claude.md file (>500 lines)
- No progressive disclosure in Skills
- Knowledge in sub-agent prompts (should be in Skills)

**Check for red flags**:
- Relying on Claude to remember (should be Hook)
- Explaining same thing repeatedly (should be .claude.md or Skill)
- Context filling up (needs sub-agents or better progressive disclosure)
- Inconsistent behavior (missing hooks or unclear .claude.md)

### Phase 4: Generate Recommendations Document

Create `CLAUDE_CODE_AUDIT.md` with this structure:

```markdown
# Claude Code Project Audit
*Generated: [date]*

## Executive Summary

**Current Maturity**: [Week 1 / Month 1 / Month 2 / Month 4]

**What's Working**:
- [List strengths found]

**Key Gaps Identified**:
- [List main opportunities]

**Estimated Impact**: [Time saved per session, errors prevented, context efficiency gained]

---

## Current Configuration

### .claude.md
- Status: [Present/Missing/Needs optimization]
- Size: [X lines]
- Issues: [If any]

### Hooks
- Status: [Present/Missing/Partial]
- Configured: [List hooks found]
- Missing: [Critical gaps]

### MCP Servers
- Status: [Present/Missing]
- Configured: [List servers]
- Opportunities: [Services that could be integrated]

### Skills
- Status: [Present/Missing]
- Installed: [List skills]
- Opportunities: [Cross-project knowledge that could be captured]

### Sub-Agents
- Status: [Present/Missing]
- Configured: [List agents]
- Opportunities: [Workflows that need isolation/specialization]

---

## Recommendations by Priority

### Priority 1: Quick Wins (Implement Today)

#### [Recommendation Title]

**The Gap**: [What's missing and why it matters - specific problem]

**The Impact**: [Quantified or specific consequence]
- Problem: [Concrete issue user experiences]
- Frequency: [How often this happens]
- Cost: [Time wasted, errors introduced, frustration]

**The Solution**: [Detailed explanation that serves as implementation guide]

[Explain WHAT to implement in enough detail that when user approves, Claude knows exactly HOW to do it. Include:
- Where files go
- What configuration looks like
- Key decisions and why
- Project-specific adaptations needed]

**Example for this project**:
```
[Concrete example adapted to their tech stack]
```

**Benefits You'll See**:
- [Specific improvement 1]
- [Specific improvement 2]
- [Quantified benefit if applicable]

**Implementation Time**: [Realistic estimate]

---

[Repeat for each Priority 1 recommendation]

### Priority 2: Foundation Building (Week 1-2)

[Same structure as Priority 1]

### Priority 3: Integration & Scaling (Month 2)

[Same structure as Priority 1]

### Priority 4: Advanced Optimization (Month 3+)

[Same structure as Priority 1, but only if project complexity warrants it]

---

## Implementation Roadmap

### Week 1: Essential Setup
- [ ] [Specific task from Priority 1]
- [ ] [Specific task from Priority 1]
- [ ] [Specific task from Priority 1]

### Week 2: Automation
- [ ] [Specific task from Priority 2]
- [ ] [Specific task from Priority 2]

### Month 2: Knowledge & Integration
- [ ] [Specific task from Priority 3]
- [ ] [Specific task from Priority 3]

### Month 3+: Advanced Workflows
- [ ] [Specific task from Priority 4 - only if applicable]

---

## Decision Rationale

[For major recommendations, explain WHY using the decision matrix]

### Why [Feature X] and not [Feature Y]?

[Use the decision framework from the Master Integration Guide to explain the reasoning. This educates the user on the principles, not just the specific recommendation]

---

## References

For detailed implementation guides:
- .claude.md: See references/claude-md-guide.md
- Hooks: See references/hooks-guide.md
- MCP Servers: See references/mcp-guide.md
- Skills: See references/skills-guide.md
- Sub-Agents: See references/subagents-guide.md
- Integration: See references/integration-guide.md

---

## Next Steps

1. **Review this audit together**: Let's discuss which recommendations make sense for your workflow
2. **Prioritize based on pain points**: What problems are you experiencing most?
3. **Implement progressively**: Start with Priority 1, don't try to do everything at once
4. **Measure impact**: After each implementation, assess if it actually improved your workflow

When you're ready to proceed with any recommendation, just let me know and I'll implement it based on the detailed explanation above.
```

## Important Guidelines

### DO:
- **Explain decisions using the decision matrix** - teach the framework, not just give answers
- **Provide implementation-ready explanations** - detailed enough that approval = implicit instruction
- **Balance all three benefit types**: Problem + Impact + Solution benefit
- **Adapt to project maturity** - Week 1 project gets Week 1 recommendations
- **Reference the best practices guides** - load them on-demand when needed
- **Be pragmatic** - only recommend what solves actual problems
- **Quantify when possible** - "Saves 10 minutes per session" vs "makes things better"

### DON'T:
- **Recommend features just to use them** - every recommendation must solve a real problem
- **Skip to advanced** - respect the progressive complexity principle
- **Over-promise** - be realistic about benefits and effort
- **Generate boilerplate** - each audit should be specific to this project
- **Assume universal needs** - a small solo project has different needs than a team project
- **Force all 5 layers** - some projects genuinely don't need all features

## Conversation Style

After generating the audit:

1. **Present it as a discussion starter**: "I've analyzed your project. Let's review the audit together."
2. **Walk through findings**: Explain what you found and why it matters
3. **Invite prioritization**: "Which of these pain points resonates most with you?"
4. **Clarify any recommendations**: Answer questions about the "why" and "how"
5. **Implement collaboratively**: When user approves, you already have implementation details from the explanations

The goal is **education through practice** - users learn the decision-making framework while adopting features that improve their daily work.

## Reference Materials

When analyzing each layer, consult these comprehensive guides:

- **references/claude-md-guide.md**: .claude.md best practices, sizing, what to include
- **references/hooks-guide.md**: The 5 universal hooks, when to use, security practices
- **references/mcp-guide.md**: MCP vs CLI decisions, progressive disclosure, common inefficiencies
- **references/skills-guide.md**: Progressive disclosure architecture, when Skills vs other layers
- **references/subagents-guide.md**: Context isolation patterns, when sub-agents actually help
- **references/integration-guide.md**: Decision matrix, anti-patterns, how all layers work together

Load these references as needed during analysis - don't try to hold everything in memory at once.

## Success Metrics

A successful audit:
- ✓ User understands WHY recommendations were made (learned the framework)
- ✓ Recommendations solve actual problems user experiences
- ✓ Implementation is clear enough to proceed immediately after approval
- ✓ User can apply the decision framework to future questions independently
- ✓ Nothing recommended that doesn't have clear practical benefit

Remember: The goal isn't maximum feature adoption - it's maximum workflow improvement through pragmatic, progressive feature adoption.
