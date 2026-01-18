from collections import defaultdict

ALLOWED_RULE_TYPES = {
    "presence",
    "position_barcode",
    "position_label",
    "position_logo",
    "size_text",
    "distance_from_edge",
    "orientation_text",
    "content_text",
    "other"
}

def post_process(results):
    final = {}

    for chunk in results:
        for rule in chunk:
            if rule["rule_type"] not in ALLOWED_RULE_TYPES:
                continue
            if rule["confidence"] < 0.7:
                continue
            final[rule["id"]] = rule

    return list(final.values())


def get_rule_category(rule_type):
    if rule_type.startswith("position_"):
        return "position"
    if rule_type == "presence":
        return "presence"
    if rule_type == "distance_from_edge":
        return "distance"
    if rule_type == "size_text":
        return "size"
    if rule_type == "orientation_text":
        return "orientation"
    if rule_type == "content_text":
        return "content"
    return "other"


def group_rules_by_object(rules):
    grouped = defaultdict(lambda: defaultdict(list))

    for rule in rules:
        obj = rule.get("object")
        category = get_rule_category(rule["rule_type"])
        grouped[obj][category].append(rule)

    return grouped
