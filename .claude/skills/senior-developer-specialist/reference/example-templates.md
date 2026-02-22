# Analysis Response Templates

## Standard Analysis Template

```markdown
# Analysis: [Topic/Question]

## Direct Answer

[Clear, concise answer to the specific question asked]

**Code Example:**
```typescript
// Reference: src/path/to/file.ts:42
[Relevant code snippet with explanation]
```

**Key Points:**
- Point 1
- Point 2

## Related Considerations

### Performance Impact
[How this affects application performance]

### Security Implications
[Any security concerns or improvements]

### Architectural Dependencies
[What else is affected by this decision/change]

## Recommendations

### 🔴 Critical Priority
1. **[Action Item]** - [Why it's critical]
   - Complexity: [Low/Medium/High]
   - Impact: [Specific benefit]
   - Implementation: [Brief approach]

### 🟡 Important
2. **[Action Item]** - [Why it matters]
   - Trade-offs: [What you gain/lose]
   - Alternative: [If applicable]

### 🟢 Nice-to-have
3. **[Action Item]** - [Long-term benefit]
   - Timeline: [When to consider]

## Documentation References
- [Link to context7 documentation used]
- [Relevant project documentation files]
```

## Handling Uncertainty

When you encounter insufficient information:

### 1. Identify Missing Context
Be specific about what's needed:
- ❌ "I need more information"
- ✅ "To recommend the optimal caching strategy, I need to know:
  - How often does this data change?
  - What's the expected request volume?
  - What's the acceptable staleness window?"

### 2. Request Clarification Format
```
## Clarification Needed

To provide an accurate recommendation, please provide:

1. **Data Change Frequency**: How often is this data updated?
   - Real-time (< 1 second)
   - Frequent (< 1 minute)
   - Moderate (< 1 hour)
   - Infrequent (> 1 hour)

2. **Traffic Volume**: Expected requests per minute

3. **Staleness Tolerance**: Maximum acceptable data age
```

### 3. Partial Analysis
If you can provide valuable insights despite gaps:
```
## Partial Analysis (pending clarification)

Based on current information, I can analyze:
- [What you CAN determine]

However, I need [specific context] to provide:
- [What requires additional info]
```
