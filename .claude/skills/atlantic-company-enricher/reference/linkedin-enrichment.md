# LinkedIn Enrichment Reference

## ScrapingDog API Quick Reference

### Profile Endpoint
- URL: `https://api.scrapingdog.com/profile/`
- Auth: `api_key` query param (retrieve from OutworkOS Vault via `get_user_secret('scrapingdog_api_key')`)
- Key params: `type=profile`, `id={linkedin_slug}`
- Cost: 50 credits (100 if CAPTCHA-protected with `premium=true`)
- Handle 202: Retry in 2-3 minutes

**Example:**
```
GET https://api.scrapingdog.com/profile/?api_key={key}&type=profile&id=kenskinnermpa
```

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `api_key` | Yes | From Vault |
| `type` | Yes | `"profile"` |
| `id` | Yes | LinkedIn username/slug (e.g., `"kenskinnermpa"`) |
| `premium` | No | `true` for CAPTCHA-protected profiles (costs 100 credits instead of 50) |
| `scheduling` | No | `true` to schedule 2-3 min ahead (increases success rate) |

### Post Endpoint
- URL: `https://api.scrapingdog.com/profile/post`
- Auth: `api_key` query param
- Key params: `id={post_id}`
- Cost: 5 credits

**Example:**
```
GET https://api.scrapingdog.com/profile/post?api_key={key}&id={post_id}
```

### Response Codes
- **200**: Data returned successfully
- **202**: Request accepted, not ready yet (retry in 2-3 min). Not charged.
- **400/404**: Profile unavailable or inaccessible

### Post Discovery (ScrapingDog can't enumerate posts)
Use Perplexity or web search:
- `site:linkedin.com/posts/ "Person Name"`
- `site:linkedin.com/feed/update/ "Person Name"`
- `"Person Name" linkedin [industry keyword]`

### Credit Budget Per Company

| Action | Credits | Notes |
|--------|---------|-------|
| 3-5 key people profiles | 150-250 | 50 credits each |
| 3-5 posts per person | 45-75 | 5 credits each, ~3 posts per person |
| 1 company page (optional) | 100 | For company-level LinkedIn data |
| **Total per company** | **~200-425** | Varies by number of key people |

## Theme Synthesis Guidelines

When analyzing a person's LinkedIn activity, look for:

### Business Themes
- Industry trends they comment on
- Business challenges they discuss
- Growth strategies they advocate
- Technology adoption perspectives

### Personal Themes
- Community involvement
- Mentorship / next-gen development
- Work-life balance perspectives
- Hobbies or passions they share publicly

### Connection Angles for Ken
- Shared Atlantic Canada identity
- Mutual industry interests
- Common professional networks (ACG, JA, chambers)
- Complementary perspectives (they care about X, Ken can help with X)

## Conversation Starter Templates

Good starters are:
- **Specific**: Reference an actual post or theme, not generic flattery
- **Genuine**: Align with Ken's actual interests and expertise
- **Opening**: Create a natural bridge to a deeper conversation
- **Non-transactional**: Not "I see you might want to sell your company"

Examples:
- "I noticed your post about [specific topic] — we're seeing the same thing across our manufacturing clients in the region"
- "Your perspective on [topic] resonated — especially the point about [specific detail]"
- "We have a mutual connection through [association/event] — [person name] suggested we connect"

## Handling Edge Cases

### Person has no LinkedIn profile
- Note "LinkedIn: Not found" in the profile
- Still search for their name + company for any public social presence
- Focus conversation starters on company-level research instead

### Person has LinkedIn but no posts
- Still valuable: headline, about section, career history
- Note "No recent public posts found"
- Use their about section and career arc for conversation angles

### CAPTCHA-protected profile
- First attempt with `premium=false` (50 credits)
- If it fails, retry with `premium=true` (100 credits)
- If still fails, note as "LinkedIn profile restricted"

### Rate limiting
- Space requests at least 2 seconds apart
- If ScrapingDog returns errors, back off and retry
- Maximum 10 profile requests per company enrichment run
