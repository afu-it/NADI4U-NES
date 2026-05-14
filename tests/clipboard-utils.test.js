const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadClipboardUtils(overrides = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'clipboard-utils.js'), 'utf8');
  const sandbox = {
    console,
    navigator: {},
    document: {},
    window: {},
    globalThis: {},
    prompt: () => ''
  };

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  Object.assign(sandbox, overrides);

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.NadiClipboardUtils;
}

function testDetectsPermissionsPolicyClipboardBlock() {
  const utils = loadClipboardUtils();
  const error = new Error("Failed to execute 'writeText' on 'Clipboard': The Clipboard API has been blocked because of a permissions policy applied to the current document.");
  error.name = 'NotAllowedError';

  assert.equal(
    utils.isClipboardPolicyBlockedError(error),
    true,
    'Should detect iframe permissions-policy clipboard block'
  );
}

function testIgnoresUnrelatedClipboardErrors() {
  const utils = loadClipboardUtils();
  const error = new Error('User denied permission');
  error.name = 'NotAllowedError';

  assert.equal(
    utils.isClipboardPolicyBlockedError(error),
    false,
    'Should not treat generic clipboard denial as permissions-policy block'
  );
}

async function testFallsBackToExecCommandCopy() {
  let appended = false;
  let removed = false;
  let selected = false;
  let copied = false;

  const textarea = {
    value: '',
    style: {},
    setAttribute: () => {},
    focus: () => {},
    select: () => { selected = true; },
    setSelectionRange: () => {},
    remove: () => { removed = true; }
  };

  const utils = loadClipboardUtils({
    navigator: {
      clipboard: {
        writeText: async () => {
          const error = new Error("Failed to execute 'writeText' on 'Clipboard': The Clipboard API has been blocked because of a permissions policy applied to the current document.");
          error.name = 'NotAllowedError';
          throw error;
        }
      }
    },
    document: {
      body: {
        appendChild: () => { appended = true; }
      },
      createElement: () => textarea,
      execCommand: (command) => {
        copied = command === 'copy';
        return copied;
      }
    }
  });

  const result = await utils.copyText('HELLO');

  assert.equal(result.ok, true, 'Should report success when legacy copy works');
  assert.equal(result.method, 'execCommand', 'Should use execCommand fallback');
  assert.equal(appended, true, 'Should append temporary textarea');
  assert.equal(selected, true, 'Should select textarea text');
  assert.equal(copied, true, 'Should issue copy command');
  assert.equal(removed, true, 'Should clean up temporary textarea');
}

async function testEmbeddedContextSkipsClipboardApi() {
  let clipboardCalls = 0;
  let copied = false;

  const textarea = {
    value: '',
    style: {},
    setAttribute: () => {},
    focus: () => {},
    select: () => {},
    setSelectionRange: () => {},
    remove: () => {}
  };

  const topWindow = {};
  const selfWindow = {};
  const utils = loadClipboardUtils({
    top: topWindow,
    self: selfWindow,
    navigator: {
      clipboard: {
        writeText: async () => {
          clipboardCalls += 1;
        }
      }
    },
    document: {
      body: {
        appendChild: () => {}
      },
      createElement: () => textarea,
      execCommand: (command) => {
        copied = command === 'copy';
        return copied;
      }
    }
  });

  const result = await utils.copyText('EMBED');

  assert.equal(result.ok, true, 'Embedded context should still copy successfully');
  assert.equal(result.method, 'execCommand', 'Embedded context should prefer legacy copy');
  assert.equal(clipboardCalls, 0, 'Embedded context should skip blocked Clipboard API');
  assert.equal(copied, true, 'Embedded context should use execCommand fallback');
}

async function run() {
  testDetectsPermissionsPolicyClipboardBlock();
  testIgnoresUnrelatedClipboardErrors();
  await testFallsBackToExecCommandCopy();
  await testEmbeddedContextSkipsClipboardApi();
  console.log('tests/clipboard-utils.test.js passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
