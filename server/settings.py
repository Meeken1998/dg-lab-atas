import json
import os

PUNISHMENT_SETTINGS = {
    "pnlLossEnabled": True,
    "pnlLoss": {
        "trigger": 0,
        "value": 1,
        "type": "multiple",
    },
    "stopLossEnabled": True,
    "stopLoss": {
        "trigger": 2,
        "value": 50,
        "type": "fixed",
    },
    "stopLossRestMinutes": 5,
    "waveform": "信号灯",
    "pluginTitle": "风控已开启，扛单会被电！",
    "showSummary": True,
    "enableStopLossCountdown": True,
}

SETTINGS_FILE_PATH = ".\\settings.json"

if os.path.exists(SETTINGS_FILE_PATH):
    with open(SETTINGS_FILE_PATH, "r") as f:
        try:
            PUNISHMENT_SETTINGS.update(json.load(f))
        except json.JSONDecodeError:
            print(
                f"Warning: {SETTINGS_FILE_PATH} contains invalid JSON, using default configuration.")

with open(SETTINGS_FILE_PATH, "w") as f:
    json.dump(PUNISHMENT_SETTINGS, f, indent=4)


def set_settings(settings: dict):
    with open(SETTINGS_FILE_PATH, "w") as f:
        json.dump(settings, f, indent=4)
