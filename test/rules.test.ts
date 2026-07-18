import { describe, it, expect } from 'vitest';
import {
  asyncLeakRule,
  debugLeakRule,
  nullDerefRule,
  memoryLeakRule,
  evalInjectionRule,
} from '../src/rules/index.js';

describe('AuditFence Heuristic Rules', () => {
  it('detects unhandled async promises', () => {
    const code = `
      function test() {
        fetch('https://api.example.com');
      }
    `;
    const issues = asyncLeakRule.check({ filePath: 'test.ts', content: code });
    expect(issues).toHaveLength(1);
    expect(issues[0]?.ruleId).toBe('unhandled-async-promise');
  });

  it('detects debug leaks (debugger, console.log, alert)', () => {
    const code = `
      debugger;
      console.log("debug info");
      alert("hello");
    `;
    const issues = debugLeakRule.check({ filePath: 'test.ts', content: code });
    expect(issues).toHaveLength(3);
  });

  it('detects potential null dereferences', () => {
    const code = `
      const id = response.data.user.profile.id;
    `;
    const issues = nullDerefRule.check({ filePath: 'test.ts', content: code });
    expect(issues).toHaveLength(1);
    expect(issues[0]?.ruleId).toBe('logic-null-deref');
  });

  it('detects memory leaks without event listener or interval cleanup', () => {
    const code = `
      window.addEventListener('resize', handleResize);
      setInterval(tick, 1000);
    `;
    const issues = memoryLeakRule.check({ filePath: 'test.ts', content: code });
    expect(issues).toHaveLength(2);
    expect(issues[0]?.ruleId).toBe('memory-leak-listener');
  });

  it('detects eval and dynamic function execution risks', () => {
    const code = `
      eval("console.log('unsafe')");
      const fn = new Function('a', 'return a');
    `;
    const issues = evalInjectionRule.check({ filePath: 'test.ts', content: code });
    expect(issues).toHaveLength(2);
    expect(issues[0]?.ruleId).toBe('eval-injection');
  });
});
