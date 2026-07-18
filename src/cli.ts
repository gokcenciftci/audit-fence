import { Scanner } from './scanner.js';
import { ProviderType, ScannerOptions } from './types.js';

const pkgVersion = '0.1.0';

function printHelp() {
  console.log(`
AuditFence v${pkgVersion}
A deterministic, local-first AI code reviewer and security guard for CLI and CI.

Usage:
  npx audit-fence [paths...] [options]

Options:
  --provider <type>       AI provider: heuristic (default), ollama, mock
  --rules <list>          Comma-separated list of rule IDs to run
  --format <json|text>    Output format: text (default) or json
  --ollama-endpoint <url> Ollama API endpoint (default: http://localhost:11434)
  --ollama-model <model>  Ollama model (default: qwen2.5-coder:1.5b)
  --version, -v           Show version number
  --help, -h              Show help

Rules available:
  unhandled-async-promise  Detects unhandled promises without await/catch.
  debug-leak               Flags leftover debugger, console.log, or alert calls.
  logic-null-deref         Detects unsafe property access without optional chaining.
  memory-leak-listener     Flags un-removed event listeners or intervals.
  eval-injection           Detects unsafe eval() or dynamic Function execution.
`);
}

async function run() {
  const paths: string[] = [];
  let providerType: ProviderType = 'heuristic';
  let rulesFilter: string[] | undefined;
  let format: 'text' | 'json' = 'text';
  let ollamaEndpoint: string | undefined;
  let ollamaModel: string | undefined;

  // Support for GitHub Action inputs
  if (
    process.env.INPUT_PATHS ||
    process.env.INPUT_PROVIDER ||
    process.env.INPUT_RULES ||
    process.env.INPUT_FORMAT ||
    process.env.INPUT_OLLAMA_ENDPOINT ||
    process.env.INPUT_OLLAMA_MODEL
  ) {
    if (process.env.INPUT_PATHS) {
      paths.push(
        ...process.env.INPUT_PATHS.split(/\s+/)
          .map((p) => p.trim())
          .filter(Boolean)
      );
    }
    if (
      process.env.INPUT_PROVIDER === 'heuristic' ||
      process.env.INPUT_PROVIDER === 'ollama' ||
      process.env.INPUT_PROVIDER === 'mock'
    ) {
      providerType = process.env.INPUT_PROVIDER as ProviderType;
    }
    if (process.env.INPUT_RULES) {
      rulesFilter = process.env.INPUT_RULES.split(',')
        .map((r) => r.trim())
        .filter(Boolean);
    }
    if (process.env.INPUT_FORMAT === 'json' || process.env.INPUT_FORMAT === 'text') {
      format = process.env.INPUT_FORMAT as 'json' | 'text';
    }
    if (process.env.INPUT_OLLAMA_ENDPOINT) {
      ollamaEndpoint = process.env.INPUT_OLLAMA_ENDPOINT;
    }
    if (process.env.INPUT_OLLAMA_MODEL) {
      ollamaModel = process.env.INPUT_OLLAMA_MODEL;
    }
  } else {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
      printHelp();
      process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
      console.log(`audit-fence v${pkgVersion}`);
      process.exit(0);
    }

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === undefined) continue;

      if (arg === '--provider') {
        const nextArg = args[i + 1];
        if (nextArg === 'heuristic' || nextArg === 'ollama' || nextArg === 'mock') {
          providerType = nextArg as ProviderType;
          i++;
        } else {
          console.error('Error: --provider requires "heuristic", "ollama", or "mock".');
          process.exit(2);
        }
      } else if (arg === '--rules') {
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-')) {
          rulesFilter = nextArg.split(',').map((r) => r.trim());
          i++;
        } else {
          console.error('Error: --rules option requires a comma-separated list of rule IDs.');
          process.exit(2);
        }
      } else if (arg === '--format') {
        const nextArg = args[i + 1];
        if (nextArg === 'json' || nextArg === 'text') {
          format = nextArg as 'json' | 'text';
          i++;
        } else {
          console.error('Error: --format option requires "json" or "text".');
          process.exit(2);
        }
      } else if (arg === '--ollama-endpoint') {
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-')) {
          ollamaEndpoint = nextArg;
          i++;
        } else {
          console.error('Error: --ollama-endpoint requires a URL.');
          process.exit(2);
        }
      } else if (arg === '--ollama-model') {
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-')) {
          ollamaModel = nextArg;
          i++;
        } else {
          console.error('Error: --ollama-model requires a model name.');
          process.exit(2);
        }
      } else if (arg.startsWith('-')) {
        console.error(`Error: Unknown option "${arg}". Run with --help for usage.`);
        process.exit(2);
      } else {
        paths.push(arg);
      }
    }
  }

  const options: ScannerOptions = {
    paths: paths.length > 0 ? paths : ['.'],
    provider: providerType,
    rules: rulesFilter,
    ollamaEndpoint,
    ollamaModel,
  };

  const scanner = new Scanner(options);
  const issues = await scanner.scan();

  if (format === 'json') {
    console.log(JSON.stringify(issues, null, 2));
  } else {
    console.log(`\n🔍 AuditFence Security & Quality Report`);
    console.log(`Provider: ${providerType.toUpperCase()}`);
    console.log(`----------------------------------------`);

    if (issues.length === 0) {
      console.log(`\x1b[32m✔ No code logic or security issues detected.\x1b[0m\n`);
    } else {
      console.log(`\x1b[31m✖ Found ${issues.length} issue(s):\x1b[0m\n`);

      issues.forEach((issue) => {
        const lineInfo = issue.line ? `:${issue.line}` : '';
        const color = issue.severity === 'error' ? '\x1b[31m' : '\x1b[33m';
        console.log(`${color}[${issue.severity.toUpperCase()}]\x1b[0m ${issue.file}${lineInfo}`);
        console.log(`  Rule: ${issue.ruleId}`);
        console.log(`  Message: ${issue.message}`);
        if (issue.snippet) console.log(`  Snippet: ${issue.snippet}`);
        if (issue.suggestion) console.log(`  Suggestion: ${issue.suggestion}`);
        console.log('');
      });
    }
  }

  const hasErrors = issues.some((i) => i.severity === 'error');
  if (hasErrors) {
    process.exit(2);
  }
}

run().catch((err) => {
  console.error('Fatal AuditFence execution error:', err);
  process.exit(1);
});
