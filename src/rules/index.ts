import { AuditRule } from '../types.js';
import { asyncLeakRule } from './async-leak.js';
import { debugLeakRule } from './debug-leak.js';
import { nullDerefRule } from './null-deref.js';
import { memoryLeakRule } from './memory-leak.js';
import { evalInjectionRule } from './eval-injection.js';

export const allAuditRules: AuditRule[] = [
  asyncLeakRule,
  debugLeakRule,
  nullDerefRule,
  memoryLeakRule,
  evalInjectionRule,
];

export { asyncLeakRule, debugLeakRule, nullDerefRule, memoryLeakRule, evalInjectionRule };
