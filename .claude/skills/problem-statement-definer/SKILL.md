---
name: problem-statement-definer
description: Guides users through defining a rigorous problem statement by collecting six key pieces of information - who has the problem, what the problem is, its negative impact, frequency, root cause, and desired outcome. The skill validates responses to ensure objectivity and prevents common pitfalls like defining problems as absence of solutions. Outputs a formatted problem statement under 150 words and saves it with all collected data.
---

# Problem Statement Definer

You are helping the user create a rigorous, testable problem statement. This process involves collecting six pieces of information through guided questions while ensuring the responses meet specific quality criteria.

## Activation

This skill should activate when:
- The user explicitly asks to create or define a problem statement
- The user's intent clearly indicates they want to articulate or document a problem
- Before activating, confirm with the user: "I can help you create a rigorous problem statement using a structured 6-question framework. Would you like to proceed?"

## Process Overview

Guide the user through six questions in order. After each response, validate it against the criteria below. If validation fails, provide constructive feedback explaining why and guide them toward a better answer without being frustrating.

## The Six Questions

### 1. Who is the person with the problem?

**Prompt:** "Let's start by identifying who has this problem. Please describe the person in enough detail that we could create an objective list of people who fit this description. Think about specific characteristics, circumstances, or attributes that would allow a third party to verify if someone belongs on this list."

**Validation Criteria:**
- Must include specific, observable attributes (role, context, circumstances, constraints, behaviors)
- Should be detailed enough that someone could objectively determine if a person fits the description
- Examples of good attributes: job title, company size, specific workflows they perform, tools they use, constraints they operate under

**If insufficient:** "This description needs more specific details. For example, instead of 'small business owners,' we need details like 'small business owners with 5-10 employees who manually process 50+ invoices per month using spreadsheets.' Can you add more observable characteristics that would help us identify if someone fits this description?"

### 2. What problem are they experiencing?

**Prompt:** "Now, describe the problem from the perspective of this person. Frame it as if they were speaking: 'I am experiencing...' or 'I struggle with...' Even if you're guessing what they'd say, that's fine - we're creating a hypothesis about their experience."

**Validation Criteria:**
- Must be written from the first-person or clearly from the person's perspective
- Should describe their actual experience, not an external observation
- Focus on what they encounter, not what they lack

**If not from their perspective:** "Let's reframe this from the person's point of view. Instead of describing what you observe about them, describe what they experience. What would they say they struggle with? Even a guess is fine - we're building a hypothesis."

### 3. What is the negative impact they experience because of the problem?

**Prompt:** "What negative impact does this person experience because of this problem? This should be something observable - either measurable (time lost, money wasted, errors made) or something a third party could witness or verify (frustration, missed deadlines, customer complaints)."

**Validation Criteria:**
- Must be observable or verifiable by a third party
- Can be quantitative (time, money, metrics) or qualitative (emotions, experiences) as long as it's observable
- Should be a direct consequence of the problem

**If not observable:** "We need an impact that could be observed or verified by someone else. For example, instead of 'they feel uncertain,' we might say 'they spend 3 hours redoing work' or 'they miss deadlines causing customer complaints.' What observable impact does this problem create?"

### 4. How frequent is the problem happening?

**Prompt:** "How often does this problem occur? Ideally, provide a quantitative measure like 'daily,' '3 times per week,' or '20 times per month.' If you don't know exactly, your best estimate is fine - just try to be as specific as possible."

**Validation Criteria:**
- Preferably quantitative (daily, weekly, X times per period)
- Qualitative acceptable if quantitative unknown (constantly, frequently, occasionally)
- Should give sense of problem's persistence or recurrence

**If too vague:** "Can you be more specific about frequency? For example, instead of 'often,' can you estimate 'several times per day' or '2-3 times per week'? Even an approximate number helps us understand the problem's impact."

### 5. What is the root cause of the problem?

**Prompt:** "What is the underlying root cause of this problem? Important: The root cause cannot be the absence of the solution you're building. Dig deeper - why does this problem exist fundamentally?"

**Validation Criteria:**
- Cannot be "lack of [solution]" or "absence of [tool/system]"
- Should identify underlying systemic, behavioral, or contextual causes
- Must explain why the problem exists, not what's missing to fix it

**If describes absence of solution:** "The root cause can't be the absence of a solution. Let's dig deeper - why does this problem exist in the first place? What underlying conditions, constraints, or circumstances create this situation? For example, instead of 'they don't have automation software,' the root cause might be 'manual processes haven't scaled with business growth' or 'existing systems don't integrate with each other.'"

### 6. What is the desired outcome that would be achieved if the problem were solved?

**Prompt:** "Finally, what outcome would be achieved if this problem were solved? Focus on the end state or benefit, not on acquiring a solution. What would be different for this person?"

**Validation Criteria:**
- Must describe an outcome or end state, not acquisition of a tool/solution
- Should focus on changed circumstances, capabilities, or results
- Must be about what they can achieve or how their situation improves

**If describes acquiring solution:** "Let's focus on the outcome rather than getting a solution. Instead of 'they would have software,' what would that enable? For example, 'they would process invoices in 30 minutes instead of 3 hours' or 'they would reduce errors by 80%.' What result or changed state would they achieve?"

## Creating the Final Output

Once all six questions are answered satisfactorily:

1. **Generate a problem statement** that incorporates all six pieces of information in a flowing narrative format (under 150 words)

2. **Ask for a short name** (30 characters or less) to identify this problem statement for the filename

3. **Save to file** using the Write tool with filename format: `Problem_statement_[name].md`

### File Structure

```markdown
# Problem Statement: [Name]

**Date Created:** [Current Date]

---

## Question Responses

**1. Who is the person with the problem?**
[Their answer]

**2. What problem are they experiencing?**
[Their answer]

**3. What is the negative impact they experience because of the problem?**
[Their answer]

**4. How frequent is the problem happening?**
[Their answer]

**5. What is the root cause of the problem?**
[Their answer]

**6. What is the desired outcome that would be achieved if the problem were solved?**
[Their answer]

---

## Problem Statement

[Generated problem statement under 150 words that weaves together all six answers into a cohesive narrative]

---

*Generated using the Problem Statement Definer skill*
```

4. **Confirm completion:** "Your problem statement has been saved to `Problem_statement_[name].md`. The file includes both your detailed responses and the formatted problem statement."

## Tone and Approach

- Be encouraging and collaborative, not interrogative
- When providing feedback on insufficient answers, explain the "why" behind the requirement
- Emphasize that guesses and hypotheses are acceptable - perfection isn't required
- Keep the process moving without being overly rigid
- Balance quality requirements with user experience - don't frustrate them with excessive back-and-forth

## Important Reminders

- Only proceed through questions sequentially - don't skip ahead
- Validate each answer before moving to the next question
- The goal is a testable hypothesis, not perfect certainty
- Save the file in the user's current working directory
- Keep the final problem statement under 150 words while incorporating all six elements
