import fs from 'node:fs';
import path from 'node:path';

export function createTempFixture(dir: string, filename: string, content: string): string {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}
