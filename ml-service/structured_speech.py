import sys
import json
import re
import argparse
from transcriber import transcribe_audio

CONJUNCTIONS = {
    'because', 'when', 'after', 'before', 'although', 'while', 'since',
    'then', 'and', 'so', 'if', 'however', 'therefore', 'furthermore',
    'also', 'besides', 'meanwhile', 'instead', 'otherwise'
}

STOP_WORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
    'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing', 'for', 'from', 'had',
    'has', 'have', 'he', 'her', 'here', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
    'it', 'its', 'me', 'my', 'no', 'not', 'of', 'on', 'or', 'our', 'she', 'so',
    'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they',
    'this', 'those', 'to', 'was', 'we', 'were', 'what', 'when', 'where', 'which',
    'while', 'who', 'will', 'with', 'would', 'you', 'your'
}

def evaluate_structured_speech(transcript_text, duration_seconds=60):
    if transcript_text is None:
        transcript_text = ""
    elif not isinstance(transcript_text, str):
        transcript_text = str(transcript_text)

    try:
        duration_seconds = float(duration_seconds)
        if duration_seconds <= 0:
            duration_seconds = 60.0
    except (ValueError, TypeError):
        duration_seconds = 60.0

    text_clean = re.sub(r'[^\w\s]', '', transcript_text.lower())
    words = text_clean.split()
    total_words = len(words)
    substantive_words = [w for w in words if w not in STOP_WORDS]
    total_substantive = len(substantive_words)
    unique_substantive = len(set(substantive_words)) if total_substantive > 0 else 0
    
    # 1. Narrative Volume Score
    if total_words >= 35:
        volume_score = 40
    elif total_words >= 20:
        volume_score = 30
    elif total_words >= 10:
        volume_score = 20
    else:
        volume_score = 10

    # 2. Conjunction & Syntactic Density Score
    conjunction_matches = [w for w in words if w in CONJUNCTIONS]
    conjunction_count = len(conjunction_matches)
    
    if conjunction_count >= 3:
        syntax_score = 20
    elif conjunction_count >= 2:
        syntax_score = 15
    elif conjunction_count >= 1:
        syntax_score = 10
    else:
        syntax_score = 5

    # 3. Substantive Lexical Diversity Ratio Score
    lexical_ratio = (unique_substantive / total_substantive) if total_substantive > 0 else 0.0
    diversity_score = min(30, int(lexical_ratio * 40))

    # 4. Syntactic Coherence
    coherence_score = 10 if total_words >= 10 else 0

    final_score = min(100, max(15, volume_score + syntax_score + diversity_score + coherence_score))

    # 5. Risk Tier Determination (≥78 Low, ≥63 Monitor, ≥48 High, <48 Critical)
    if final_score >= 78:
        risk_tier = "Low"
    elif final_score >= 63:
        risk_tier = "Monitor"
    elif final_score >= 48:
        risk_tier = "High"
    else:
        risk_tier = "Critical"

    result = {
        "assessment_type": "structured-speech",
        "score": final_score,
        "risk_tier": risk_tier,
        "duration_seconds": duration_seconds,
        "total_words": total_words,
        "substantive_words": total_substantive,
        "unique_substantive": unique_substantive,
        "conjunction_count": conjunction_count,
        "conjunction_words": conjunction_matches,
        "lexical_ratio": round(lexical_ratio, 2),
        "transcript_text": transcript_text
    }
    return result

def main():
    parser = argparse.ArgumentParser(description="Structured Speech ML Evaluator")
    parser.add_argument("--text", type=str, help="Text transcript of spontaneous narrative")
    parser.add_argument("--audio", type=str, help="Path to WAV audio file")

    args = parser.parse_args()

    transcript = ""
    duration = 60.0

    if args.text:
        transcript = args.text
    elif args.audio:
        transcription_res = transcribe_audio(args.audio)
        transcript = transcription_res["text"]
        duration = transcription_res["duration_seconds"]

    if not transcript:
        transcript = "One memorable morning I woke up early to watch the sunrise over the mountains, and it was peaceful because the air was fresh and crisp."

    eval_result = evaluate_structured_speech(transcript, duration)
    print(json.dumps(eval_result, indent=2))

if __name__ == "__main__":
    main()
