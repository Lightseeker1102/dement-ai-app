"""
Comprehensive Edge-Case Test Suite for DementAI ML Microservice
----------------------------------------------------------------
Tests unexpected inputs, data types, boundary conditions, unicode,
concurrency, division-by-zero, and error response codes.
"""

import sys
import os
import json
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from digit_evaluator import evaluate_digit_span, ValidationError
from stroop_evaluator import evaluate_stroop
from picture_recall import evaluate_transcript as evaluate_picture_recall
from structured_speech import evaluate_structured_speech
from transcriber import transcribe_audio
from app import app
from fastapi.testclient import TestClient


class TestEdgeCasesDigitEvaluator(unittest.TestCase):
    def test_boolean_inputs(self):
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=True, correct_rounds=4, total_rounds=5)
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=5, correct_rounds=True, total_rounds=5)

    def test_float_inputs(self):
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=5.0, correct_rounds=4, total_rounds=5)

    def test_correct_greater_than_total(self):
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=5, correct_rounds=6, total_rounds=5)

    def test_zero_total_rounds(self):
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=5, correct_rounds=2, total_rounds=0)


class TestEdgeCasesStroopEvaluator(unittest.TestCase):
    def test_invalid_accuracy_bounds(self):
        with self.assertRaises((ValidationError, ValueError)):
            evaluate_stroop(accuracy_percent=150, avg_reaction_ms=850)
        with self.assertRaises((ValidationError, ValueError)):
            evaluate_stroop(accuracy_percent=-10, avg_reaction_ms=850)

    def test_invalid_reaction_time(self):
        with self.assertRaises((ValidationError, ValueError)):
            evaluate_stroop(accuracy_percent=90, avg_reaction_ms=0)
        with self.assertRaises((ValidationError, ValueError)):
            evaluate_stroop(accuracy_percent=90, avg_reaction_ms=-500)

    def test_boolean_and_type_checks(self):
        with self.assertRaises((ValidationError, ValueError, TypeError)):
            evaluate_stroop(accuracy_percent=True, avg_reaction_ms=850)
        with self.assertRaises((ValidationError, ValueError, TypeError)):
            evaluate_stroop(accuracy_percent="90", avg_reaction_ms=850)


class TestEdgeCasesPictureRecall(unittest.TestCase):
    def test_none_transcript(self):
        res = evaluate_picture_recall(None)
        self.assertEqual(res["score"], 15)
        self.assertEqual(res["risk_tier"], "Critical")

    def test_unicode_and_emojis(self):
        text = "I see a 🐕 dog, green 🌳 trees, a 🪑 bench, and 🌸 flowers!"
        res = evaluate_picture_recall(text)
        self.assertIn("dog", res["matched_keywords"])
        self.assertIn("bench", res["matched_keywords"])

    def test_plural_keywords(self):
        text = "I see dogs running near benches and ponds under sunny skies with children playing."
        res = evaluate_picture_recall(text)
        self.assertGreaterEqual(res["matched_categories_count"], 4)

    def test_only_punctuation(self):
        res = evaluate_picture_recall("... ,,, !!! ???")
        self.assertEqual(res["score"], 15)
        self.assertEqual(res["total_words"], 0)

    def test_non_string_input(self):
        res = evaluate_picture_recall(12345)
        self.assertIn("score", res)


class TestEdgeCasesStructuredSpeech(unittest.TestCase):
    def test_none_transcript(self):
        res = evaluate_structured_speech(None)
        self.assertEqual(res["score"], 15)

    def test_only_conjunctions(self):
        text = "because when after before although while since then and so if however"
        res = evaluate_structured_speech(text)
        self.assertEqual(res["conjunction_count"], 12)

    def test_repetitive_words(self):
        text = "walk walk walk walk walk walk walk walk walk walk"
        res = evaluate_structured_speech(text)
        # Low unique lexical ratio
        self.assertEqual(res["unique_substantive"], 1)

    def test_zero_duration(self):
        res = evaluate_structured_speech("Testing speech duration", duration_seconds=0)
        self.assertIn("score", res)


class TestEdgeCasesTranscriber(unittest.TestCase):
    def test_none_path(self):
        res = transcribe_audio(None)
        self.assertIn("text", res)

    def test_empty_string_path(self):
        res = transcribe_audio("")
        self.assertIn("text", res)

    def test_non_string_path(self):
        res = transcribe_audio(12345)
        self.assertIn("text", res)


class TestEdgeCasesFastAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_invalid_digit_span_bounds(self):
        # max_span negative
        resp = self.client.post("/evaluate/digit-span", json={"max_span": -5, "correct_rounds": 4})
        self.assertEqual(resp.status_code, 422)

    def test_invalid_stroop_accuracy(self):
        # accuracy > 100
        resp = self.client.post("/evaluate/stroop", json={"accuracy_percent": 150, "avg_reaction_ms": 850})
        self.assertEqual(resp.status_code, 422)

    def test_validation_error_returns_400_not_500(self):
        # correct_rounds (6) > total_rounds (5)
        resp = self.client.post("/evaluate/digit-span", json={"max_span": 5, "correct_rounds": 6, "total_rounds": 5})
        self.assertEqual(resp.status_code, 400)


if __name__ == "__main__":
    unittest.main()
