# Changelog

All notable changes to `AuditFence` will be documented in this file.

## [0.1.0] - 2026-07-18

### Added

- Initial release of AuditFence.
- Built-in zero-dependency `HeuristicProvider` (< 20ms execution).
- Optional local `OllamaProvider` REST integration with automatic heuristic fallback.
- 5 core audit rules: `unhandled-async-promise`, `debug-leak`, `logic-null-deref`, `memory-leak-listener`, `eval-injection`.
- Native GitHub Action (`action.yml`) support.
