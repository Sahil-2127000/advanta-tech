/**
 * Advanta Tech — enquiry form → Google Sheet
 *
 * Paste this into the Google Sheet's Extensions → Apps Script editor, then deploy it as a
 * Web app (Execute as: Me, Who has access: Anyone). Full steps are in the project README.
 *
 * Every valid form submission becomes one row in the "Enquiries" tab. The header row is
 * created automatically the first time.
 */

// ── Settings ───────────────────────────────────────────────────────────────
const SHEET_NAME = 'Enquiries';
// Who gets an email for each new enquiry. Set to '' to turn notifications off.
const NOTIFY_EMAIL = 'hello@advantatech.co';
// Safety cap against floods of spam: at most this many rows per 10 minutes.
const MAX_PER_10_MIN = 30;

const COLUMNS = [
  ['submittedAt', 'Submitted at (IST)'],
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['company', 'Company'],
  ['serviceName', 'Service'],
  ['budget', 'Budget'],
  ['message', 'Message'],
  ['page', 'Sent from'],
];
const LIMITS = { name: 100, email: 254, phone: 20, company: 120, service: 60, serviceName: 80, budget: 40, message: 1500, page: 200 };

// ── Entry points ───────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: real visitors never see this field, so a value means a bot. Pretend it worked.
    if (data.website) return json({ ok: true });

    const clean = {};
    Object.keys(LIMITS).forEach(function (k) {
      clean[k] = String(data[k] == null ? '' : data[k]).trim().slice(0, LIMITS[k]);
    });

    const error = validate(clean);
    if (error) return json({ ok: false, error: error });

    if (!underRateLimit()) return json({ ok: false, error: 'Too many enquiries right now. Please try again in a few minutes or WhatsApp us.' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet();
      clean.submittedAt = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm');
      if (!clean.serviceName) clean.serviceName = clean.service;
      sheet.appendRow(COLUMNS.map(function (c) { return safeCell(clean[c[0]]); }));
    } finally {
      lock.releaseLock();
    }

    notify(clean);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'Something went wrong. Please try again or WhatsApp us.' });
  }
}

/** Opening the web app URL in a browser just confirms it is running. */
function doGet() {
  return json({ ok: true, service: 'Advanta Tech enquiries' });
}

// ── Helpers ────────────────────────────────────────────────────────────────
function validate(d) {
  if (d.name.length < 2) return 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return 'Please enter a valid email.';
  if (!/^[+\d][\d\s()-]*$/.test(d.phone) || d.phone.replace(/\D/g, '').length < 10) return 'Please enter a valid phone number.';
  if (!d.service) return 'Please choose a service.';
  if (d.message.length < 10) return 'Please add a sentence or two about your project.';
  return '';
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#0455c0').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(8, 420);
  }
  return sheet;
}

/** Stops spreadsheet formula injection: text starting with = + - @ is stored as plain text. */
function safeCell(value) {
  const v = value == null ? '' : String(value);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function underRateLimit() {
  const cache = CacheService.getScriptCache();
  const key = 'count_' + Math.floor(Date.now() / 600000);
  const count = Number(cache.get(key) || 0);
  if (count >= MAX_PER_10_MIN) return false;
  cache.put(key, String(count + 1), 660);
  return true;
}

function notify(d) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: d.email,
      subject: 'New enquiry: ' + d.name + ' — ' + d.serviceName,
      body: [
        'Name: ' + d.name,
        'Email: ' + d.email,
        'Phone: ' + d.phone,
        'Company: ' + (d.company || '—'),
        'Service: ' + d.serviceName,
        'Budget: ' + (d.budget || '—'),
        '',
        d.message,
        '',
        'Sent from: ' + (d.page || '—') + ' at ' + d.submittedAt + ' IST',
      ].join('\n'),
    });
  } catch (err) {
    console.error('Email notification failed', err); // the row is already saved
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
