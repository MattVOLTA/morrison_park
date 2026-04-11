"""
MPA Province Prospector — Scoring Functions

Two eval modes:
  1. Rediscovery — Agent profiles known companies. Measures accuracy.
  2. Prospecting — Agent finds new companies. Measures quality and novelty.
"""

from difflib import SequenceMatcher
from dataclasses import dataclass, field
from typing import Optional, List, Dict


# ═══════════════════════════════════════════════
# Data classes
# ═══════════════════════════════════════════════

@dataclass
class CompanyScore:
    """Score for a single company comparison (rediscovery mode)."""

    name: str
    baseline_name: str
    matched: bool = False
    revenue_accurate: Optional[bool] = None
    revenue_baseline: Optional[float] = None
    revenue_agent: Optional[float] = None
    ownership_match: Optional[bool] = None
    industry_match: Optional[bool] = None
    succession_deltas: dict = field(default_factory=dict)
    key_people_overlap: Optional[float] = None
    source_count: int = 0
    icp_tier: Optional[int] = None
    notes: str = ""


@dataclass
class ProspectScore:
    """Score for a single company in prospecting mode."""

    name: str
    has_revenue: bool = False
    has_ownership_type: bool = False
    has_industry: bool = False
    has_succession_scores: bool = False
    has_website: bool = False
    revenue_in_range: bool = False  # $10M-$500M
    icp_tier: Optional[int] = None
    source_count: int = 0
    key_people_count: int = 0
    signal_count: int = 0
    has_pipeline_entry: bool = False
    completeness: float = 0.0  # 0-1, how many fields populated

    @property
    def research_depth(self):
        """Score 0-10 based on how thorough the research is."""
        score = 0
        if self.has_revenue:
            score += 1
        if self.has_ownership_type:
            score += 1
        if self.has_industry:
            score += 1
        if self.has_succession_scores:
            score += 2
        if self.has_website:
            score += 1
        if self.source_count >= 5:
            score += 2
        elif self.source_count >= 3:
            score += 1
        if self.key_people_count >= 3:
            score += 1
        if self.signal_count >= 1:
            score += 1
        return score


# ═══════════════════════════════════════════════
# Rediscovery Scorecard
# ═══════════════════════════════════════════════

@dataclass
class RediscoveryScorecard:
    """Scorecard for rediscovery eval — agent profiles known companies."""

    province: str
    baseline_count: int = 0
    agent_count: int = 0
    matched_count: int = 0
    company_scores: list = field(default_factory=list)

    @property
    def discovery_rate(self):
        if self.baseline_count == 0:
            return 0
        return self.matched_count / self.baseline_count

    @property
    def revenue_accuracy(self):
        scored = [s for s in self.company_scores if s.revenue_accurate is not None]
        if not scored:
            return 0
        return sum(1 for s in scored if s.revenue_accurate) / len(scored)

    @property
    def ownership_accuracy(self):
        scored = [s for s in self.company_scores if s.ownership_match is not None]
        if not scored:
            return 0
        return sum(1 for s in scored if s.ownership_match) / len(scored)

    @property
    def industry_accuracy(self):
        scored = [s for s in self.company_scores if s.industry_match is not None]
        if not scored:
            return 0
        return sum(1 for s in scored if s.industry_match) / len(scored)

    @property
    def succession_within_1(self):
        deltas = []
        for s in self.company_scores:
            for dim, delta in s.succession_deltas.items():
                if delta is not None:
                    deltas.append(abs(delta))
        if not deltas:
            return 0
        return sum(1 for d in deltas if d <= 1) / len(deltas)

    @property
    def avg_source_count(self):
        counts = [s.source_count for s in self.company_scores if s.source_count > 0]
        if not counts:
            return 0
        return sum(counts) / len(counts)

    def report(self):
        lines = [
            "",
            "=" * 60,
            "REDISCOVERY SCORECARD — %s" % self.province,
            "=" * 60,
            "",
            "Baseline companies:     %d" % self.baseline_count,
            "Agent discoveries:      %d" % self.agent_count,
            "Matched to baseline:    %d" % self.matched_count,
            "",
            "--- Accuracy Metrics ---",
            "",
            "Discovery rate:         %.0f%%  (target: >=70%%)" % (self.discovery_rate * 100),
            "Revenue accuracy:       %.0f%%  (target: >=80%%)" % (self.revenue_accuracy * 100),
            "Ownership match:        %.0f%%  (target: >=90%%)" % (self.ownership_accuracy * 100),
            "Industry match:         %.0f%%  (target: >=85%%)" % (self.industry_accuracy * 100),
            "Succession within +/-1: %.0f%%  (target: >=75%%)" % (self.succession_within_1 * 100),
            "Avg sources/company:    %.1f  (target: >=5)" % self.avg_source_count,
            "",
        ]

        thresholds = {
            "Discovery rate": (self.discovery_rate, 0.70),
            "Revenue accuracy": (self.revenue_accuracy, 0.80),
            "Ownership match": (self.ownership_accuracy, 0.90),
            "Industry match": (self.industry_accuracy, 0.85),
            "Succession scores": (self.succession_within_1, 0.75),
            "Source coverage": (self.avg_source_count / 5 if self.avg_source_count else 0, 1.0),
        }

        lines.append("--- Pass/Fail ---")
        lines.append("")
        all_pass = True
        for name, (value, threshold) in thresholds.items():
            passed = value >= threshold
            if not passed:
                all_pass = False
            lines.append("  [%s] %s" % ("PASS" if passed else "FAIL", name))

        lines.append("")
        verdict = "PASS — ready for production" if all_pass else "FAIL — iterate on system prompt"
        lines.append("Overall: %s" % verdict)

        if self.company_scores:
            lines.append("")
            lines.append("--- Company Details ---")
            lines.append("")
            for cs in self.company_scores:
                if cs.matched:
                    rev_str = ""
                    if cs.revenue_baseline and cs.revenue_agent:
                        pct = abs(cs.revenue_agent - cs.revenue_baseline) / cs.revenue_baseline * 100
                        rev_str = " ($%.0fM vs $%.0fM, %.0f%% off)" % (
                            cs.revenue_agent, cs.revenue_baseline, pct
                        )
                    lines.append(
                        "  %s -> %s  own=%s  ind=%s  rev=%s%s  sources=%d" % (
                            cs.name, cs.baseline_name,
                            "Y" if cs.ownership_match else "N",
                            "Y" if cs.industry_match else "N",
                            "Y" if cs.revenue_accurate else "N",
                            rev_str, cs.source_count,
                        )
                    )
                else:
                    lines.append("  %s (NOT MATCHED)" % cs.name)

        lines.append("")
        lines.append("=" * 60)
        return "\n".join(lines)


# ═══════════════════════════════════════════════
# Prospecting Scorecard
# ═══════════════════════════════════════════════

@dataclass
class ProspectingScorecard:
    """Scorecard for prospecting eval — agent finds new companies."""

    province: str
    existing_count: int = 0
    new_count: int = 0
    qualified_count: int = 0  # passed ICP must-haves
    disqualified_count: int = 0  # correctly rejected
    prospect_scores: list = field(default_factory=list)

    @property
    def avg_research_depth(self):
        if not self.prospect_scores:
            return 0
        return sum(s.research_depth for s in self.prospect_scores) / len(self.prospect_scores)

    @property
    def avg_source_count(self):
        counts = [s.source_count for s in self.prospect_scores]
        if not counts:
            return 0
        return sum(counts) / len(counts)

    @property
    def avg_key_people(self):
        counts = [s.key_people_count for s in self.prospect_scores]
        if not counts:
            return 0
        return sum(counts) / len(counts)

    @property
    def completeness(self):
        if not self.prospect_scores:
            return 0
        return sum(s.completeness for s in self.prospect_scores) / len(self.prospect_scores)

    @property
    def tier_distribution(self):
        tiers = {}
        for s in self.prospect_scores:
            t = s.icp_tier or 0
            tiers[t] = tiers.get(t, 0) + 1
        return tiers

    def report(self):
        lines = [
            "",
            "=" * 60,
            "PROSPECTING SCORECARD — %s" % self.province,
            "=" * 60,
            "",
            "Existing companies:     %d" % self.existing_count,
            "New companies found:    %d" % self.new_count,
            "Qualified (ICP fit):    %d" % self.qualified_count,
            "",
            "--- Quality Metrics ---",
            "",
            "Avg research depth:     %.1f/10  (target: >=6)" % self.avg_research_depth,
            "Avg sources/company:    %.1f  (target: >=5)" % self.avg_source_count,
            "Avg key people/company: %.1f  (target: >=3)" % self.avg_key_people,
            "Data completeness:      %.0f%%  (target: >=70%%)" % (self.completeness * 100),
            "",
        ]

        # ICP tier distribution
        tiers = self.tier_distribution
        lines.append("--- ICP Tier Distribution ---")
        lines.append("")
        for t in [1, 2, 3, 0]:
            count = tiers.get(t, 0)
            label = {1: "Tier 1 (Ideal)", 2: "Tier 2 (Good)", 3: "Tier 3 (Opportunistic)", 0: "Unclassified"}
            lines.append("  %s: %d" % (label[t], count))
        lines.append("")

        # Pass/fail
        thresholds = {
            "New companies found": (self.new_count, 3),
            "Research depth": (self.avg_research_depth, 6.0),
            "Source coverage": (self.avg_source_count, 5.0),
            "Key people coverage": (self.avg_key_people, 3.0),
            "Data completeness": (self.completeness, 0.70),
        }

        lines.append("--- Pass/Fail ---")
        lines.append("")
        all_pass = True
        for name, (value, threshold) in thresholds.items():
            passed = value >= threshold
            if not passed:
                all_pass = False
            lines.append("  [%s] %s (%.1f vs %.1f)" % (
                "PASS" if passed else "FAIL", name, value, threshold
            ))

        lines.append("")
        verdict = "PASS — ready for production" if all_pass else "FAIL — iterate on system prompt"
        lines.append("Overall: %s" % verdict)

        # Per-company details
        if self.prospect_scores:
            lines.append("")
            lines.append("--- Company Details ---")
            lines.append("")
            for ps in self.prospect_scores:
                tier_str = "T%d" % ps.icp_tier if ps.icp_tier else "T?"
                lines.append(
                    "  %s  [%s]  depth=%d/10  sources=%d  people=%d  signals=%d" % (
                        ps.name, tier_str, ps.research_depth,
                        ps.source_count, ps.key_people_count, ps.signal_count,
                    )
                )

        lines.append("")
        lines.append("=" * 60)
        return "\n".join(lines)


# ═══════════════════════════════════════════════
# Name matching (H2: tightened threshold)
# ═══════════════════════════════════════════════

FILLER_WORDS = {"and", "the", "of", "in", "for", "&", "-", "a", "an"}

COMPANY_SUFFIXES = [
    " ltd", " ltd.", " limited", " inc", " inc.", " incorporated",
    " corp", " corp.", " corporation", " co", " co.",
    " group", " holdings", " enterprises",
    " & co", " & company", " llc", " lp",
]


def normalize_name(name):
    """Normalize company name for comparison."""
    name = name.lower().strip()
    for suffix in COMPANY_SUFFIXES:
        if name.endswith(suffix):
            name = name[: -len(suffix)]
    return name.strip()


def significant_words(name):
    """Extract significant (non-filler) words from a company name."""
    normalized = normalize_name(name)
    words = set(normalized.replace("/", " ").replace(",", " ").replace("-", " ").split())
    return words - FILLER_WORDS


def find_best_match(agent_company, baseline_companies):
    """
    Find the best matching baseline company. H2: tightened matching.
    Requires sequence similarity >= 0.85 OR exact containment of
    significant name (not just any shared word like 'construction').
    """
    agent_name = agent_company.get("name", "")
    n1 = normalize_name(agent_name)
    w1 = significant_words(agent_name)

    best_match = None
    best_ratio = 0

    for bc in baseline_companies:
        bc_name = bc.get("name", "")
        n2 = normalize_name(bc_name)

        # Exact match after normalization
        if n1 == n2:
            return bc

        # One fully contains the other (not just a shared word)
        if len(n1) > 3 and len(n2) > 3:
            if n1 in n2 or n2 in n1:
                return bc

        # Sequence similarity — require 0.85 (H2: was 0.6)
        ratio = SequenceMatcher(None, n1, n2).ratio()

        # Also require at least 2 significant words overlap
        w2 = significant_words(bc_name)
        shared = w1 & w2
        significant_overlap = len(shared) >= 2

        # Must pass BOTH thresholds
        if ratio >= 0.85 and significant_overlap and ratio > best_ratio:
            best_ratio = ratio
            best_match = bc

    return best_match


# ═══════════════════════════════════════════════
# Comparison functions
# ═══════════════════════════════════════════════

def compare_revenue(baseline, agent, tolerance=0.30):
    """Compare revenue estimates. Returns None if either is missing."""
    if baseline is None or agent is None:
        return None
    if baseline == 0:
        return agent == 0
    pct_diff = abs(agent - baseline) / baseline
    return pct_diff <= tolerance


def compare_ownership(baseline, agent):
    """Compare ownership type classifications."""
    if baseline is None or agent is None:
        return None
    return normalize_name(str(baseline)) == normalize_name(str(agent))


def compare_industry(baseline, agent):
    """Compare industry classifications using fuzzy matching."""
    if baseline is None or agent is None:
        return None
    b = baseline.lower()
    a = agent.lower()

    if b == a:
        return True

    b_words = set(b.replace("/", " ").replace(",", " ").split()) - FILLER_WORDS
    a_words = set(a.replace("/", " ").replace(",", " ").split()) - FILLER_WORDS

    if not b_words or not a_words:
        return False

    overlap = len(b_words & a_words) / min(len(b_words), len(a_words))
    return overlap >= 0.3


def compare_succession_scores(baseline, agent):
    """Compare succession scorecard dimensions. Returns delta per dimension."""
    dimensions = [
        "score_owner_age", "score_tenure", "score_nextgen_clarity",
        "score_legacy_signals", "score_activity_trajectory",
    ]
    deltas = {}
    for dim in dimensions:
        b_val = baseline.get(dim)
        a_val = agent.get(dim)
        if b_val is not None and a_val is not None:
            deltas[dim] = a_val - b_val
        else:
            deltas[dim] = None
    return deltas


# ═══════════════════════════════════════════════
# Scoring functions
# ═══════════════════════════════════════════════

def score_company(agent_company, baseline_company, agent_sources=None):
    """Score a single company comparison (rediscovery mode)."""
    cs = CompanyScore(
        name=agent_company.get("name", "unknown"),
        baseline_name=baseline_company.get("name", "") if baseline_company else "",
        matched=baseline_company is not None,
    )

    if baseline_company:
        cs.revenue_baseline = baseline_company.get("revenue_estimate")
        cs.revenue_agent = agent_company.get("revenue_estimate")
        if cs.revenue_baseline is not None:
            cs.revenue_baseline = float(cs.revenue_baseline)
        if cs.revenue_agent is not None:
            cs.revenue_agent = float(cs.revenue_agent)

        cs.revenue_accurate = compare_revenue(cs.revenue_baseline, cs.revenue_agent)
        cs.ownership_match = compare_ownership(
            baseline_company.get("ownership_type"),
            agent_company.get("ownership_type"),
        )
        cs.industry_match = compare_industry(
            baseline_company.get("industry"),
            agent_company.get("industry"),
        )
        cs.succession_deltas = compare_succession_scores(baseline_company, agent_company)

    if agent_sources:
        cs.source_count = len(agent_sources)

    return cs


def score_prospect(company, sources=None, key_people=None, signals=None, pipeline=None):
    """Score a single company in prospecting mode."""
    # Count populated fields for completeness
    profile_fields = [
        "name", "location", "province", "industry", "founded_year",
        "website", "ownership_type", "revenue_estimate", "employee_count",
        "score_owner_age", "score_tenure", "score_nextgen_clarity",
        "score_legacy_signals", "score_activity_trajectory",
    ]
    populated = sum(1 for f in profile_fields if company.get(f) is not None)
    completeness = populated / len(profile_fields)

    rev = company.get("revenue_estimate")
    if rev is not None:
        rev = float(rev)

    # Determine ICP tier from succession readiness and revenue
    readiness = company.get("succession_readiness", "")
    tier = None
    if rev and rev >= 30 and rev <= 150 and readiness in ("High", "Very High"):
        tier = 1
    elif rev and ((15 <= rev < 30) or (150 < rev <= 300)):
        tier = 2
    elif rev and ((10 <= rev < 15) or rev > 300):
        tier = 3
    elif rev and rev >= 30:
        tier = 2

    return ProspectScore(
        name=company.get("name", "unknown"),
        has_revenue=rev is not None,
        has_ownership_type=company.get("ownership_type") is not None,
        has_industry=company.get("industry") is not None,
        has_succession_scores=company.get("score_owner_age") is not None,
        has_website=company.get("website") is not None,
        revenue_in_range=10 <= rev <= 500 if rev else False,
        icp_tier=tier,
        source_count=len(sources) if sources else 0,
        key_people_count=len(key_people) if key_people else 0,
        signal_count=len(signals) if signals else 0,
        has_pipeline_entry=pipeline is not None and len(pipeline) > 0,
        completeness=completeness,
    )
