import sys
import json
import argparse
from digit_evaluator import ValidationError

def _validate_inputs(accuracy_percent, avg_reaction_ms, total_rounds):
    if isinstance(accuracy_percent, bool) or not isinstance(accuracy_percent, (int, float)):
        raise ValidationError("accuracy_percent must be a non-boolean number")
    if isinstance(avg_reaction_ms, bool) or not isinstance(avg_reaction_ms, (int, float)):
        raise ValidationError("avg_reaction_ms must be a non-boolean number")
    if isinstance(total_rounds, bool) or not isinstance(total_rounds, int):
        raise ValidationError("total_rounds must be a non-boolean integer")

    if accuracy_percent < 0 or accuracy_percent > 100:
        raise ValidationError(f"accuracy_percent must be between 0 and 100, got {accuracy_percent}")
    if avg_reaction_ms <= 0:
        raise ValidationError(f"avg_reaction_ms must be > 0, got {avg_reaction_ms}")
    if total_rounds <= 0:
        raise ValidationError(f"total_rounds must be > 0, got {total_rounds}")

def evaluate_stroop(accuracy_percent, avg_reaction_ms, total_rounds=10):
    _validate_inputs(accuracy_percent, avg_reaction_ms, total_rounds)
    # 1. Reaction Speed Score (age-calibrated baseline 1200ms for older adults 65+)
    speed_score = max(20, 100 - max(0, int((avg_reaction_ms - 1200) / 15)))

    # 2. Combined Stroop Score (75% accuracy + 25% speed)
    final_score = int(0.75 * accuracy_percent + 0.25 * speed_score)
    final_score = min(100, max(15, final_score))

    # 3. Unified Risk Tier Determination
    if final_score >= 78:
        risk_tier = "Low"
    elif final_score >= 63:
        risk_tier = "Monitor"
    elif final_score >= 48:
        risk_tier = "High"
    else:
        risk_tier = "Critical"

    result = {
        "assessment_type": "stroop-test",
        "score": final_score,
        "risk_tier": risk_tier,
        "accuracy_percent": accuracy_percent,
        "avg_reaction_ms": avg_reaction_ms,
        "total_rounds": total_rounds
    }
    return result

def main():
    parser = argparse.ArgumentParser(description="Stroop Color-Word ML Evaluator")
    parser.add_argument("--accuracy", type=int, default=90, help="Accuracy percentage (0-100)")
    parser.add_argument("--reaction_ms", type=int, default=850, help="Average reaction speed in ms")

    args = parser.parse_args()
    eval_result = evaluate_stroop(args.accuracy, args.reaction_ms)
    print(json.dumps(eval_result, indent=2))

if __name__ == "__main__":
    main()
