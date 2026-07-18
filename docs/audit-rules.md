# Audit Rules Reference - AuditFence

| Rule ID                   | Severity      | Description                                                           |
| ------------------------- | ------------- | --------------------------------------------------------------------- |
| `unhandled-async-promise` | Error         | Detects unhandled promises without `await` or `.catch()`.             |
| `debug-leak`              | Warning/Error | Flags leftover `debugger`, `console.log`, or `alert()` calls.         |
| `logic-null-deref`        | Warning       | Detects unsafe property accesses without optional chaining (`?.`).    |
| `memory-leak-listener`    | Warning       | Identifies un-removed EventListeners or setIntervals without cleanup. |
| `eval-injection`          | Error         | Detects unsafe `eval()` or dynamic `Function()` execution vectors.    |
