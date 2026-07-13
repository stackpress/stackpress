# Pull Request Review Instructions

When reviewing a pull request:

- Review only problems introduced by the pull request.
- Prioritize functional bugs, regressions, security issues, broken public or
  generated contracts, package-boundary violations, and missing behavioral
  validation.
- Do not report style preferences, pre-existing problems, or speculative
  concerns without a concrete failure scenario.
- Follow the contributor rules in `/AGENTS.md`.
- Follow the Agent Workspace rules in `/.agents/AGENTS.md`.
- Begin project-context lookup at `/.agents/context/index.md` and load only the
  context and linked references relevant to the changed code.
- Treat `/.agents/context/` as accepted project truth. Do not treat
  `/.agents/specs/` as authoritative over context.
- For every finding, identify the affected file and line, explain the concrete
  failure scenario, and suggest a correction direction.
- If there are no actionable findings, do not invent one.
