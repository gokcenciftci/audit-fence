import fs from 'node:fs';
import path from 'node:path';
import { AuditIssue, ScannerOptions } from './types.js';
import { resolveProvider } from './providers/index.js';

export class Scanner {
  private options: ScannerOptions;

  constructor(options: ScannerOptions = {}) {
    this.options = options;
  }

  public async scan(): Promise<AuditIssue[]> {
    const pathsToCheck =
      this.options.paths && this.options.paths.length > 0 ? this.options.paths : ['.'];

    const fileEntries: { path: string; content: string }[] = [];

    for (const targetPath of pathsToCheck) {
      const resolved = path.resolve(process.cwd(), targetPath);
      if (!fs.existsSync(resolved)) {
        continue;
      }

      const stat = fs.statSync(resolved);
      if (stat.isFile()) {
        const content = fs.readFileSync(resolved, 'utf-8');
        fileEntries.push({ path: targetPath, content });
      } else if (stat.isDirectory()) {
        const found = this.scanDirectory(resolved, targetPath);
        fileEntries.push(...found);
      }
    }

    const provider = resolveProvider(this.options.provider ?? 'heuristic', {
      endpoint: this.options.ollamaEndpoint,
      model: this.options.ollamaModel,
      rules: this.options.rules,
    });

    return await provider.audit(fileEntries);
  }

  private scanDirectory(dirAbs: string, dirRel: string): { path: string; content: string }[] {
    const results: { path: string; content: string }[] = [];

    const entries = fs.readdirSync(dirAbs, { withFileTypes: true });

    for (const entry of entries) {
      const name = entry.name;
      if (
        name === 'node_modules' ||
        name === 'dist' ||
        name === '.git' ||
        name === 'coverage' ||
        name.startsWith('.')
      ) {
        continue;
      }

      const entryAbs = path.join(dirAbs, name);
      const entryRel = path.join(dirRel, name);

      if (entry.isDirectory()) {
        results.push(...this.scanDirectory(entryAbs, entryRel));
      } else if (entry.isFile() && this.isScannableFile(name)) {
        try {
          const content = fs.readFileSync(entryAbs, 'utf-8');
          results.push({ path: entryRel, content });
        } catch {
          // Ignore unreadable files
        }
      }
    }

    return results;
  }

  private isScannableFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go', '.rs'].includes(ext);
  }
}
