#!/usr/bin/env python3
"""Convert a public-domain USFX Bible file into compact app JSON."""

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


BOOKS = {
    "GEN": "Genesis", "EXO": "Exodus", "LEV": "Leviticus", "NUM": "Numbers",
    "DEU": "Deuteronomy", "JOS": "Joshua", "JDG": "Judges", "RUT": "Ruth",
    "1SA": "1 Samuel", "2SA": "2 Samuel", "1KI": "1 Kings", "2KI": "2 Kings",
    "1CH": "1 Chronicles", "2CH": "2 Chronicles", "EZR": "Ezra", "NEH": "Nehemiah",
    "EST": "Esther", "JOB": "Job", "PSA": "Psalms", "PRO": "Proverbs",
    "ECC": "Ecclesiastes", "SNG": "Song of Solomon", "ISA": "Isaiah",
    "JER": "Jeremiah", "LAM": "Lamentations", "EZK": "Ezekiel", "DAN": "Daniel",
    "HOS": "Hosea", "JOL": "Joel", "AMO": "Amos", "OBA": "Obadiah", "JON": "Jonah",
    "MIC": "Micah", "NAM": "Nahum", "HAB": "Habakkuk", "ZEP": "Zephaniah",
    "HAG": "Haggai", "ZEC": "Zechariah", "MAL": "Malachi", "MAT": "Matthew",
    "MRK": "Mark", "LUK": "Luke", "JHN": "John", "ACT": "Acts", "ROM": "Romans",
    "1CO": "1 Corinthians", "2CO": "2 Corinthians", "GAL": "Galatians",
    "EPH": "Ephesians", "PHP": "Philippians", "COL": "Colossians",
    "1TH": "1 Thessalonians", "2TH": "2 Thessalonians", "1TI": "1 Timothy",
    "2TI": "2 Timothy", "TIT": "Titus", "PHM": "Philemon", "HEB": "Hebrews",
    "JAS": "James", "1PE": "1 Peter", "2PE": "2 Peter", "1JN": "1 John",
    "2JN": "2 John", "3JN": "3 John", "JUD": "Jude", "REV": "Revelation",
}

SKIP_TAGS = {"f", "x"}


def clean(parts):
    return " ".join("".join(parts).split())


def parse_book(book):
    chapters = {}
    state = {"chapter": None, "verse": None}

    def visit(node, skipped=False):
        tag = node.tag.rsplit("}", 1)[-1]

        if tag == "c":
            state["chapter"] = int(node.attrib["id"])
            state["verse"] = None
            chapters.setdefault(state["chapter"], {})
        elif tag == "v":
            state["verse"] = int(node.attrib["id"])
            chapters[state["chapter"]].setdefault(state["verse"], [])
        elif tag == "ve":
            state["verse"] = None

        child_skipped = skipped or tag in SKIP_TAGS
        if not child_skipped and state["verse"] is not None and node.text:
            chapters[state["chapter"]][state["verse"]].append(node.text)

        for child in node:
            visit(child, child_skipped)
            if not child_skipped and state["verse"] is not None and child.tail:
                chapters[state["chapter"]][state["verse"]].append(child.tail)

    visit(book)

    result = [None]
    for chapter_number in range(1, max(chapters) + 1):
        verses = chapters[chapter_number]
        chapter = [None]
        for verse_number in range(1, max(verses) + 1):
            chapter.append(clean(verses.get(verse_number, [])))
        result.append(chapter)
    return result


def main():
    if len(sys.argv) != 4:
        raise SystemExit(
            "Usage: build_web_data.py INPUT.usfx.xml OUTPUT.json TRANSLATION_NAME"
        )

    source = Path(sys.argv[1])
    output = Path(sys.argv[2])
    translation_name = sys.argv[3]
    root = ET.parse(source).getroot()
    data = {"translation": translation_name, "books": {}}

    for book in root.findall("book"):
        book_id = book.attrib.get("id")
        if book_id in BOOKS:
            data["books"][BOOKS[book_id]] = parse_book(book)

    if len(data["books"]) != 66:
        raise SystemExit(f"Expected 66 books, found {len(data['books'])}")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    verse_count = sum(
        len(chapter) - 1
        for book in data["books"].values()
        for chapter in book[1:]
    )
    print(f"Wrote {len(data['books'])} books and {verse_count} verses to {output}")


if __name__ == "__main__":
    main()
