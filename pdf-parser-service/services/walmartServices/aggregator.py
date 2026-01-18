from collections import defaultdict

def build_category_index(page_results):
    index = defaultdict(list)

    for item in page_results:
        index[item["category"]].append(item["page"])

    return [
        {
            "category": category,
            "pageNos": sorted(pages)
        }
        for category, pages in index.items()
    ]
