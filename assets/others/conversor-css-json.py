import json

INPUT_FILE = "assets/jsons/css-schema.json"
OUTPUT_FILE = "assets/jsons/css-data.json"

# Prefixos que serão removidos
PREFIXES = (
    "-webkit-",
    "-moz-",
    "-ms-",
    "-o-"
)

# @rules que não fazem sentido manter
REMOVE_AT_RULES = {
    "@-webkit-keyframes",
    "@-moz-keyframes",
    "@-o-keyframes",
    "@-ms-viewport",
    "@-o-viewport",
    "@-moz-document",
    "@left-top",
    "@left-middle",
    "@left-bottom",
    "@right-top",
    "@right-middle",
    "@right-bottom",
    "@top-left",
    "@top-center",
    "@top-right",
    "@bottom-left",
    "@bottom-center",
    "@bottom-right",
    "@top-left-corner",
    "@top-right-corner",
    "@bottom-left-corner",
    "@bottom-right-corner"
}


def clean_dict(d):
    return {
        k: v
        for k, v in d.items()
        if v not in ("", None, {}, [])
    }


def should_skip(name: str) -> bool:
    return (
        name.startswith(PREFIXES)
        or name in REMOVE_AT_RULES
    )


def convert_values(values):
    if not values:
        return {}

    items = values.get("value", [])

    if not isinstance(items, list):
        items = [items]

    result = {}

    for item in items:
        if not isinstance(item, dict):
            continue

        if item.get("$", {}).get("name") == "space-around":
            print(item)

        info = item.get("$", {})

        name = info.get("name")
        if not name:
            continue

        result[name] = {
            "description": item.get("desc")
        }

    return result

def convert_section(section):

    if not section:
        return {}

    entries = section.get("entry", [])

    if not isinstance(entries, list):
        entries = [entries]

    result = {}

    for entry in entries:

        if not isinstance(entry, dict):
            continue

        info = entry.get("$", {})

        name = info.get("name")

        if not name or should_skip(name):
            continue

        values = convert_values(entry.get("values"))

        result[name] = clean_dict({
            "description": entry.get("desc"),
            "restriction": info.get("restriction"),
            "syntax": info.get("syntax"),
            "values": values
        })

    return result


with open(INPUT_FILE, "r", encoding="utf-8") as f:
    raw = json.load(f)

css = raw["css"]

output = {}

for section_name, section in css.items():
    output[section_name] = convert_section(section)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

print()

for section_name, section in output.items():
    print(f"{section_name}: {len(section)} itens")