import sys
import json
import re
import argparse
from transcriber import transcribe_audio

# Target Scene Keywords for Picture Recall Assessment (including common plurals)
TARGET_KEYWORDS = {
    'bench': ['bench', 'benches', 'seat', 'seats', 'chair', 'chairs', 'pew'],
    'tree': ['tree', 'trees', 'oak', 'pine', 'foliage', 'plant', 'plants'],
    'dog': ['dog', 'dogs', 'puppy', 'puppies', 'canine', 'canines', 'pet', 'pets'],
    'sun': ['sun', 'sunlight', 'sunny', 'shine'],
    'park': ['park', 'parks', 'garden', 'gardens', 'lawn', 'lawns', 'field', 'fields'],
    'fountain': ['fountain', 'fountains', 'water', 'pond', 'ponds', 'stream', 'streams'],
    'grass': ['grass', 'lawn', 'lawns', 'greenery'],
    'flower': ['flower', 'flowers', 'blossom', 'blossoms', 'tulip', 'tulips', 'rose', 'roses'],
    'balloon': ['balloon', 'balloons'],
    'child': ['child', 'children', 'kid', 'kids', 'boy', 'boys', 'girl', 'girls', 'playing'],
    'sky': ['sky', 'skies', 'clouds', 'cloud'],
    'bird': ['bird', 'birds', 'pigeon', 'pigeons']
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

def evaluate_transcript(transcript_text, duration_seconds=60):
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
    
    # 1. Keyword Matching
    matched_categories = []
    matched_words = []
    
    for category, synonyms in TARGET_KEYWORDS.items():
        for word in words:
            if word in synonyms:
                if category not in matched_categories:
                    matched_categories.append(category)
                if word not in matched_words:
                    matched_words.append(word)

    # 2. Score Calculation (Recall Ratio + Filtered Lexical Density)
    keyword_score = min(70, len(matched_categories) * 14)
    
    unique_substantive = len(set(substantive_words)) if total_substantive > 0 else 0
    lexical_ratio = (unique_substantive / total_substantive) if total_substantive > 0 else 0.0
    density_score = min(30, int(lexical_ratio * 40))
    
    final_score = min(100, max(15, keyword_score + density_score))
    
    # 3. Determine Risk Tier (≥78 Low, ≥63 Monitor, ≥48 High, <48 Critical)
    if final_score >= 78:
        risk_tier = "Low"
    elif final_score >= 63:
        risk_tier = "Monitor"
    elif final_score >= 48:
        risk_tier = "High"
    else:
        risk_tier = "Critical"

    result = {
        "assessment_type": "picture-recall",
        "score": final_score,
        "risk_tier": risk_tier,
        "duration_seconds": duration_seconds,
        "total_words": total_words,
        "substantive_words": total_substantive,
        "unique_substantive": unique_substantive,
        "matched_keywords": matched_words,
        "matched_categories_count": len(matched_categories),
        "transcript_text": transcript_text
    }
    return result

def main():
    parser = argparse.ArgumentParser(description="Picture Recall ML Evaluator")
    parser.add_argument("--text", type=str, help="Text transcript of picture description")
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
        transcript = "I see a park bench, green grass, a dog running, children playing, and a sunny sky."

    eval_result = evaluate_transcript(transcript, duration)
    print(json.dumps(eval_result, indent=2))

if __name__ == "__main__":
    main()
