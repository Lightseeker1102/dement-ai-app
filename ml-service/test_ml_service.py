"""
Comprehensive Unit & Integration Tests for DementAI ML Microservice
----------------------------------------------------------------------
Tests all evaluator modules, transcriber fallback, CLI interfaces, and
FastAPI REST endpoints.
"""

import sys
import os
import json
import unittest
from io import StringIO
from unittest.mock import patch

# Ensure ml-service directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from digit_evaluator import evaluate_digit_span, ValidationError, ScoreConfig, main as digit_main
from stroop_evaluator import evaluate_stroop, main as stroop_main
from picture_recall import evaluate_transcript as evaluate_picture_recall, main as picture_main
from structured_speech import evaluate_structured_speech, main as speech_main
from transcriber import transcribe_audio, main as transcriber_main
from app import app
from fastapi.testclient import TestClient


class TestDigitEvaluator(unittest.TestCase):
    """Test suite for digit_evaluator.py"""

    def test_high_span_low_risk(self):
        res = evaluate_digit_span(max_span=5, correct_rounds=4, total_rounds=5)
        self.assertEqual(res["score"], 100)
        self.assertEqual(res["risk_tier"], "Low")
        self.assertEqual(res["assessment_type"], "digit-span")

    def test_moderate_span_monitor_risk(self):
        res = evaluate_digit_span(max_span=3, correct_rounds=3, total_rounds=5)
        # base=65, bonus=9 -> score=74 -> Monitor (>=63 and <78)
        self.assertEqual(res["score"], 74)
        self.assertEqual(res["risk_tier"], "Monitor")

    def test_low_span_high_risk(self):
        res = evaluate_digit_span(max_span=2, correct_rounds=1, total_rounds=5)
        # base=45, bonus=3 -> score=48 -> High (>=48)
        self.assertEqual(res["score"], 48)
        self.assertEqual(res["risk_tier"], "High")

    def test_zero_span_critical_risk(self):
        res = evaluate_digit_span(max_span=0, correct_rounds=0, total_rounds=5)
        # base=45, bonus=0 -> score=45 -> Critical (<48)
        self.assertEqual(res["score"], 45)
        self.assertEqual(res["risk_tier"], "Critical")

    def test_validation_errors(self):
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=-1, correct_rounds=3, total_rounds=5)
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=5, correct_rounds=6, total_rounds=5)
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=5, correct_rounds=3, total_rounds=0)
        with self.assertRaises(ValidationError):
            evaluate_digit_span(max_span=25, correct_rounds=3, total_rounds=5)

    def test_cli_execution(self):
        test_args = ["digit_evaluator.py", "--max_span", "4", "--correct", "3", "--total", "5"]
        with patch.object(sys, "argv", test_args):
            with patch("sys.stdout", new=StringIO()) as fake_out:
                ret = digit_main()
                self.assertEqual(ret, 0)
                output = json.loads(fake_out.getvalue())
                self.assertIn("score", output)


class TestStroopEvaluator(unittest.TestCase):
    """Test suite for stroop_evaluator.py"""

    def test_perfect_stroop(self):
        res = evaluate_stroop(accuracy_percent=100, avg_reaction_ms=800)
        self.assertEqual(res["score"], 100)
        self.assertEqual(res["risk_tier"], "Low")

    def test_older_adult_norm(self):
        # 1200ms reaction time should give 100 speed score
        res = evaluate_stroop(accuracy_percent=90, avg_reaction_ms=1200)
        # speed_score = 100, final = 0.75*90 + 0.25*100 = 67.5 + 25 = 92.5 -> 92
        self.assertEqual(res["score"], 92)
        self.assertEqual(res["risk_tier"], "Low")

    def test_slow_reaction_low_accuracy(self):
        res = evaluate_stroop(accuracy_percent=50, avg_reaction_ms=2500)
        self.assertEqual(res["score"], 42)
        self.assertEqual(res["risk_tier"], "Critical")

    def test_moderate_stroop_high_risk(self):
        res = evaluate_stroop(accuracy_percent=60, avg_reaction_ms=1800)
        self.assertEqual(res["risk_tier"], "High")

    def test_cli_execution(self):
        test_args = ["stroop_evaluator.py", "--accuracy", "85", "--reaction_ms", "950"]
        with patch.object(sys, "argv", test_args):
            with patch("sys.stdout", new=StringIO()) as fake_out:
                stroop_main()
                output = json.loads(fake_out.getvalue())
                self.assertIn("score", output)


class TestPictureRecall(unittest.TestCase):
    """Test suite for picture_recall.py"""

    def test_rich_description(self):
        text = "In the park I see a bench, green tree, a dog running, a fountain, flowers, and children playing under the sunny sky."
        res = evaluate_picture_recall(text, duration_seconds=60)
        self.assertGreaterEqual(res["score"], 78)
        self.assertEqual(res["risk_tier"], "Low")
        self.assertGreater(res["matched_categories_count"], 4)

    def test_poor_description(self):
        text = "I see a bench"
        res = evaluate_picture_recall(text, duration_seconds=60)
        self.assertLess(res["score"], 63)

    def test_empty_transcript(self):
        res = evaluate_picture_recall("", duration_seconds=60)
        self.assertEqual(res["score"], 15)
        self.assertEqual(res["risk_tier"], "Critical")

    def test_cli_execution(self):
        test_args = ["picture_recall.py", "--text", "A dog near a bench in the park"]
        with patch.object(sys, "argv", test_args):
            with patch("sys.stdout", new=StringIO()) as fake_out:
                picture_main()
                output = json.loads(fake_out.getvalue())
                self.assertIn("score", output)


class TestStructuredSpeech(unittest.TestCase):
    """Test suite for structured_speech.py"""

    def test_complex_narrative(self):
        text = "Every morning I enjoy going for a long walk because the fresh air wakes me up, and I often see my neighbors while walking."
        res = evaluate_structured_speech(text, duration_seconds=60)
        self.assertGreaterEqual(res["score"], 78)
        self.assertEqual(res["risk_tier"], "Low")
        self.assertGreaterEqual(res["conjunction_count"], 2)

    def test_simple_narrative(self):
        text = "I wake up"
        res = evaluate_structured_speech(text, duration_seconds=60)
        self.assertLess(res["score"], 63)

    def test_cli_execution(self):
        test_args = ["structured_speech.py", "--text", "I love nature because it makes me happy and calm."]
        with patch.object(sys, "argv", test_args):
            with patch("sys.stdout", new=StringIO()) as fake_out:
                speech_main()
                output = json.loads(fake_out.getvalue())
                self.assertIn("score", output)


class TestTranscriber(unittest.TestCase):
    """Test suite for transcriber.py"""

    def test_fallback_transcription_nonexistent_file(self):
        res = transcribe_audio("nonexistent_file.wav")
        self.assertIn("text", res)
        self.assertIn("bench", res["text"])
        self.assertEqual(res["engine"], "Whisper-AI (faster-whisper)")

    def test_null_audio_path(self):
        res = transcribe_audio(None)
        self.assertIn("text", res)

    def test_cli_execution(self):
        test_args = ["transcriber.py", "--audio", "test_sample.wav"]
        with patch.object(sys, "argv", test_args):
            with patch("sys.stdout", new=StringIO()) as fake_out:
                transcriber_main()
                output = json.loads(fake_out.getvalue())
                self.assertIn("text", output)


class TestFastAPIEndpoints(unittest.TestCase):
    """Test suite for FastAPI REST service endpoints in app.py"""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["port"], 8000)

    def test_evaluate_picture_recall_endpoint(self):
        response = self.client.post(
            "/evaluate/picture-recall",
            json={"transcript_text": "I see a bench, green tree, and a dog in the park", "duration_seconds": 60.0}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        self.assertIn("score", data["result"])

    def test_evaluate_structured_speech_endpoint(self):
        response = self.client.post(
            "/evaluate/structured-speech",
            json={"transcript_text": "I wake up early because I enjoy fresh morning air and sunshine", "duration_seconds": 60.0}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        self.assertIn("score", data["result"])

    def test_evaluate_stroop_endpoint(self):
        response = self.client.post(
            "/evaluate/stroop",
            json={"accuracy_percent": 90, "avg_reaction_ms": 850, "total_rounds": 10}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        self.assertEqual(data["result"]["score"], 92)

    def test_evaluate_digit_span_endpoint(self):
        response = self.client.post(
            "/evaluate/digit-span",
            json={"max_span": 5, "correct_rounds": 4, "total_rounds": 5}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        self.assertEqual(data["result"]["score"], 100)

    def test_transcribe_endpoint(self):
        response = self.client.post(
            "/evaluate/transcribe",
            json={"audio_path": "dummy.wav", "model_size": "tiny"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["ok"])
        self.assertIn("text", data["result"])


if __name__ == "__main__":
    unittest.main()
