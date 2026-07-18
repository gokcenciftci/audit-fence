# Architecture Overview - AuditFence

`AuditFence` is designed as a zero-dependency, local-first code auditor supporting both fast heuristic AST analysis and optional local LLM execution.

## Provider Pattern

1. **HeuristicProvider**: Built-in deterministic engine running static code checks in < 20ms.
2. **OllamaProvider**: REST client for local Ollama instances (`http://localhost:11434`), featuring automatic fallback to `HeuristicProvider` if Ollama is unavailable.
3. **MockProvider**: Used for deterministic unit and integration testing.
