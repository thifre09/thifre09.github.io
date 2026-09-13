import json

INPUT = "assets/jsons/htmlTags.json"
OUTPUT = "assets/jsons/html-data.json"

with open(INPUT, encoding="utf8") as f:
    tags = json.load(f)

result = {}

for tag in tags:

    result[tag["name"]] = {
        "description": tag.get("description", ""),
        "attributes": {}
    }

    for attr in tag.get("attributes", []):
        result[tag["name"]]["attributes"][attr["name"]] = {
            "description": attr.get("description", "")
        }

with open(OUTPUT, "w", encoding="utf8") as f:
    json.dump(result, f, ensure_ascii=False, separators=(",", ":"))