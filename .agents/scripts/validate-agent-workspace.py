#!/usr/bin/env python3
"""Validate deterministic .agents workspace rules."""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote


HARD_LINE_LIMIT = 500
PREFERRED_LINE_LIMIT = 200
REFERENCE_NAME_RE = re.compile(r"^(\d{5})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
LINK_RE = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)]+)\)")
SCHEME_RE = re.compile(r"^[a-zA-Z][a-zA-Z0-9+.-]*:")
MANAGED_RULE_FILES = (
    Path("references/00001-agent-workspace-rules.md"),
    Path("references/00002-intersection-points.md"),
    Path("references/00003-reference-recovery-points.md"),
    Path("workflows/agent-file-creation.md"),
    Path("workflows/agent-file-ingestion.md"),
    Path("workflows/context-initialization.md"),
    Path("workflows/spec-driven-development.md"),
    Path("workflows/spec-task-implementation.md"),
    Path("workflows/spec-grill-session.md"),
    Path("workflows/spec-user-journeys.md"),
    Path("workflows/repair-zombie-reference-files.md"),
)


@dataclass(frozen=True)
class Link:
    source: Path
    text: str
    raw_target: str
    clean_target: str
    resolved: Path | None


class Reporter:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)

    def print(self) -> None:
        for message in self.errors:
            print(f"ERROR: {message}")
        for message in self.warnings:
            print(f"WARN: {message}")
        if not self.errors and not self.warnings:
            print("OK: .agents workspace passed deterministic checks")
        elif not self.errors:
            print("OK: .agents workspace has warnings only")


def count_lines(path: Path) -> int:
    with path.open("r", encoding="utf-8") as handle:
        return sum(1 for _ in handle)


def is_relative_to(path: Path, parent: Path) -> bool:
    try:
        path.relative_to(parent)
        return True
    except ValueError:
        return False


def clean_link_target(raw: str) -> str:
    target = raw.strip()
    if target.startswith("<") and ">" in target:
        target = target[1 : target.index(">")]
    else:
        target = target.split()[0]
    target = target.split("#", 1)[0]
    return unquote(target)


def parse_links(agent_file: Path, agents_dir: Path) -> list[Link]:
    try:
        text = agent_file.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return []

    links: list[Link] = []
    for match in LINK_RE.finditer(text):
        link_text = match.group(1).strip()
        raw_target = match.group(2).strip()
        target = clean_link_target(raw_target)
        resolved: Path | None = None

        if target and not target.startswith("#") and not SCHEME_RE.match(target):
            resolved = (agent_file.parent / target).resolve(strict=False)

        links.append(
            Link(
                source=agent_file,
                text=link_text,
                raw_target=raw_target,
                clean_target=target,
                resolved=resolved,
            )
        )
    return links


def display(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def default_target_root() -> Path:
    script_path = Path(__file__).resolve()
    if (
        script_path.parent.name == "scripts"
        and script_path.parent.parent.name == ".agents"
    ):
        return script_path.parent.parent.parent
    return Path.cwd().resolve()


def validate_required_surface(agents_dir: Path, reporter: Reporter) -> None:
    if not agents_dir.exists():
        reporter.error(f"{agents_dir} is missing")
        return
    for rel in ("references", "scripts", "workflows"):
        path = agents_dir / rel
        if not path.is_dir():
            reporter.error(f"{display(path, agents_dir)} is missing")

    for rel in ("AGENTS.md", "TERMS.md"):
        path = agents_dir / rel
        if not path.is_file():
            reporter.error(f"{rel} is missing")

    validator = agents_dir / "scripts" / "validate-agent-workspace.py"
    if not validator.is_file():
        reporter.error("scripts/validate-agent-workspace.py is missing")

    for rel in MANAGED_RULE_FILES:
        path = agents_dir / rel
        if not path.is_file():
            reporter.error(f"{rel} is missing from the managed Agent Workspace surface")

    index = agents_dir / "context" / "index.md"
    if index.parent.exists() and not index.is_file():
        reporter.error("context/index.md is missing")


def validate_line_counts(agent_files: list[Path], agents_dir: Path, reporter: Reporter) -> None:
    for path in agent_files:
        lines = count_lines(path)
        rel = display(path, agents_dir)
        if lines > HARD_LINE_LIMIT:
            reporter.error(f"{rel} has {lines} lines; hard limit is {HARD_LINE_LIMIT}")
        elif lines > PREFERRED_LINE_LIMIT:
            reporter.warn(
                f"{rel} has {lines} lines; preferred target is under {PREFERRED_LINE_LIMIT}"
            )


def validate_references(
    references_dir: Path, agents_dir: Path, reporter: Reporter
) -> list[Path]:
    if not references_dir.exists():
        return []

    reference_files: list[Path] = []
    numbers: dict[str, Path] = {}

    for child in references_dir.iterdir():
        if child.is_dir():
            reporter.error(f"references/{child.name} is a subfolder; references must be flat")

    for path in sorted(references_dir.rglob("*.md")):
        reference_files.append(path.resolve())
        rel = display(path, agents_dir)
        if path.parent != references_dir:
            reporter.error(f"{rel} is nested; Reference Files must be direct children")
            continue

        match = REFERENCE_NAME_RE.match(path.name)
        if not match:
            reporter.error(
                f"{rel} has invalid name; expected 00001-meta-title.md format"
            )
            continue

        number = match.group(1)
        if number in numbers:
            reporter.error(
                f"{rel} duplicates Reference File number used by {display(numbers[number], agents_dir)}"
            )
        numbers[number] = path

    ordered = sorted(int(number) for number in numbers)
    if ordered:
        expected = list(range(1, max(ordered) + 1))
        if ordered != expected:
            reporter.warn(
                "references have numbering gaps; continue incrementing from the highest existing number"
            )

    return reference_files


def validate_links(
    links: list[Link],
    agents_dir: Path,
    references_dir: Path,
    resources_dir: Path,
    context_dir: Path,
    reporter: Reporter,
) -> dict[Path, set[Path]]:
    reference_inbound: dict[Path, set[Path]] = {}

    for link in links:
        if not link.clean_target or link.clean_target.startswith("#"):
            continue
        if link.resolved is None:
            continue

        rel_source = display(link.source, agents_dir)
        rel_target = display(link.resolved, agents_dir)

        if not link.resolved.exists():
            reporter.error(f"{rel_source} links to missing file {rel_target}")
            continue

        if not is_relative_to(link.resolved, agents_dir):
            continue

        is_reference = is_relative_to(link.resolved, references_dir)
        is_resource = is_relative_to(link.resolved, resources_dir)

        if is_reference:
            reference_inbound.setdefault(link.resolved, set())
            if link.source.resolve() != link.resolved:
                reference_inbound[link.resolved].add(link.source.resolve())

        if is_reference or is_resource:
            if not link.text:
                reporter.error(f"{rel_source} has empty link text for {rel_target}")
            elif link.text == Path(link.clean_target).name or "/" in link.text:
                reporter.warn(
                    f"{rel_source} link text for {rel_target} looks like a path, not a description"
                )

    index = context_dir / "index.md"
    if index.exists():
        for link in parse_links(index, agents_dir):
            if (
                link.resolved is not None
                and not is_relative_to(link.resolved, context_dir)
            ):
                reporter.error(
                    "context/index.md links outside .agents/context: "
                    f"{display(link.resolved, agents_dir)}"
                )

    return reference_inbound


def validate_zombies(
    reference_files: list[Path],
    inbound: dict[Path, set[Path]],
    agents_dir: Path,
    reporter: Reporter,
) -> None:
    for reference in reference_files:
        owners = inbound.get(reference.resolve(), set())
        if not owners:
            reporter.error(
                f"{display(reference, agents_dir)} is a zombie Reference File with no inbound link"
            )


def validate(target_root: Path) -> int:
    agents_dir = (target_root / ".agents").resolve(strict=False)
    context_dir = agents_dir / "context"
    references_dir = agents_dir / "references"
    resources_dir = agents_dir / "resources"

    reporter = Reporter()
    validate_required_surface(agents_dir, reporter)

    if not agents_dir.exists():
        reporter.print()
        return 1

    agent_files = sorted(
        path.resolve()
        for path in agents_dir.rglob("*.md")
        if not is_relative_to(path.resolve(), resources_dir)
    )
    validate_line_counts(agent_files, agents_dir, reporter)
    reference_files = validate_references(references_dir, agents_dir, reporter)

    links: list[Link] = []
    for agent_file in agent_files:
        links.extend(parse_links(agent_file, agents_dir))

    inbound = validate_links(
        links, agents_dir, references_dir, resources_dir, context_dir, reporter
    )
    validate_zombies(reference_files, inbound, agents_dir, reporter)

    reporter.print()
    return 1 if reporter.errors else 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate deterministic rules for a project .agents workspace."
    )
    parser.add_argument(
        "--target",
        default=None,
        help="Project root containing the .agents workspace. Defaults to the current directory unless this script is installed under .agents/scripts.",
    )
    args = parser.parse_args()

    target_root = (
        Path(args.target).expanduser().resolve()
        if args.target
        else default_target_root()
    )
    return validate(target_root)


if __name__ == "__main__":
    raise SystemExit(main())
