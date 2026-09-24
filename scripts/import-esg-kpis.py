"""Import the supplied KPI crosswalk without inferring company evidence.

Usage: python scripts/import-esg-kpis.py /path/to/KPIs.xlsx
Requires openpyxl (pip install openpyxl).
"""
import hashlib
import json
import sys
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
CSA_ENVIRONMENT = {
    "Environmental Policy & Management", "Energy", "Waste & Pollutants", "Water",
    "Climate Strategy", "Biodiversity", "Product Stewardship", "Sustainable Raw Materials",
}
CSA_SOCIAL = {
    "Labor Practices", "Human Rights", "Human Capital Management",
    "Occupational Health & Safety", "Customer Relations", "Product Quality & Recall Management",
}
CSA_OVERVIEW = {
    "Company Information & Denominators", "Materiality",
    "Future Questions: Sustainable AI & People Analytics",
}


def theme_for(framework, topic):
    if framework == "CDP":
        if topic.startswith("7 -"):
            return "Environment"
        if topic.startswith("4 -"):
            return "Governance"
        if topic.startswith("13 -"):
            return "Assurance & Recognition"
        return "Overview & Approach"
    if topic in CSA_ENVIRONMENT:
        return "Environment"
    if topic in CSA_SOCIAL:
        return "Social"
    if topic in CSA_OVERVIEW:
        return "Overview & Approach"
    if topic == "Transparency & Reporting":
        return "Assurance & Recognition"
    return "Governance"


def main():
    source = Path(sys.argv[1])
    workbook = openpyxl.load_workbook(source, read_only=True, data_only=True)
    indicators = []
    for framework in ("CDP", "CSA"):
        sheet = workbook[framework]
        for row_number, cells in enumerate(sheet.iter_rows(min_row=2, values_only=True), 2):
            if not any(value is not None for value in cells):
                continue
            topic = cells[0]
            reference = cells[1] if framework == "CDP" else None
            offset = 1 if framework == "CDP" else 0
            indicator = cells[1 + offset]
            if not isinstance(topic, str) or not isinstance(indicator, str):
                raise ValueError(f"Missing topic or indicator: {framework}!{row_number}")
            gri_ref, gri_title, gri_alignment, brsr_section, brsr_principle, brsr_ref, brsr_alignment = cells[2 + offset:9 + offset]
            key = f"{framework}|{topic}|{indicator}"
            indicators.append({
                "id": f"{framework.lower()}-{hashlib.sha256(key.encode()).hexdigest()[:16]}",
                "framework": framework,
                "topic": topic,
                "indicator": indicator,
                "theme": theme_for(framework, topic),
                "questionReference": str(reference) if reference is not None else None,
                "referenceNeedsReview": isinstance(reference, (int, float)),
                "version": None,
                "industry": None,
                "applicability": "unconfirmed",
                "source": {"file": source.name, "sheet": framework, "row": row_number, "originalReference": reference},
                "mappings": [
                    {"framework": "GRI", "reference": gri_ref, "title": gri_title, "alignment": gri_alignment, "reviewStatus": "provisional"},
                    {"framework": "BRSR", "reference": brsr_ref, "section": brsr_section, "principle": brsr_principle, "alignment": brsr_alignment, "reviewStatus": "provisional"},
                ],
            })
    if len({item["id"] for item in indicators}) != len(indicators):
        raise ValueError("Duplicate indicator identities; resolve before importing")
    catalogue = {"schemaVersion": 1, "indicators": indicators}
    target = ROOT / "public/data/esg-kpis.json"
    target.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(indicators)} indicators into {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
