const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadReminderSystem(mockNowIso) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'reminder-system.js'), 'utf8');
  const RealDate = Date;

  class MockDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(mockNowIso);
        return;
      }
      super(...args);
    }

    static now() {
      return new RealDate(mockNowIso).getTime();
    }
  }

  const sandbox = {
    console,
    setInterval: () => 0,
    clearInterval: () => {},
    requestAnimationFrame: (callback) => callback(),
    confirm: () => true,
    alert: () => {},
    localStorage: { getItem: () => null, setItem: () => {} },
    window: {
      safeStorage: { getItem: () => null, setItem: () => {} }
    },
    document: {
      addEventListener: () => {},
      getElementById: () => null,
      body: { classList: { add: () => {}, remove: () => {}, toggle: () => {} } }
    },
    Date: MockDate
  };

  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.__testHooks = { DateUtils, ReminderUI };`, sandbox);
  return sandbox.__testHooks;
}

function createStore(reminders) {
  const doneCycles = new Set();

  return {
    getAll(type) {
      return reminders
        .filter((reminder) => reminder.type === type)
        .map((reminder) => ({ ...reminder }));
    },
    isQuarterlyCycleDone(id, cycleKey) {
      return doneCycles.has(`${id}:${cycleKey}`);
    },
    setQuarterlyCycleDone(id, cycleKey, isDone) {
      const key = `${id}:${cycleKey}`;
      if (isDone) {
        doneCycles.add(key);
        return;
      }
      doneCycles.delete(key);
    }
  };
}

function testDueRemindersOnlyIncludeToday() {
  const { ReminderUI } = loadReminderSystem('2026-04-08T09:00:00+08:00');
  const store = createStore([
    { id: 'weekly-today', type: 'weekly', title: 'Wednesday task', day: 3 }
  ]);
  const ui = new ReminderUI(store);

  const dueTitles = ui.getDueReminders().map((reminder) => reminder.title);

  assert.equal(dueTitles.join('|'), 'Wednesday task', 'Due reminders should only include reminders scheduled for today');
}

function testQuarterlyRolloverAfterEighth() {
  const { ReminderUI } = loadReminderSystem('2026-04-08T09:00:00+08:00');
  const store = createStore([]);
  const ui = new ReminderUI(store);

  const quarterlyReminder = ui.getQuarterlyReminders()[0];

  assert.equal(
    quarterlyReminder.title,
    'MCMC REPORT - Q2',
    'After the 8th, the automated quarterly reminder should roll to the next quarter title'
  );
}

function testQuarterlyMarqueeStaysUntilSeventh() {
  const { ReminderUI } = loadReminderSystem('2026-07-07T09:00:00+08:00');
  const store = createStore([]);
  const ui = new ReminderUI(store);

  const alertTitles = ui.getAlertReminders().map((reminder) => reminder.title);
  const quarterlyReminder = ui.getQuarterlyReminders()[0];
  const meta = ui.getReminderMeta(quarterlyReminder);

  assert.equal(
    alertTitles.join('|'),
    'MCMC REPORT - Q2',
    'Quarterly reminders should stay in the alert marquee through the 7th of the next month'
  );
  assert.equal(meta.countdown.text, 'Overdue', 'Quarterly reminders should read Overdue during the grace window');
}

function testQuarterlyMarqueeStopsAfterSeventh() {
  const { ReminderUI } = loadReminderSystem('2026-07-08T09:00:00+08:00');
  const store = createStore([]);
  const ui = new ReminderUI(store);

  const alertTitles = ui.getAlertReminders().map((reminder) => reminder.title);
  const meta = ui.getReminderMeta(ui.getQuarterlyReminders()[0]);

  assert.equal(alertTitles.join('|'), '', 'Quarterly reminders should leave the alert marquee after the 7th of the next month');
  assert.notEqual(meta.countdown.text, 'Overdue', 'Quarterly reminders should advance to the next cycle after the grace window');
}

function testCompletedQuarterlyShowsDoneAndLeavesMarquee() {
  const { ReminderUI } = loadReminderSystem('2026-07-03T09:00:00+08:00');
  const store = createStore([]);
  const ui = new ReminderUI(store);
  const reminder = ui.getQuarterlyReminders()[0];
  const initialMeta = ui.getReminderMeta(reminder);

  store.setQuarterlyCycleDone(reminder.id, initialMeta.cycleKey, true);

  const meta = ui.getReminderMeta(reminder);
  const alertTitles = ui.getAlertReminders().map((item) => item.title);

  assert.equal(meta.countdown.text, 'Done', 'Completed quarterly reminders should show Done during the grace window');
  assert.equal(alertTitles.join('|'), '', 'Completed quarterly reminders should be removed from the alert marquee');
}

function run() {
  testDueRemindersOnlyIncludeToday();
  testQuarterlyRolloverAfterEighth();
  testQuarterlyMarqueeStaysUntilSeventh();
  testQuarterlyMarqueeStopsAfterSeventh();
  testCompletedQuarterlyShowsDoneAndLeavesMarquee();
  console.log('tests/reminder-system.test.js passed');
}

run();
