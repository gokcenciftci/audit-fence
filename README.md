# AuditFence

[![CI](https://github.com/gokcenciftci/audit-fence/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/gokcenciftci/audit-fence/actions/workflows/ci.yml)
[![CodeQL](https://github.com/gokcenciftci/audit-fence/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/gokcenciftci/audit-fence/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AuditFence is a deterministic, local-first AI code reviewer and security guard for CLI and CI/CD. It analyzes source files for logic flaws, security vulnerabilities, unhandled async promises, debug leakage, and memory anti-patterns—completely offline with zero cloud dependencies.

> Part of the **Fence Security & Quality Suite** (`SchemaFence`, `ActionFence`, `EnvFence`, `AuditFence`).

## Features

- ⚡ **Zero-Dependency Heuristic Engine**: Runs static code analysis in < 20ms out-of-the-box.
- 🦙 **Optional Local Ollama LLM Integration**: Connects seamlessly to local Ollama instances (`qwen2.5-coder:1.5b`) with automatic heuristic fallback.
- 🔒 **100% Privacy-Preserving**: Code never leaves your machine or CI runner.
- ⚙️ **Native GitHub Action**: Drop-in `action.yml` for pull request auditing.

## Installation & Usage

### Local CLI

Run directly via `npx`:

```bash
npx audit-fence
```

Scan specific paths:

```bash
npx audit-fence src/ lib/ --provider heuristic
```

Use optional local Ollama LLM:

```bash
npx audit-fence --provider ollama --ollama-model qwen2.5-coder:1.5b
```

### GitHub Action

Add to `.github/workflows/audit.yml`:

```yaml
name: Audit Code

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run AuditFence
        uses: gokcenciftci/audit-fence@v0.1.0
```

## Audit Rules

| Rule ID                   | Severity      | Description                                                           |
| ------------------------- | ------------- | --------------------------------------------------------------------- |
| `unhandled-async-promise` | Error         | Detects unhandled promises without `await` or `.catch()`.             |
| `debug-leak`              | Warning/Error | Flags leftover `debugger`, `console.log`, or `alert()` calls.         |
| `logic-null-deref`        | Warning       | Detects unsafe property accesses without optional chaining (`?.`).    |
| `memory-leak-listener`    | Warning       | Identifies un-removed EventListeners or setIntervals without cleanup. |
| `eval-injection`          | Error         | Detects unsafe `eval()` or dynamic `Function()` execution vectors.    |

## License

[MIT](LICENSE) © Gökçen Çiftci
