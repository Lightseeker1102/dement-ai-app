"""
Digit Span Memory Matrix Evaluator
-----------------------------------
Scores a digit-span working memory task and buckets the result into a
risk tier. NOT a validated clinical instrument — thresholds below are
heuristic and should be calibrated against normed data (e.g. WAIS-IV
Digit Span) before being used for any real screening decision.

Usage:
    CLI:    python digit_span_eval.py --max_span 5 --correct 4 --total 5
    Stdin:  echo '{"max_span":5,"correct_rounds":4,"total_rounds":5}' | python digit_span_eval.py --stdin
    Import: from digit_span_eval import evaluate_digit_span, ScoreConfig
"""

import sys
import json
import argparse
import logging
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("digit_span_eval")


class ValidationError(ValueError):
    """Raised when input parameters fail sanity checks."""


@dataclass(frozen=True)
class ScoreConfig:
    """Tunable scoring parameters aligned with clinical reverse digit span norms."""
    span_thresholds: dict = field(default_factory=lambda: {
        5: 100,   # >= 5 reverse digits -> 100
        4: 85,    # 4 reverse digits -> 85
        3: 65,    # 3 reverse digits -> 65
    })
    below_min_score: int = 45
    max_accuracy_bonus: int = 15
    score_floor: int = 15
    score_ceiling: int = 100
    low_risk_cutoff: int = 78
    monitor_risk_cutoff: int = 63
    high_risk_cutoff: int = 48
    max_reasonable_span: int = 20  # sanity ceiling, not a scoring rule


def _span_base_score(max_span: int, cfg: ScoreConfig) -> int:
    for threshold in sorted(cfg.span_thresholds.keys(), reverse=True):
        if max_span >= threshold:
            return cfg.span_thresholds[threshold]
    return cfg.below_min_score


def _validate_inputs(max_span: int, correct_rounds: int, total_rounds: int, cfg: ScoreConfig) -> None:
    for val, name in [(max_span, "max_span"), (correct_rounds, "correct_rounds"), (total_rounds, "total_rounds")]:
        if isinstance(val, bool) or not isinstance(val, int):
            raise ValidationError(f"{name} must be a non-boolean integer, got {type(val).__name__}")
    if total_rounds <= 0:
        raise ValidationError(f"total_rounds must be > 0, got {total_rounds}")
    if max_span < 0:
        raise ValidationError(f"max_span cannot be negative, got {max_span}")
    if max_span > cfg.max_reasonable_span:
        raise ValidationError(f"max_span {max_span} exceeds sane ceiling {cfg.max_reasonable_span}")
    if correct_rounds < 0:
        raise ValidationError(f"correct_rounds cannot be negative, got {correct_rounds}")
    if correct_rounds > total_rounds:
        raise ValidationError(f"correct_rounds ({correct_rounds}) cannot exceed total_rounds ({total_rounds})")


def evaluate_digit_span(
    max_span: int,
    correct_rounds: int,
    total_rounds: int = 5,
    cfg: ScoreConfig = ScoreConfig(),
) -> dict:
    """
    Score a digit-span task. Raises ValidationError on bad input rather
    than silently producing a nonsensical score — callers in a real-time
    pipeline should catch this and surface it, not swallow it.
    """
    _validate_inputs(max_span, correct_rounds, total_rounds, cfg)

    span_score = _span_base_score(max_span, cfg)
    accuracy_bonus = int((correct_rounds / total_rounds) * cfg.max_accuracy_bonus)
    final_score = min(cfg.score_ceiling, max(cfg.score_floor, span_score + accuracy_bonus))

    if final_score >= cfg.low_risk_cutoff:
        risk_tier = "Low"
    elif final_score >= cfg.monitor_risk_cutoff:
        risk_tier = "Monitor"
    elif final_score >= cfg.high_risk_cutoff:
        risk_tier = "High"
    else:
        risk_tier = "Critical"

    return {
        "assessment_type": "digit-span",
        "score": final_score,
        "risk_tier": risk_tier,
        "max_span": max_span,
        "correct_rounds": correct_rounds,
        "total_rounds": total_rounds,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "disclaimer": "Heuristic score, not a validated clinical diagnostic.",
    }


def _run(max_span: int, correct_rounds: int, total_rounds: int) -> int:
    """Shared execution path for CLI/stdin. Returns process exit code."""
    try:
        result = evaluate_digit_span(max_span, correct_rounds, total_rounds)
    except ValidationError as e:
        logger.error("Validation failed: %s", e)
        print(json.dumps({"error": str(e)}, indent=2))
        return 1
    except Exception as e:  # unexpected — don't leak a raw traceback to stdout in a pipeline
        logger.exception("Unexpected failure during evaluation")
        print(json.dumps({"error": f"internal error: {e}"}, indent=2))
        return 1

    print(json.dumps(result, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Digit Span Memory Matrix Evaluator")
    parser.add_argument("--max_span", type=int, help="Maximum digit span achieved")
    parser.add_argument("--correct", type=int, help="Number of correct rounds")
    parser.add_argument("--total", type=int, default=5, help="Total rounds attempted (default: 5)")
    parser.add_argument("--stdin", action="store_true", help="Read a JSON object from stdin instead of flags")
    args = parser.parse_args()

    if args.stdin:
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"invalid JSON on stdin: {e}"}, indent=2))
            return 1
        return _run(
            payload.get("max_span"),
            payload.get("correct_rounds"),
            payload.get("total_rounds", 5),
        )

    if args.max_span is None or args.correct is None:
        parser.error("--max_span and --correct are required unless --stdin is used")

    return _run(args.max_span, args.correct, args.total)


if __name__ == "__main__":
    sys.exit(main())