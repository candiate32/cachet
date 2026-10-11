(() => {
'use strict';

/* ================= Knowledge base (pre-scripted) ================= */
const DOCS = [
  { name: 'Employee Handbook 2026.pdf', meta: '42 pages · 186 chunks', chunks: 186 },
  { name: 'Refund & Returns Policy.pdf', meta: '6 pages · 24 chunks', chunks: 24 },
  { name: 'Meridian Cloud FAQ.md', meta: '58 chunks', chunks: 58 },
  { name: 'Security Whitepaper.pdf', meta: '12 pages · 61 chunks', chunks: 61 },
];
const HB = 'Employee Handbook 2026.pdf', RF = 'Refund & Returns Policy.pdf', FAQ = 'Meridian Cloud FAQ.md', SEC = 'Security Whitepaper.pdf';

const INTENTS = {
  pto: {
    label: 'Vacation days', center: [62, 58],
    q: 'How many vacation days do I get per year?',
    para: ["What's my annual PTO allowance?", 'How much paid time off do employees get?', 'Days off per year?'],
    answer: 'Full-time employees get **22 days of paid time off** per year, accrued monthly (about 1.83 days a month).\n\n- Tenure bonus: one extra day for every 2 years of service, up to 27 days\n- Up to **5 unused days** carry over and must be used by March 31\n- The 11 public holidays in 2026 are separate from PTO',
    alt: 'You get **22 days of paid time off a year** if you work full time, plus the **11 public holidays**, which do not count against PTO.\n\n- Days accrue monthly at 1.83 a month, so you can book them as you earn them\n- Part-time staff accrue pro rata (for example 13.2 days at 3 days a week)\n- Every 2 years of service adds a day, up to 27\n- Carry over up to 5 days; they expire on March 31\n\nBook anything longer than 3 days in Workday at least 2 weeks ahead.',
    sources: [[HB, '§4.2 Paid time off · p.14', 0.91], [HB, '§4.3 Carry-over · p.15', 0.84], [HB, 'Appendix B Holiday calendar · p.39', 0.71]],
  },
  parental: {
    label: 'Parental leave', center: [118, 34],
    q: 'How long is parental leave?',
    para: ['How much maternity leave do we get?', 'How many weeks off do new parents get?'],
    answer: 'Primary caregivers get **16 weeks of fully paid parental leave**; secondary caregivers get **8 weeks**.\n\n- Leave can be taken any time in the first 12 months after birth or adoption\n- A 2-week phased return at a 60% schedule follows, on full pay\n- Eligibility starts after 90 days of employment',
    alt: 'Meridian gives **16 weeks of fully paid leave to primary caregivers** and **8 weeks to secondary caregivers**, for birth, adoption and foster placement alike.\n\n- Take it in one block, or in up to 3 blocks within 12 months\n- Come back on a 60% schedule for 2 weeks at full pay\n- You are eligible after 90 days of employment\n\nTell your manager and HR at least 4 weeks before your planned start date.',
    sources: [[HB, '§4.6 Parental leave · p.18', 0.93], [HB, '§4.7 Phased return · p.19', 0.80]],
  },
  remote: {
    label: 'Remote work', center: [96, 104],
    q: 'Can I work from home?',
    para: ['Is remote work allowed?', "What's the WFH policy?"],
    answer: 'Meridian is **hybrid by default**: teams are in the office Tuesday to Thursday and remote the rest of the week.\n\n- Fully remote roles need approval from a VP\n- Everyone can work from anywhere for up to 4 weeks a year\n- A one-time **$500 home-office stipend** covers equipment',
    alt: 'Yes, within the hybrid policy: most teams work from the office **Tuesday to Thursday** and from home on Monday and Friday.\n\n- Fully remote arrangements need VP approval and are reviewed every year\n- You can work from anywhere, including abroad, for up to **4 weeks a year**\n- Hybrid and remote staff get a one-time **$500 home-office stipend**\n\nCheck with your manager first if your team has different office days.',
    sources: [[HB, '§6.1 Hybrid work · p.24', 0.90], [HB, '§6.3 Work from anywhere · p.25', 0.82]],
  },
  expense: {
    label: 'Expenses', center: [44, 150],
    q: 'How do I submit an expense report?',
    para: ['How do I get reimbursed for travel?', 'Where do I file my receipts?'],
    answer: 'Submit expenses in **Ramp within 30 days** of the purchase, with an itemised receipt photo for anything over $25.\n\n- Travel meals are covered up to **$75 per day**\n- Your manager approves; finance pays out in the next payroll run\n- Claims older than 90 days need a director\'s sign-off',
    alt: 'Log the expense in **Ramp within 30 days** and attach a photo of the itemised receipt (required above $25).\n\n- Your manager approves it, and it is paid in the next payroll run\n- Meals while travelling are covered up to **$75 a day**\n- Anything older than 90 days needs a director to sign off\n\nLost the receipt? Ramp accepts a missing-receipt declaration for amounts up to $75.',
    sources: [[HB, '§7.2 Expense claims · p.28', 0.92], [HB, '§7.4 Travel per diem · p.29', 0.85]],
  },
  refund: {
    label: 'Refund policy', center: [232, 50],
    q: 'What is the refund window?',
    para: ['How long do I have to get my money back?', 'Can I return my order after a month?', "what's your returns policy"],
    answer: 'You can get a **full refund within 30 days** of the order date.\n\n- Days 31 to 60: the refund is issued as store credit\n- After 60 days: no refund, but annual plans can be downgraded at renewal\n- Activated digital licences cannot be refunded\n\nStart a return from **Orders → Request refund**. Approved refunds reach the original payment method in 5 to 7 business days.',
    alt: 'Refunds depend on how long ago you ordered:\n\n- **Within 30 days**: full refund to your original payment method\n- **Days 31 to 60**: refund as store credit\n- **After 60 days**: no refund, though annual plans can be downgraded at renewal\n\nActivated digital licences are not refundable. Start from **Orders → Request refund**; approved refunds arrive in 5 to 7 business days.',
    sources: [[RF, '§2 Refund window · p.2', 0.94], [RF, '§3 Store credit · p.3', 0.83], [RF, '§5 Digital licences · p.4', 0.74]],
  },
  cancel: {
    label: 'Cancellation', center: [282, 92],
    q: 'How do I cancel my subscription?',
    para: ['How do I unsubscribe from Meridian Cloud?', 'Can I stop my subscription at any time?'],
    answer: 'Cancel any time from **Settings → Billing → Cancel plan**. There is no cancellation fee.\n\n- You keep access until the end of the current billing period\n- Workspace data stays available for export for 30 days, then it is deleted\n- Annual plans cancelled in the first 30 days are refunded in full',
    alt: 'Go to **Settings → Billing → Cancel plan**. Cancelling is free and takes effect at the end of your billing period.\n\n- You keep full access until then\n- Your data can be exported for 30 days after cancellation, then it is deleted\n- Annual plans cancelled within 30 days are refunded in full\n\nOnly workspace owners and billing admins can cancel.',
    sources: [[FAQ, 'Billing · Cancelling a plan', 0.92], [RF, '§2 Refund window · p.2', 0.77]],
  },
  price: {
    label: 'Pricing', center: [212, 112],
    q: 'How much does the Team plan cost?',
    para: ['What are your pricing plans?', 'How expensive is Meridian Cloud?'],
    answer: 'Meridian Cloud has three plans, billed per user each month:\n\n- **Starter**: $12, up to 10 users\n- **Team**: $29, unlimited users, SSO and audit log\n- **Enterprise**: custom pricing, with data residency and customer-managed keys\n\nPaying annually gets you 2 months free.',
    alt: 'Prices are per user per month:\n\n- **Starter**: $12, for teams of up to 10\n- **Team**: $29, with unlimited users, SSO and the audit log\n- **Enterprise**: custom quote, adding data residency and customer-managed keys\n\nAnnual billing gives you 2 months free, so Team works out at about $24 per user per month.',
    sources: [[FAQ, 'Plans & pricing', 0.95], [FAQ, 'Billing · Annual discount', 0.79]],
  },
  sso: {
    label: 'Single sign-on', center: [168, 176],
    q: 'Does Meridian Cloud support single sign-on?',
    para: ['Can we log in with Okta?', 'Is SAML supported?'],
    answer: 'Yes. Meridian Cloud supports **SAML 2.0 and OpenID Connect** on the Team and Enterprise plans.\n\n- Tested with Okta, Microsoft Entra ID (Azure AD), Google Workspace and OneLogin\n- SCIM provisioning creates and removes users automatically\n- Admins can enforce SSO-only login for the whole workspace',
    alt: 'Yes, on the **Team and Enterprise plans**. Meridian Cloud supports **SAML 2.0** and **OpenID Connect**.\n\n- Verified identity providers: Okta, Microsoft Entra ID, Google Workspace and OneLogin\n- SCIM provisioning adds and removes users automatically\n- Admins can require SSO for every login\n\nSet it up under **Settings → Security → Single sign-on**.',
    sources: [[FAQ, 'Security · Single sign-on', 0.93], [SEC, '§3.1 Identity & access · p.5', 0.86]],
  },
  encrypt: {
    label: 'Encryption', center: [238, 178],
    q: 'Is my data encrypted?',
    para: ['How do you encrypt customer data?', 'Is data encrypted at rest?'],
    answer: 'Yes. All customer data is encrypted **at rest with AES-256** and **in transit with TLS 1.3**.\n\n- Encryption keys rotate every 90 days\n- Enterprise customers can bring their own keys through AWS KMS or Azure Key Vault\n- Backups are encrypted with separate keys and kept for 35 days',
    alt: 'Yes. Customer data is encrypted **at rest with AES-256** and **in transit with TLS 1.3**, and no plaintext copies are kept.\n\n- Keys rotate every 90 days and are held in a managed KMS\n- Enterprise plans can use their own keys (AWS KMS or Azure Key Vault)\n- Backups use separate keys and are kept for 35 days\n\nThe full detail is in §4 of the Security Whitepaper.',
    sources: [[SEC, '§4.1 Encryption at rest · p.7', 0.95], [SEC, '§4.2 Encryption in transit · p.7', 0.88], [SEC, '§4.4 Key management · p.8', 0.81]],
  },
  residency: {
    label: 'Data residency', center: [290, 150],
    q: 'Where is our data stored?',
    para: ['Which regions host customer data?', 'Can we keep data in the EU?'],
    answer: 'Customer data is stored in the region you choose when the workspace is created:\n\n- **United States** (Virginia)\n- **European Union** (Frankfurt), GDPR-aligned\n- **India** (Mumbai)\n\nData never leaves its region, including backups. Moving regions is available on Enterprise plans.',
    alt: 'You pick the region when you create a workspace, and all data, backups included, stays there:\n\n- **United States**: Virginia\n- **European Union**: Frankfurt, GDPR-aligned\n- **India**: Mumbai\n\nMoving an existing workspace to another region is available on Enterprise plans.',
    sources: [[SEC, '§5 Data residency · p.9', 0.94], [FAQ, 'Security · Where is my data?', 0.87]],
  },
  trial: {
    label: 'Free trial', center: [176, 70],
    q: 'Is there a free trial?',
    para: ['Can I try Meridian Cloud for free?', 'How long is the free trial?'],
    answer: 'Yes. Every new workspace starts with a **14-day free trial of the Team plan**, and no credit card is needed.\n\n- Up to 25 people can join during the trial\n- When it ends, pick a plan or the workspace becomes read-only for 30 days\n- Enterprise trials can be extended to 30 days through sales',
    alt: 'You can try Meridian Cloud free for **14 days** on the **Team plan**, without a credit card.\n\n- Invite up to 25 people during the trial\n- Everything you create carries over when you subscribe\n- If you do nothing, the workspace turns read-only for 30 days, then it is deleted\n\nNeed longer to evaluate Enterprise features? Sales can extend it to 30 days.',
    sources: [[FAQ, 'Plans · Free trial', 0.94], [FAQ, 'Billing · After the trial', 0.81]],
  },
  sick: {
    label: 'Sick leave', center: [26, 104],
    q: 'How many sick days do I get?',
    para: ['What is the sick leave policy?', 'Do I get paid when I am ill?'],
    answer: 'Sick leave is **separate from PTO**: you get **10 paid sick days a year**, and they do not carry over.\n\n- Tell your manager before your start time on the first day\n- From the 4th day in a row you need a doctor\'s note\n- Longer illness moves to short-term disability at 70% pay after 2 weeks',
    alt: 'You have **10 paid sick days a year**, on top of your 22 days of PTO.\n\n- Let your manager know before your usual start time\n- A doctor\'s note is needed from the 4th consecutive day\n- Unused sick days reset on January 1\n\nIf you are off for more than 2 weeks, HR moves you to short-term disability at 70% pay.',
    sources: [[HB, '§4.4 Sick leave · p.16', 0.93], [HB, '§4.5 Short-term disability · p.17', 0.80]],
  },
  incident: {
    label: 'Security incidents', center: [98, 196],
    q: 'Who do I contact about a data breach?',
    para: ['How do I report a security incident?', 'Where do I report a vulnerability?'],
    answer: 'Report it to the **Security team immediately**: post in **#security-incidents** or page the on-call engineer from the Security portal. Someone responds within **15 minutes, 24/7**.\n\n- Do not investigate or delete anything yourself\n- Customers are notified within 72 hours of a confirmed breach, as GDPR requires\n- Outside researchers can report vulnerabilities through the bug bounty programme',
    alt: 'Contact the **Security team right away** through **#security-incidents** or the on-call page in the Security portal; they answer within **15 minutes**, day or night.\n\n- Leave affected systems as they are so evidence is preserved\n- Confirmed breaches are reported to affected customers within 72 hours\n- Vulnerabilities found by outsiders go through the bug bounty programme\n\nNot sure it is an incident? Report it anyway; false alarms are fine.',
    sources: [[SEC, '§7 Incident response · p.11', 0.94], [SEC, '§7.2 Breach notification · p.11', 0.85]],
  },
};
// One concrete change per topic, used when a newer uploaded document on that topic is indexed.
const CHANGE = {
  pto: ['§2 Advance leave', 'new hires can now borrow up to **5 days** of PTO before they have accrued it'],
  parental: ['§3 Family support', 'parents also get a one-time **$1,000 family-care stipend**'],
  remote: ['§2 Coworking', 'fully remote staff can now expense a coworking membership up to **$150 a month**'],
  expense: ['§3 Hotels', 'hotel stays are now capped at **$220 a night** ($300 in New York, London and San Francisco)'],
  refund: ['§4 Accessories', 'hardware accessories now have their own **14-day** return window'],
  cancel: ['§3 Pausing', 'you can now pause a subscription for up to **3 months** instead of cancelling'],
  price: ['§1 Discounts', 'nonprofits and schools now get **30% off** any plan'],
  sso: ['§2 Plans', 'SSO is now also available on **Starter** as a **$3 per user** add-on'],
  encrypt: ['§4 Field-level encryption', 'fields marked sensitive are now also encrypted at **field level**'],
  residency: ['§5 Regions', 'a new **Australia (Sydney)** region is available in addition to the three above'],
  trial: ['§2 Extensions', 'trials can now be extended once by **7 days** from Settings → Billing'],
  sick: ['§2 Family care', 'sick days can now also be used to **care for a sick family member**'],
  incident: ['§1 Phishing', 'suspected phishing emails should now be reported with the **Report phishing** button in Mail'],
};

/* ---- vocabulary: how people actually ask about each topic ----
   Terms are in stemmed form (see stem()). "term:3" strong, ":2" medium, bare = weak (1). Multi-word terms match as phrases. */
const V = s => s.split('|').map(t => { const [w, k] = t.split(':'); return [w, k ? +k : 1]; });
const VOCAB = {
  pto: V('vacation:3|pto:3|holiday:3|time off:3|day off:3|annual leave:3|paid leave:2|leave day:3|day of leave:3|leave allowance:3|leave entitlement:3|leave balance:3|personal day:3|time away:3|take off:2|leave:3|getaway|break|day|year|yearly|annual|allowance|entitlement|accrue|accrual|accrued|carry|carryover|rollover|unused|off|paid|employee|staff|balance|book|take|month|tenure|public|national|bank|christmas|summer|rest|calendar|allowed|allow|left|remaining|over|use|expire|expiry'),
  parental: V('parental:3|maternity:3|paternity:3|baby:3|newborn:3|adoption:3|adopt:3|adopting:3|pregnant:3|pregnancy:3|expecting:2|new parent:3|parent:3|caregiver:3|family leave:3|birth:3|born:2|dad:3|mom:3|mum:3|father:3|mother:3|child:2|kid:2|leave|week|long|paid|new|family|having|primary|secondary|return|time|off|happen|happens|leave policy'),
  remote: V('remote:3|remotely:3|wfh:3|work from home:3|working from home:3|from home:3|hybrid:3|telework:3|telecommute:3|work from anywhere:3|return to office:3|back to the office:3|in the office:3|office day:3|office:2|commute:2|home office:3|stipend:2|work abroad:3|anywhere:2|home|work|working|location|week|day|allowed|policy|abroad|country|travel|onsite|on-site|go|come|need|tuesday|thursday|friday|monday|setup|equipment|month|week|abroad|overseas|monday|tuesday|wednesday|thursday|friday|weekday|weekend|week'),
  expense: V('expense:3|reimburse:3|reimbursed:3|reimbursement:3|receipt:3|per diem:3|expense report:3|claim back:3|ramp:3|company card:3|corporate card:3|hotel:3|flight:3|mileage:3|lodging:3|accommodation:3|travel:2|trip:2|business trip:3|meal:2|dinner:2|lunch:2|taxi:2|uber:2|spend:2|spending:2|allowance|limit|claim|submit|pay|paid|back|business|file|food|cost|money|out of pocket:3|pocket|approve|approval|budget|nightly|night|stay|booking|book|airfare|laptop|equipment|computer|monitor|hardware|phone|headset|desk|chair|purchase|buy|bought'),
  refund: V('refund:3|refunded:3|refundable:3|money back:3|return:2|returns policy:3|return policy:3|returning:2|send back:3|send it back:3|chargeback:3|reimburse my order:3|exchange:2|store credit:3|window|order|purchase|purchased|bought|buy|day|policy|month|credit|long|after|item|product|licence|license|unhappy|satisfied|guarantee:2'),
  cancel: V('cancel:3|cancellation:3|cancelling:3|canceling:3|unsubscribe:3|terminate:3|termination:3|close my account:3|delete my account:3|end my subscription:3|stop my subscription:3|stop paying:3|quit:2|churn:2|leave meridian:3|get out of:2|subscription|account|plan|renew|renewal|billing|stop|end|contract|notice|fee|anytime|time|meridian|cloud'),
  price: V('price:3|pricing:3|cost:2|how much is:2|how much does:2|expensive:3|cheap:3|cheaper:3|afford:2|plan:2|tier:3|team plan:3|starter:3|enterprise plan:3|per seat:3|seat:2|per user:3|discount:3|quote:2|fee|subscription|month|monthly|user|team|pay|annual|billed|billing|enterprise|meridian|cloud|option|charge|dollar|budget'),
  sso: V('sso:3|saml:3|okta:3|oidc:3|openid:3|single sign-on:3|single sign on:3|sign in with:3|log in with:3|login with:3|entra:3|azure ad:3|onelogin:3|scim:3|google workspace:3|identity provider:3|idp:3|active directory:3|login:2|log in:2|sign in:2|signin:2|authentication:2|authenticate:2|auth:2|identity|provider|password|mfa|2fa|support|supported|integrate|integration|meridian|cloud|use|our|corporate|account|google|microsoft'),
  encrypt: V('encrypt:3|encrypted:3|encryption:3|aes:3|tls:3|ssl:3|at rest:3|in transit:3|protected:3|protect:3|protection:3|secure:3|security:2|safe:3|safely:3|kms:3|key management:3|byok:3|cipher:3|privacy:2|data|customer|key|backup|hack|personal|information|info|sensitive|handled|keep|store|kept|how|safeguard:3|file|document|attachment|backup|stored|protected|protect|secure|safe'),
  trial: V('free trial:3|trial:3|trial period:3|try:2|try it:3|for free:3|free:2|test drive:3|evaluate:2|evaluation:2|demo:2|credit card:2|before buying:3|before i buy:3|long|period|day|meridian|cloud|sign up|signup|start|without|paying'),
  sick: V('sick:3|sick leave:3|sick day:3|ill:3|illness:3|unwell:3|doctor:3|doctors note:3|medical:2|flu:3|covid:3|sickness:3|hospital:2|injury:2|disability:2|leave|day|paid|pay|year|policy|call|note|off|work|get|feel|feeling|home|stay|time|need'),
  incident: V('breach:3|data breach:3|incident:3|security incident:3|vulnerability:3|vulnerabilitie:3|hacked:3|hack:3|compromised:3|phishing:3|leak:3|leaked:3|bug bounty:3|security team:3|suspicious:2|malware:3|virus:2|report:1|contact:1|who|security|data|account|email|someone|found|think|happen|happened|do'),
  residency: V('stored:3|storage:2|region:3|residency:3|hosted:3|host:3|hosting:3|located:3|where is our data:3|where is my data:3|eu:3|europe:3|european:3|gdpr:3|datacenter:3|data center:3|data centre:3|server:2|sovereignty:3|locality:3|india:2|united state:2|frankfurt:3|virginia:3|mumbai:3|data|customer|keep|country|where|live|kept|location|which|cloud|aws|us|compliant:2|compliance:2'),
};
const RELATED = new Set(['pto|parental', 'pto|remote', 'parental|remote', 'pto|expense', 'refund|cancel', 'cancel|price', 'price|sso', 'sso|encrypt', 'encrypt|residency', 'price|residency']);
const related = (a, b) => RELATED.has(a + '|' + b) || RELATED.has(b + '|' + a);

const FILLER = new Set('tell give find make thing something anything everything question info information detail exactly actually currently right now today sure able possible okay need want wonder wondering hello hi hey thank thanks quick quickly guy help explain mean work job company meridian cloud policy rule general generally usually normally typically way kind sort lot bit time look looking ask asking offer provide available'.split(' '));
const STOP = new Set('a an the is are am was were be been do does did i me my we our us you your it its of to in on for at by with from and or can could would should will shall what whats which who how when where why there this that these those any some get got have has had per much many please tell about if than then so just also really need want know s im ive id dont doesnt there their they them he she his her as into up out more most very too all every each one ok okay hey still like let say said go going does doing well'.split(' '));
const GENERIC = new Set('meridian cloud company policy policies rule rules question exactly actually currently typically usually normally generally like guy anyone someone somebody thing stuff wondering wonder quick here our team new employee staff customer user client people person member file data enterprise plan account org organization organisation business firm worker colleague coworker full part-time contractor'.split(' '));
const OK_EXT = ['pdf', 'docx', 'md', 'txt', 'html', 'csv'];
const FILE_NOISE = new Set('pdf docx md txt html csv v1 v2 v3 v4 v5 final draft copy doc document version rev new updated latest old 2023 2024 2025 2026 2027 policy policies'.split(' '));

const norm = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const NOSTEM = new Set('does was has this yes always perhaps less across thus plus bonus status access process business news series'.split(' '));
function stem(w) {
  if (NOSTEM.has(w)) return w;
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 3 && w.endsWith('s') && !/(ss|us|is|as)$/.test(w)) return w.slice(0, -1);
  return w;
}
const words = text => norm(text).split(' ').filter(Boolean);

/* Analyse a question: best topic, coverage, multi-part, small talk, gibberish. */
const GREET = /^(hi+|hello+|hey+|heya|hiya|yo|howdy|hola|good (morning|afternoon|evening)|morning|thanks+|thank you( so much| very much)?|thanks a lot|many thanks|thx|ty|cheers|ok(ay)?|cool|great|nice|awesome|perfect|got it|bye|goodbye|see you)( there| claude| cachet| team| all| everyone| again)?[\s!.?,:)]*$/i;
const MASH = /(asdf|qwer|zxcv|hjkl|sdfg|dfgh|fghj|ghjk|jkl|uiop|wert|ertz|xcvb|cvbn|vbnm|lkj|kjh|jhg|hgf|gfd|fds|dsa|poi|oiu)/;
function wordlike(w) {
  if (/^\d+$/.test(w)) return true;
  if (!/[aeiouy]/.test(w)) return w.length <= 2 || ['tls', 'sso', 'pto', 'wfh', 'scim', 'kms', 'gdpr', 'mfa', 'saml', 'hr'].includes(w);
  if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(w) || /(.)\1\1/.test(w) || MASH.test(w)) return false;
  return w.length <= 18;
}
function analyse(text) {
  const raw = words(text);
  const st = raw.map(stem);
  const hay = ' ' + st.join(' ') + ' ';
  const content = st.filter((w, i) => !STOP.has(w) && !STOP.has(raw[i]));
  const res = { gap: [], gapRaw: [], words: raw.length, content: content.length, id: null, ids: [], coverage: 0, multi: false, kind: 'query', scores: {} };
  if (GREET.test(text.trim())) { res.kind = 'greet'; return res; }
  if (!raw.length || raw.filter(wordlike).length / raw.length < 0.6) { res.kind = 'gib'; return res; }
  const all = { ...VOCAB, ...S.dynVocab };
  const scored = [];
  for (const [id, terms] of Object.entries(all)) {
    let score = 0, top = 0, at = 1e9; const hitWords = new Set();
    for (const [t, w] of terms) {
      const ix = hay.indexOf(' ' + t + ' ');
      if (ix >= 0) { score += w; top = Math.max(top, w); t.split(' ').forEach(x => hitWords.add(x)); if (w >= 2) at = Math.min(at, ix); }
    }
    if (top >= 2 && score >= 3) scored.push({ id, score, top, hitWords, at });
    res.scores[id] = score;
  }
  scored.sort((a, b) => b.score - a.score);
  if (scored.length) {
    const best = scored[0];
    res.id = best.id;
    res.coverage = content.length ? content.filter(w => best.hitWords.has(w) || GENERIC.has(w)).length / content.length : 0;
    res.strong = best.top;
    // salient words the topic's vocabulary does not cover: a sign the question asks for something the docs may not have
    const topicWords = new Set(all[best.id].flatMap(([t]) => t.split(' ')));
    res.gap = [...new Set(content.filter(w => !topicWords.has(w) && !GENERIC.has(w) && !FILLER.has(w) && w.length > 2))];
    res.gapRaw = res.gap.map(g => raw[st.indexOf(g)] || g);
    res.ids = scored.filter((s, i) => i === 0 || (s.top >= 3 && s.score >= 4 && [...s.hitWords].some(w => !best.hitWords.has(w)))).sort((x, y) => x.at - y.at).map(s => s.id);
  }
  const qmarks = (text.match(/\?/g) || []).length;
  const clauses = /\b(and|also|plus|or)\s+(how|what|whats|where|when|can|is|are|do|does|will|should|which|who|why)\b/.test(norm(text));
  const twoTopics = res.ids.length >= 2;
  res.multi = !!res.id && (raw.length > 18 || qmarks >= 2 || (clauses && raw.length > 8) || (twoTopics && (clauses || qmarks >= 2 || raw.length > 12)));
  if (!res.multi) res.ids = res.id ? [res.id] : [];
  return res;
}

/* ================= Deterministic pseudo-randomness ================= */
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const r01 = (s) => rng(hash(s))();
const between = (s, lo, hi) => lo + r01(s) * (hi - lo);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Similarities quoted on the page ("Why semantic" table) against the cached vacation question. */
const TABLE_SIM = { 'whats my annual pto allowance': 0.947, 'how much paid time off do employees get': 0.931, 'days off per year': 0.912 };

const contentStems = t => words(t).filter(w => !STOP.has(w)).map(stem).filter(w => !STOP.has(w));
function sameTopicSim(n, a, e) {
  if (e.intent === 'pto' && norm(e.question) === norm(INTENTS.pto.q) && TABLE_SIM[n] != null) return TABLE_SIM[n];
  if (a.multi) return between(n + '|mp|' + e.id, 0.712, 0.788);
  // word overlap with the closest stored phrasing: shared wording pulls vectors closer
  const qs = new Set(contentStems(n));
  let ov = 0;
  for (const p of [e.question, ...e.variants.map(v => v.q)]) {
    const es = new Set(contentStems(p)); const inter = [...qs].filter(w => es.has(w)).length;
    ov = Math.max(ov, inter / (new Set([...qs, ...es]).size || 1));
  }
  let s = 0.862 + 0.045 * a.coverage + 0.05 * ov + (a.strong >= 3 ? 0.006 : -0.012);
  s -= [0, 0.015, 0.06, 0.11][Math.min(3, a.gap.length)]; // uncovered salient words: one is tolerated, two or more push below τ
  if (a.content <= 2) s -= 0.018;             // terse: less signal in the vector
  if (a.words > 10) s -= (a.words - 10) * 0.009; // rambling: meaning is diluted
  s += between(n + '|' + norm(e.question), -0.012, 0.012);
  return clamp(s, a.gap.length ? 0.74 : 0.805, 0.968);
}
function neighbours(text, a) {
  const n = norm(text), qw = new Set(words(text).map(stem));
  return S.cache.map(e => {
    const phr = [e.question, ...e.variants.map(v => v.q)];
    const same = phr.find(p => norm(p) === n);
    let sim, label = e.question;
    if (same) { sim = 1; label = same; }
    else if (a.kind !== 'query') sim = between(n + '|' + e.id, 0.11, 0.33);
    else if (a.id && e.intent === a.id) {
      sim = sameTopicSim(n, a, e);
      if (!(e.intent === 'pto' && TABLE_SIM[n] != null)) {
        let bestOv = -1;
        for (const p of phr) { const ov = words(p).map(stem).filter(w => !STOP.has(w) && qw.has(w)).length; if (ov > bestOv) { bestOv = ov; label = p; } }
      }
    }
    else if (a.id) sim = related(a.id, e.intent) ? between(n + '|' + e.id, 0.64, 0.752) : between(n + '|' + e.id, 0.55, 0.69);
    else sim = between(n + '|' + e.id, 0.30, 0.52);
    return { e, sim: Math.round(sim * 1000) / 1000, label };
  }).sort((x, y) => y.sim - x.sim);
}

/* ================= State ================= */
const BASE_TAU = 0.88;
let S;
function freshState() {
  return {
    mode: 'semantic', tau: BASE_TAU, clusterTau: {}, cache: [], exact: new Set(), docs: DOCS.map(d => ({ ...d, done: true })),
    stats: { q: 0, hits: 0, lat: [], saved: 0 }, learn: { phr: 0, tau: 0, ref: 0 }, log: [], busy: false, msgSeq: 0, msgMeta: {},
    dyn: {}, dynVocab: {}, asked: new Set(),
  };
}
const I = id => INTENTS[id] || S.dyn[id];
function addEntry(intent, question, { hits = 0, silent = false, answer, sources } = {}) {
  const it = I(intent);
  const R = rng(hash(question + intent + S.cache.length));
  const e = { id: 'c' + (S.cache.length + 1), intent, question, pos: [it.center[0] + (R() - .5) * 8, it.center[1] + (R() - .5) * 8], hits, variants: [], stale: false, conf: 0.82, rev: 0, answer: answer || it.answer, sources: sources || it.sources };
  S.cache.push(e); S.exact.add(norm(question));
  if (!silent) flashEntry = { id: e.id, kind: 'new' };
  return e;
}
let flashEntry = null;

/* ================= DOM helpers ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
function md(text) {
  const blocks = esc(text).split(/\n\n+/);
  return blocks.map(b => {
    const lines = b.split('\n');
    const fmt = s => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    if (lines.every(l => l.startsWith('- '))) return '<ul>' + lines.map(l => `<li>${fmt(l.slice(2))}</li>`).join('') + '</ul>';
    if (lines.length > 1 && lines.slice(1).every(l => l.startsWith('- '))) return `<p>${fmt(lines[0])}</p><ul>` + lines.slice(1).map(l => `<li>${fmt(l.slice(2))}</li>`).join('') + '</ul>';
    return `<p>${fmt(lines.join('<br>'))}</p>`;
  }).join('');
}
const fmtMs = ms => ms >= 1000 ? (ms / 1000).toFixed(2) + ' s' : Math.round(ms) + ' ms';
const fmt$ = v => v < 1 ? '$' + v.toFixed(4) : '$' + v.toFixed(2);
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const trunc = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;
const docTitle = name => name.replace(/\.[a-z0-9]+$/i, '');
const fmtSize = b => b < 1024 ? b + ' B' : b < 1048576 ? Math.round(b / 1024) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
const liveDocs = () => S.docs.filter(d => !d.rejected);

/* ================= Rendering ================= */
function renderDocs() {
  $('docs').innerHTML = S.docs.map(d => `<li class="doc"${d.rejected ? ' style="opacity:.75"' : ''}>${icon('file')}<div style="min-width:0"><div class="doc-name" title="${esc(d.name)}"${d.rejected ? ' style="text-decoration:line-through"' : ''}>${esc(d.name)}</div><div class="doc-meta"${d.rejected ? ' style="color:var(--miss)"' : ''}>${esc(d.status || d.meta)}</div>${d.done ? '' : `<div class="doc-progress"><i style="width:${d.pct || 0}%"></i></div>`}</div></li>`).join('');
  $('doc-count').textContent = liveDocs().length;
}
function renderCache() {
  const list = [...S.cache].reverse();
  $('cache').innerHTML = list.length ? list.map(e => {
    const fl = flashEntry && flashEntry.id === e.id ? (flashEntry.kind === 'new' ? ' flash-new' : ' flash') : '';
    const tau = S.clusterTau[e.intent];
    return `<li class="centry${fl}" data-id="${e.id}"><div class="centry-q">${esc(e.question)}</div><div class="centry-meta"><span>${esc(I(e.intent).label)}</span><span>${1 + e.variants.length} phrasing${e.variants.length ? 's' : ''}</span><span>${e.hits} hit${e.hits === 1 ? '' : 's'}</span>${tau ? `<span class="mono">τ ${tau.toFixed(2)}</span>` : ''}${e.stale ? '<span class="stale">needs refresh</span>' : e.rev ? '<span>refreshed</span>' : ''}</div></li>`;
  }).join('') : '<li class="idle">Empty. Ask something to fill it.</li>';
  $('cache-count').textContent = S.cache.length;
  if (flashEntry) { const id = flashEntry.id; setTimeout(() => { const el = document.querySelector(`.centry[data-id="${id}"]`); if (el) el.classList.remove('flash', 'flash-new'); }, 1400); flashEntry = null; }
}
function renderStats() {
  const s = S.stats;
  $('s-q').textContent = s.q;
  $('s-hr').textContent = s.q ? Math.round(100 * s.hits / s.q) + '%' : '0%';
  $('s-lat').textContent = s.lat.length ? fmtMs(s.lat.reduce((a, b) => a + b, 0) / s.lat.length) : '–';
  $('s-save').textContent = s.saved ? '$' + s.saved.toFixed(3) : '$0';
  $('l-phr').textContent = S.learn.phr; $('l-tau').textContent = S.learn.tau; $('l-ref').textContent = S.learn.ref;
}
const KIND = { learn: ['pill-learn', 'Learned'], cache: ['pill-accent', 'Cached'], index: ['pill-muted', 'Indexed'], feedback: ['pill-learn', 'Feedback'], guard: ['pill-miss', 'Guard'], tau: ['pill-learn', 'τ tuned'], invalid: ['pill-miss', 'Invalidated'], reject: ['pill-miss', 'Rejected'] };
function logEvent(kind, text) { S.log.unshift({ t: now(), kind, text }); renderLog(); }
function renderLog() {
  $('log').innerHTML = S.log.length ? S.log.slice(0, 40).map(e => `<li><time>${e.t}</time><div><span class="pill ${KIND[e.kind][0]}">${KIND[e.kind][1]}</span>${e.text}</div></li>`).join('') : '<li class="idle" style="display:block">Events appear here as the cache learns.</li>';
}

/* --- embedding map --- */
function renderMap(q) {
  const svg = $('map');
  let h = '';
  for (let x = 20; x < 320; x += 40) h += `<line class="grid" x1="${x}" y1="0" x2="${x}" y2="220"/>`;
  for (let y = 20; y < 220; y += 40) h += `<line class="grid" x1="0" y1="${y}" x2="320" y2="${y}"/>`;
  const shown = new Set();
  for (const e of S.cache) {
    for (const v of e.variants) h += `<circle class="var" cx="${v.pos[0].toFixed(1)}" cy="${v.pos[1].toFixed(1)}" r="2.6"><title>${esc(v.q)}</title></circle>`;
    h += `<circle class="ent${e.stale ? ' stale' : ''}" cx="${e.pos[0].toFixed(1)}" cy="${e.pos[1].toFixed(1)}" r="4"><title>${esc(e.question)}</title></circle>`;
    if (!shown.has(e.intent)) { shown.add(e.intent); const c = I(e.intent).center; h += `<text x="${c[0]}" y="${c[1] - 10}" text-anchor="middle">${esc(I(e.intent).label)}</text>`; }
  }
  if (q) {
    if (q.ring) h += `<circle class="ring" cx="${q.ring[0]}" cy="${q.ring[1]}" r="${q.ring[2]}"/>`;
    if (q.to) h += `<line class="link" x1="${q.pos[0]}" y1="${q.pos[1]}" x2="${q.to[0]}" y2="${q.to[1]}" stroke-dasharray="${q.hit ? '0' : '3 2'}"/>`;
    const cls = q.hit ? 'q-hit' : 'q-miss';
    h += `<circle class="qpulse" cx="${q.pos[0]}" cy="${q.pos[1]}" r="5" style="stroke:var(--${q.hit ? 'hit' : 'miss'})"/>`;
    h += `<circle class="${cls}" cx="${q.pos[0]}" cy="${q.pos[1]}" r="4.6" stroke="var(--surface)" stroke-width="1.5"><title>${esc(q.text)}</title></circle>`;
  }
  if (!S.cache.length && !q) h += `<text x="160" y="112" text-anchor="middle">Cached questions will appear here, grouped by meaning</text>`;
  svg.innerHTML = h;
}

/* --- trace --- */
let traceEl;
function traceStart(text) { traceEl = $('trace'); traceEl.innerHTML = ''; $('trace-q').textContent = trunc('“' + text + '”', 34); }
function traceStep(title, cls = 'active') {
  const li = document.createElement('li'); li.className = 'step ' + cls;
  li.innerHTML = `<span class="step-dot"></span><div style="min-width:0"><div class="step-t"><span>${title}</span><span class="ms"></span></div><div class="step-d"></div></div>`;
  traceEl.appendChild(li);
  return {
    li,
    done(state = 'done', ms, detail) {
      li.className = 'step ' + state;
      li.querySelector('.step-dot').innerHTML = state === 'skipped' ? '' : icon('check');
      if (ms != null) li.querySelector('.ms').textContent = typeof ms === 'string' ? ms : fmtMs(ms);
      if (detail) li.querySelector('.step-d').innerHTML = detail;
    },
  };
}
function vecDetail(text) {
  const R = rng(hash('v' + norm(text)));
  const vals = Array.from({ length: 48 }, () => (R() - .5) * 0.36);
  const cells = vals.map(v => `<i style="background:var(--${v >= 0 ? 'accent' : 'miss'});opacity:${(0.15 + Math.min(1, Math.abs(v) / 0.18) * 0.85).toFixed(2)}"></i>`).join('');
  return `<span>Qwen3-Embedding-0.6B · 1024 dimensions</span><div class="vec">[${vals.slice(0, 6).map(v => (v >= 0 ? ' ' : '') + v.toFixed(3)).join(', ')}, … ]</div><div class="heat" aria-hidden="true">${cells}</div>`;
}
function nbrDetail(nbrs, tauFor) {
  if (!nbrs.length) return '<span>Cache is empty.</span>';
  return `<span>Nearest cached questions (cosine similarity)</span><div class="nbr">${nbrs.map(n => { const tau = tauFor(n.e); const ok = n.sim >= tau && !n.e.stale; return `<span class="nbr-q" title="${esc(n.label)}">${esc(n.label)}${n.e.stale ? (n.e.staleBy === 'upload' ? ' <span style="color:var(--accent)">(stale)</span>' : ' <span style="color:var(--miss)">(flagged)</span>') : ''}</span><span class="nbr-s" style="color:var(--${ok ? 'hit' : 'muted'})">${n.sim.toFixed(3)}</span><div class="bar"><i class="${ok ? 'ok' : ''}" style="width:${(n.sim * 100).toFixed(1)}%"></i><b style="left:${(tau * 100).toFixed(1)}%" title="threshold τ ${tau.toFixed(2)}"></b></div>`; }).join('')}</div>`;
}

/* --- chat --- */
// first view: put the last question's bubble at the top so the question and its cached answer show together
function bootScroll() {
  const m = $('msgs'), u = [...m.querySelectorAll('.msg-user')].pop();
  m.querySelectorAll('.boot-spacer').forEach(x => x.remove());
  if (!u) return scrollChat(true);
  const target = m.scrollTop + u.getBoundingClientRect().top - m.getBoundingClientRect().top - 16;
  const short = target - (m.scrollHeight - m.clientHeight);
  // if the chat is too short to bring the question to the top, pad it (removed on the next question)
  if (short > 0) { const sp = document.createElement('div'); sp.className = 'boot-spacer'; sp.setAttribute('aria-hidden', 'true'); sp.style.cssText = `flex:none;height:${Math.max(0, short - parseFloat(getComputedStyle(m).rowGap || 0))}px`; m.appendChild(sp); }
  m.scrollTo({ top: target, behavior: 'instant' });
}
function scrollChat(instant) { const m = $('msgs'); m.scrollTo({ top: m.scrollHeight, behavior: instant ? 'instant' : 'auto' }); }
function addUser(text) { $('msgs').querySelectorAll('.boot-spacer').forEach(x => x.remove()); const d = document.createElement('div'); d.className = 'msg-user'; d.textContent = text; $('msgs').appendChild(d); scrollChat(); }
function addBot() {
  const id = 'm' + (++S.msgSeq);
  const d = document.createElement('div'); d.className = 'msg-bot'; d.dataset.id = id;
  d.innerHTML = `<div class="bot-avatar" style="color:var(--accent)"><svg><use href="#i-mark"/></svg></div><div class="bot-body"><div class="bot-status"></div><div class="bot-text"></div><div class="sources"></div><div class="bot-actions" hidden></div></div>`;
  $('msgs').appendChild(d); scrollChat();
  return { id, el: d, status: d.querySelector('.bot-status'), text: d.querySelector('.bot-text'), sources: d.querySelector('.sources'), actions: d.querySelector('.bot-actions') };
}
const srcChip = ([doc, where]) => `<span class="src" title="${esc(doc + ' · ' + where)}">${icon('file')}<span>${esc(docTitle(doc))} · ${esc(where)}</span></span>`;

/* ================= Suggestions ================= */
let suggestions = [];
function setSuggestions(list, label = 'Try') {
  const m = $('msgs'), pinned = m.scrollHeight - m.scrollTop - m.clientHeight < 48;
  const seen = new Set();
  suggestions = list.filter(s => s && s.text && !S.asked.has(norm(s.text)) && !seen.has(norm(s.text)) && seen.add(norm(s.text)));
  $('suggest').innerHTML = `<span class="suggest-label">${label}</span>` + suggestions.map((s, i) => `<button type="button" class="chip" data-i="${i}" ${S.busy ? 'disabled' : ''}>${esc(s.text)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</button>`).join('');
  if (pinned) scrollChat();
}
// paraphrases of a topic not yet asked; with check, only those that clear the cluster's τ by 0.02
function freshPara(id, check) {
  const it = INTENTS[id]; if (!it) return [];
  return it.para.filter(p => {
    const k = norm(p);
    if (S.asked.has(k) || S.cache.some(e => norm(e.question) === k || e.variants.some(v => norm(v.q) === k))) return false;
    if (!check) return true;
    const top = neighbours(p, analyse(p))[0];
    return top && top.e.intent === id && !top.e.stale && top.sim >= tauFor(top.e) + 0.02;
  });
}
function defaultSuggestions() {
  const asked = new Set(S.cache.map(e => e.intent));
  const out = [];
  const fresh = ['pto', 'encrypt', 'remote', 'parental', 'expense', 'residency', 'cancel', 'trial', 'sick', 'incident'].filter(i => !asked.has(i) && !S.asked.has(norm(INTENTS[i].q)));
  if (fresh[0]) out.push({ text: INTENTS[fresh[0]].q, note: 'new' });
  const cached = S.cache.filter(e => !e.stale && INTENTS[e.intent]);
  for (let k = 0; k < cached.length; k++) { const e = cached[(S.stats.q + k) % cached.length]; const p = freshPara(e.intent, true)[0]; if (p) { out.push({ text: p, note: 'paraphrase' }); break; } }
  if (fresh[1]) out.push({ text: INTENTS[fresh[1]].q, note: 'new' });
  out.push(...["What's the weather in Paris?", 'Do you offer discounts for nonprofits?', 'Can I bring my dog to the office?'].filter(t => !S.asked.has(norm(t))).slice(0, 1).map(t => ({ text: t, note: t.includes('nonprofit') ? 'partial match' : 'off-topic' })));
  return out.slice(0, 4);
}

/* ================= Engine ================= */
const tauFor = e => S.clusterTau[e.intent] ?? S.tau;
const SMALL_TALK = [
  [/^(thanks|thank|thx|ty|cheers|many)/i, "You're welcome! Ask me anything else about Meridian's policies, security or plans."],
  [/^(bye|goodbye|see you)/i, 'Bye for now. Your cache will be here when you come back.'],
  [/^(ok|okay|cool|great|nice|awesome|perfect|got it)/i, 'Glad that helped. What else would you like to know?'],
  [/./, "Hi there! I can answer questions about Meridian's HR policies, refunds, security and Meridian Cloud plans. What would you like to know?"],
];

function uploadedFor(a, text) {
  const qw = new Set(words(text).map(stem));
  return S.docs.filter(d => d.uploaded && d.done && !d.rejected && ((a.id && d.intent === a.id) || d.kw.some(k => qw.has(k))))
    .map(d => { const kw = d.kw.find(k => qw.has(k)) || d.kw[0] || 'overview'; return { d, kw }; });
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function docChunk({ d, kw }, salt) { return [d.name, `§${1 + (hash(d.name + kw) % 6)} ${cap(kw)} · p.${2 + (hash(d.name + kw + 'p') % Math.max(2, Math.min(30, d.chunks)))}`, +between(d.name + salt, 0.86, 0.93).toFixed(2)]; }

async function ask(text, { instant = false } = {}) {
  text = text.trim();
  if (!text || S.busy) return;
  S.busy = true; setBusy(true);
  const wait = ms => instant ? Promise.resolve() : new Promise(r => setTimeout(r, ms));
  const n = norm(text);
  S.asked.add(n);
  const a = analyse(text);
  const nbrs = neighbours(text, a);
  const top = nbrs[0];
  const exactEntry = S.cache.find(e => norm(e.question) === n || e.variants.some(v => norm(v.q) === n));

  addUser(text);
  const bot = addBot();
  traceStart(text);

  // 1. embed
  bot.status.innerHTML = '<span class="spinner"></span>Embedding question…';
  const tEmbed = Math.round(between(n + 'e', 9, 17));
  let st = traceStep(S.mode === 'semantic' ? 'Embed question' : 'Embed question (semantic shadow lookup, for comparison)');
  await wait(380);
  st.done('done', tEmbed, vecDetail(text) + (S.mode === 'exact' ? '<span>Not used to answer. It only shows what the semantic cache would have done.</span>' : ''));

  // 2. cache search
  bot.status.innerHTML = `<span class="spinner"></span>Checking ${S.mode === 'semantic' ? 'semantic' : 'exact-match'} cache…`;
  const tSearch = Math.round(between(n + 's', 3, 8));
  st = traceStep(S.mode === 'semantic' ? 'Search semantic cache' : 'Exact-match lookup');
  await wait(420);
  const gapNote = a.id && a.gap.length && !a.multi ? `<span>Not covered by the “${esc(I(a.id).label)}” topic: ${a.gapRaw.map(w => '‘' + esc(w) + '’').join(', ')} (${a.gap.length === 1 ? '−0.015' : 'pushes similarity below τ'})</span>` : '';
  const multiNote = a.multi ? `<span style="color:var(--miss)">Multi-part question, sent to RAG${a.ids.length > 1 ? ` (${a.ids.map(id => esc(I(id).label)).join(' + ')})` : ''}. One cached answer would only cover part of it.</span>` : '';
  if (S.mode === 'semantic') {
    st.done('done', tSearch, nbrDetail(nbrs.slice(0, 3), tauFor) + multiNote + gapNote + (top && S.clusterTau[top.e.intent] ? `<span>Cluster “${esc(I(top.e.intent).label)}” uses a learned τ of ${tauFor(top.e).toFixed(2)}</span>` : ''));
  } else st.done('done', 1, `<span>Key: <span class="mono">sha1("${esc(trunc(n, 26))}")</span></span><span>${exactEntry ? 'Key found.' : 'No entry stored under this exact text.'}</span>`);

  if (a.kind === 'greet') return smallTalk(text, a, bot, nbrs, top, { wait, tEmbed, tSearch });

  // 3. decision
  let hit, bypass = false, entry = null, sim = top ? top.sim : 0;
  if (S.mode === 'semantic') {
    const reach = !!top && top.sim >= tauFor(top.e);
    hit = reach && !top.e.stale;
    bypass = !!top && top.e.stale && (reach || (a.id && top.e.intent === a.id && !a.multi && !a.gap.length));
    entry = top ? top.e : null;
  } else {
    hit = !!exactEntry && !exactEntry.stale; bypass = !!exactEntry && exactEntry.stale;
    entry = exactEntry; sim = exactEntry ? 1 : 0;
  }
  const exactWould = !!exactEntry && !exactEntry.stale;
  const semWould = !!top && top.sim >= tauFor(top.e) && !top.e.stale;
  st = traceStep('Decision');
  await wait(260);
  const semPill = semWould ? `<span class="pill pill-hit">Hit · ${top.sim.toFixed(3)}</span>` : top && top.e.stale && top.sim >= tauFor(top.e) ? (top.e.staleBy === 'upload' ? `<span class="pill pill-accent">Stale · ${top.sim.toFixed(3)}</span>` : `<span class="pill pill-learn">Bypassed · ${top.sim.toFixed(3)}</span>`) : `<span class="pill pill-miss">Miss${top ? ' · ' + top.sim.toFixed(3) : ''}</span>`;
  const compare = `<div class="compare"><div class="${S.mode === 'exact' ? 'on' : ''}"><strong>Exact-match cache</strong>${exactWould ? '<span class="pill pill-hit">Hit</span>' : '<span class="pill pill-miss">Miss</span>'}</div><div class="${S.mode === 'semantic' ? 'on' : ''}"><strong>Semantic cache</strong>${semPill}</div></div>`;
  let decisionNote = '';
  const staleBy = bypass ? (S.mode === 'semantic' ? top.e : entry).staleBy : null;
  const staleDoc = bypass ? (S.mode === 'semantic' ? top.e : entry).staleDoc : null;
  if (bypass && staleBy === 'upload') decisionNote = `<span>Source updated: <b>${esc(staleDoc)}</b> was indexed after “${esc(trunc(top ? top.label : entry.question, 34))}” was cached, so the answer is rebuilt from it.</span>`;
  else if (bypass) decisionNote = `<span>Closest entry “${esc(trunc(top ? top.label : entry.question, 40))}” is flagged for refresh, so it is bypassed and the answer is regenerated.</span>`;
  else if (a.id && a.gap.length && !a.multi && !hit) decisionNote = `<span>Weak match: the question asks about ${a.gapRaw.map(w => '‘' + esc(w) + '’').join(', ')}, which the closest topic does not cover. Sent to retrieval.</span>`;
  else if (a.multi) decisionNote = '<span>Multi-part question, sent to RAG so every part gets answered.</span>';
  else if (S.mode === 'exact' && !hit && semWould) decisionNote = `<span style="color:var(--hit)">Semantic lookup would have answered this from cache.</span>`;
  else if (S.mode === 'semantic' && hit && !exactWould) decisionNote = '<span>An exact-match cache would have missed this phrasing.</span>';
  else if (S.mode === 'semantic' && !hit && top && a.id && top.e.intent === a.id && top.sim < tauFor(top.e)) decisionNote = `<span>Same topic, but ${top.sim.toFixed(3)} is below τ ${tauFor(top.e).toFixed(2)}, so it is treated as a new question.</span>`;
  st.done(hit ? 'hit' : 'miss', hit ? 'HIT' : bypass ? (staleBy === 'upload' ? 'STALE' : 'BYPASS') : 'MISS', compare + decisionNote);

  // map query position
  const qpos = (() => {
    if (entry && (hit || (a.id && entry.intent === a.id))) {
      const ang = r01(n + 'a') * Math.PI * 2, d = Math.max(3, (1 - sim) * 220);
      return [entry.pos[0] + Math.cos(ang) * d, entry.pos[1] + Math.sin(ang) * d];
    }
    if (a.id) { const c = I(a.id).center; return [c[0] + between(n + 'x', -14, 14), c[1] + between(n + 'y', -14, 14)]; }
    return [between(n + 'x', 140, 190), between(n + 'y', 62, 96)];
  })().map(v => +Math.max(6, Math.min(314, v)).toFixed(1));
  const ringE = entry || (top && top.e);
  const qmap = { text, hit, pos: qpos, to: ringE ? ringE.pos.map(v => +v.toFixed(1)) : null, ring: ringE && S.mode === 'semantic' ? [ringE.pos[0].toFixed(1), ringE.pos[1].toFixed(1), ((1 - tauFor(ringE)) * 220).toFixed(1)] : null };
  renderMap(qmap);

  S.stats.q++;
  const learned = [];
  let latency;
  const meta = { hit, intent: entry && hit ? entry.intent : a.id, entryId: null };
  const stalePill = staleBy === 'upload' ? '<span class="pill pill-accent">Stale: source updated</span>' : '<span class="pill pill-learn">Bypassed: flagged for refresh</span>';
  const weak = !!a.id && a.gap.length > 0 && !a.multi;

  if (hit) {
    latency = tEmbed + tSearch + Math.round(between(n + 'h', 12, 30));
    bot.status.innerHTML = `<span class="pill pill-hit">${icon('bolt')} Cache hit</span><span class="mono">similarity ${sim.toFixed(3)} · ${fmtMs(latency)}</span>`;
    st = traceStep('Serve cached answer');
    const avoided = between(n + 'c', 0.0036, 0.0058);
    st.done('hit', latency, `<span>Retrieval and generation skipped. No tokens billed.</span><span>Saved ≈ <span class="mono">${fmt$(avoided)}</span> and ≈ <span class="mono">${fmtMs(between(n + 'g', 1500, 2300))}</span></span>`);
    await typeOut(bot.text, entry.answer, instant ? 0 : 4, 6);
    bot.sources.innerHTML = entry.sources.slice(0, 3).map(srcChip).join('');
    entry.hits++; S.stats.hits++; S.stats.saved += avoided; flashEntry = { id: entry.id, kind: 'hit' };
    meta.entryId = entry.id;
    if (S.mode === 'semantic' && sim < 1) {
      const R = rng(hash(n + 'vp'));
      const ang = R() * Math.PI * 2, d = 5 + R() * 7;
      entry.variants.push({ q: text, pos: [entry.pos[0] + Math.cos(ang) * d, entry.pos[1] + Math.sin(ang) * d] });
      S.exact.add(n); S.learn.phr++;
      learned.push(`Added “${esc(trunc(text, 40))}” to cluster <b>${esc(I(entry.intent).label)}</b> (${1 + entry.variants.length} phrasings)`);
      logEvent('learn', `New phrasing joined <b>${esc(I(entry.intent).label)}</b>: “${esc(trunc(text, 48))}”`);
    }
  } else {
    const missPill = bypass ? stalePill : '<span class="pill pill-miss">Cache miss</span>';
    // retrieval
    bot.status.innerHTML = `${missPill}<span class="spinner"></span>Searching ${liveDocs().length} documents…`;
    st = traceStep('Retrieve from documents');
    const tRet = Math.round(between(n + 'r', 38, 86));
    await wait(650);
    const ups = a.kind === 'query' ? uploadedFor(a, text) : [];
    let chunks;
    if (a.multi && a.ids.length > 1) chunks = a.ids.flatMap(id => I(id).sources.slice(0, 2));
    else if (a.id && weak) chunks = I(a.id).sources.slice(0, 2).map(([d, w, sc], i) => [d, w, +between(n + 'w' + i, 0.48, 0.6).toFixed(2)]);
    else if (a.id) {
      const base = I(a.id).sources;
      const lk = ups.find(u => u.d.intent === a.id && CHANGE[a.id]);
      const upChunk = lk ? [lk.d.name, `${CHANGE[a.id][0]} · p.${2 + (hash(lk.d.name) % Math.max(2, Math.min(12, lk.d.chunks)))}`, +Math.min(0.97, Math.max(0.93, base[0][2] + 0.01)).toFixed(2)] : ups[0] && !I(a.id).dyn ? docChunk(ups[0], n) : null;
      chunks = [...(upChunk ? [upChunk] : []), ...base].sort((x, y) => y[2] - x[2]).slice(0, 3);
    }
    else if (ups.length) chunks = [docChunk(ups[0], n), [ups[0].d.name, `§1 Overview · p.1`, +between(n + 'ov', 0.7, 0.79).toFixed(2)]];
    else chunks = [[liveDocs()[Math.floor(r01(n + 'd1') * liveDocs().length)].name, 'no relevant section', between(n + 'k1', 0.16, 0.33)], [liveDocs()[Math.floor(r01(n + 'd2') * liveDocs().length)].name, 'no relevant section', between(n + 'k2', 0.12, 0.26)]];
    const totalChunks = liveDocs().reduce((s, d) => s + (d.done ? d.chunks : 0), 0);
    st.done('done', tRet, `<span>Hybrid search over ${totalChunks.toLocaleString()} chunks, top ${chunks.length}</span>` + chunks.map(([d, w, s]) => `<div class="chunk"><b>${esc(d)}</b> · ${esc(w)} <span class="mono" style="float:right">${s.toFixed(2)}</span></div>`).join(''));

    // generation
    bot.status.innerHTML = `${missPill}<span class="spinner"></span>${bypass ? (staleBy === 'upload' ? 'Rebuilding answer from updated sources…' : 'Regenerating answer…') : 'Writing answer…'}`;
    st = traceStep(bypass ? (staleBy === 'upload' ? 'Rebuild answer from updated sources' : 'Regenerate answer with LLM') : 'Generate answer with LLM');
    const staleE = a.id && !a.multi && !weak ? S.cache.find(x => x.intent === a.id && x.stale) : null;
    let ans;
    if (a.multi && a.ids.length > 1) ans = `That's ${a.ids.length === 2 ? 'two questions' : 'several questions'} in one, so here is each part.\n\n` + a.ids.map(id => `**${I(id).label}**\n\n${I(id).answer}`).join('\n\n');
    else if (weak) {
      const it = I(a.id);
      ans = `I couldn't find anything about **${a.gapRaw.join(' or ')}** in your documents, so I won't guess.\n\nThe closest topic they do cover is **${it.label}**, in case it helps:\n\n${it.answer}`;
    } else if (a.id) {
      const it = I(a.id);
      const lk = ups.find(u => u.d.intent === a.id && CHANGE[a.id]);
      const fromUpload = staleE && staleE.staleBy === 'upload';
      ans = staleE && !fromUpload ? it.alt : it.answer;
      if (lk) {
        const [sec, change] = CHANGE[a.id], t = docTitle(lk.d.name), secNo = sec.split(' ')[0];
        ans = fromUpload ? `**Updated from ${t}:** per ${secNo}, ${change}.\n\n${ans}` : `${ans}\n\n**Also from ${t}** (${secNo}): ${change}.`;
      } else {
        const u = ups.find(x => !it.dyn && x.d.uploaded);
        if (u) ans += `\n\n**${docTitle(u.d.name)}** (uploaded) covers ${u.kw} as well; it matches the figures above.`;
      }
      if (staleE && staleE.rev >= 1) ans += '\n\nIf this still misses what you need, tell me a bit more about your situation and I will narrow it down.';
      if (a.multi) ans = 'That is a broad question, so I answered it from the source documents rather than reusing a cached answer.\n\n' + ans;
    } else if (ups.length) ans = docAnswer(docTitle(ups[0].d.name), ups[0].kw);
    else if (a.kind === 'gib') ans = "I couldn't make sense of that. Could you rephrase it as a question about Meridian's HR policies, refunds, security or plans?";
    else {
      const up = S.docs.filter(d => d.uploaded && d.done && !d.rejected);
      ans = "I couldn't find anything about that in your documents, so I won't guess.\n\n" + (up.length
        ? `I searched all ${liveDocs().length} indexed documents, including ${up.map(d => '**' + docTitle(d.name) + '**').join(', ')}, and none of them cover this topic.`
        : 'This workspace covers HR policies, refunds, security and Meridian Cloud plans. Upload a document on the topic and ask again.');
    }
    const grounded = a.id || ups.length;
    const tokens = Math.round(ans.length / 3.6 + (grounded ? 620 : 240));
    const tGen = Math.round(between(n + 'gen', 1350, 2250) * (grounded ? 1 : 0.6));
    await typeOut(bot.text, ans, instant ? 0 : 26, 1);
    const cost = tokens * 0.0000036;
    st.done('done', tGen, `<span><span class="mono">${tokens.toLocaleString()}</span> tokens · <span class="mono">${fmt$(cost)}</span></span>`);
    latency = tEmbed + tSearch + tRet + tGen;
    bot.status.innerHTML = bypass
      ? `${stalePill}<span class="mono">${staleBy === 'upload' ? 'rebuilt from ' + esc(trunc(docTitle(staleDoc || ''), 24)) : 'regenerated'} · ${fmtMs(latency)}</span>`
      : `<span class="pill pill-miss">Cache miss</span><span class="mono">${top ? 'nearest ' + top.sim.toFixed(3) + ' · ' : ''}${fmtMs(latency)}</span>`;
    if (a.id || ups.length) bot.sources.innerHTML = chunks.map(srcChip).join('');

    // write back
    st = traceStep('Write to cache');
    await wait(220);
    if (a.multi) {
      st.done('skipped', 'skipped', '<span>Not cached: long or multi-part questions are answered fresh, so a broad answer is never reused for a narrow question.</span>');
      learned.push('Multi-part question routed to RAG and kept out of the cache');
      logEvent('guard', `Multi-part question sent to RAG, not cached: “${esc(trunc(text, 40))}”`);
    } else if (weak) {
      st.done('skipped', 'skipped', `<span>Not cached: weakly grounded. ${a.gapRaw.map(w => '‘' + esc(w) + '’').join(', ')} appears in no retrieved chunk (best ${chunks[0][2].toFixed(2)}), so this answer is never reused.</span>`);
      learned.push('Grounding guard kept a partial match out of the cache');
      logEvent('guard', `Kept “${esc(trunc(text, 40))}” out of the cache (topic only partly covered)`);
    } else if (a.id) {
      let e = staleE;
      if (e) {
        const wasUpload = e.staleBy === 'upload';
        e.stale = false; e.rev++; e.answer = ans; e.sources = chunks; e.staleBy = null;
        const usedDoc = e.staleDoc; e.staleDoc = null;
        if (norm(e.question) !== n && !e.variants.some(v => norm(v.q) === n)) { e.variants.push({ q: text, pos: [e.pos[0] + between(n + 'px', -8, 8), e.pos[1] + between(n + 'py', -8, 8)] }); S.exact.add(n); }
        flashEntry = { id: e.id, kind: 'new' };
        st.done('done', '4 ms', wasUpload ? `<span>Replaced the stale answer for “${esc(I(e.intent).label)}” with one built from ${esc(usedDoc || 'the new source')}.</span>` : `<span>Replaced the flagged answer for “${esc(I(e.intent).label)}” with the regenerated one.</span>`);
        if (wasUpload) {
          learned.push(`Answer for <b>${esc(I(e.intent).label)}</b> rebuilt from <b>${esc(trunc(docTitle(usedDoc || ''), 30))}</b>`);
          logEvent('learn', `Rebuilt <b>${esc(I(e.intent).label)}</b> answer from <b>${esc(trunc(docTitle(usedDoc || ''), 30))}</b>`);
        } else {
          S.learn.ref++;
          const old = S.clusterTau[e.intent] ?? S.tau;
          const had = S.clusterTau[e.intent] != null;
          learned.push(`Answer for <b>${esc(I(e.intent).label)}</b> regenerated${had ? `; τ relaxed ${old.toFixed(2)} → ${S.tau.toFixed(2)} (global)` : ''}`);
          logEvent('learn', `Refreshed <b>${esc(I(e.intent).label)}</b> answer after negative feedback`);
          if (had) { delete S.clusterTau[e.intent]; S.learn.tau++; logEvent('tau', `<b>${esc(I(e.intent).label)}</b> τ ${old.toFixed(2)} → ${S.tau.toFixed(2)}, back to the global threshold`); }
        }
      } else if (S.mode === 'exact' && S.cache.some(x => x.intent === a.id)) {
        e = S.cache.find(x => x.intent === a.id);
        e.variants.push({ q: text, pos: [e.pos[0] + between(n + 'px', -9, 9), e.pos[1] + between(n + 'py', -9, 9)] });
        S.exact.add(n);
        st.done('done', '3 ms', '<span>Stored under a new exact key. The same answer is now cached twice.</span>');
        logEvent('cache', `Duplicate answer stored for <b>${esc(I(e.intent).label)}</b> (exact-match mode)`);
      } else {
        const near = top && top.e.intent === a.id ? top : null;
        e = addEntry(a.id, text, { answer: ans, sources: chunks });
        st.done('done', '3 ms', near ? `<span>Stored as a new entry beside “${esc(trunc(near.label, 36))}” (${near.sim.toFixed(3)} was below τ ${tauFor(near.e).toFixed(2)}).</span>` : `<span>Stored vector, answer and ${chunks.length} source fingerprints as a new cluster.</span>`);
        logEvent('cache', near ? `New entry in <b>${esc(I(a.id).label)}</b>: “${esc(trunc(text, 44))}”` : `New cluster <b>${esc(I(a.id).label)}</b>: “${esc(trunc(text, 44))}”`);
      }
      meta.entryId = e.id;
    } else if (ups.length) {
      st.done('skipped', 'skipped', `<span>Not cached yet: the answer rests on one newly uploaded document (${esc(trunc(docTitle(ups[0].d.name), 30))}). It is kept out until more questions confirm the topic.</span>`);
      learned.push(`Grounded in <b>${esc(trunc(docTitle(ups[0].d.name), 30))}</b>; watching for repeat questions before caching`);
    } else {
      st.done('skipped', 'skipped', `<span>Not cached: ${a.kind === 'gib' ? 'the question could not be understood' : 'retrieval support too weak'} (max chunk score below 0.40).</span>`);
      learned.push('Grounding guard kept a low-confidence answer out of the cache');
      logEvent('guard', `Kept “${esc(trunc(text, 40))}” out of the cache (weak grounding)`);
    }
  }

  // learning step
  st = traceStep('Self-learning layer');
  await wait(160);
  st.done(learned.length ? 'learn' : 'done', null, learned.length ? learned.map(l => `<span>${l}</span>`).join('') : '<span>No change. Feedback on this answer will tune its cluster.</span>');

  S.stats.lat.push(latency);
  S.msgMeta[bot.id] = meta;
  bot.actions.hidden = false;
  bot.actions.innerHTML = `<button type="button" class="iconbtn" data-fb="up" data-m="${bot.id}" aria-pressed="false" title="Good answer" aria-label="Good answer">${icon('up')}</button><button type="button" class="iconbtn" data-fb="down" data-m="${bot.id}" aria-pressed="false" title="Bad answer" aria-label="Bad answer">${icon('down')}</button><span class="note"></span>`;
  renderCache(); renderStats(); renderMap(qmap);
  S.busy = false; setBusy(false);
  if (a.id && INTENTS[a.id] && !hit && !a.multi && !weak) {
    const p = weak ? [] : freshPara(a.id, true);
    setSuggestions([...p.slice(0, 2).map(t => ({ text: t, note: 'same meaning' })), ...defaultSuggestions().filter(s => s.note !== 'paraphrase').slice(0, 2)], 'Now rephrase it');
  } else setSuggestions(defaultSuggestions());
  scrollChat();
}

async function smallTalk(text, a, bot, nbrs, top, { wait, tEmbed, tSearch }) {
  let st = traceStep('Intent check');
  await wait(200);
  st.done('done', '1 ms', `<span>Small talk detected${top ? ` (nearest cached question only ${top.sim.toFixed(3)})` : ''}. No retrieval and no LLM call needed.</span>`);
  const reply = SMALL_TALK.find(([re]) => re.test(text.trim()))[1];
  st = traceStep('Reply from template');
  const latency = tEmbed + tSearch + 2;
  st.done('done', '2 ms', '<span><span class="mono">0</span> tokens · <span class="mono">$0</span></span>');
  await typeOut(bot.text, reply, 0);
  bot.status.innerHTML = `<span class="pill pill-muted">Small talk</span><span class="mono">0 tokens · ${fmtMs(latency)}</span>`;
  st = traceStep('Write to cache');
  st.done('skipped', 'skipped', '<span>Small talk is never cached, so it cannot crowd out real answers.</span>');
  renderMap({ text, hit: false, pos: [between(norm(text) + 'x', 20, 60), between(norm(text) + 'y', 190, 210)].map(v => +v.toFixed(1)), to: null, ring: null });
  S.busy = false; setBusy(false);
  setSuggestions(defaultSuggestions());
  scrollChat();
}

async function typeOut(el, text, delay, perTick) {
  if (!delay) { el.innerHTML = md(text); return; }
  const words = text.split(/(\s+)/);
  let i = 0;
  while (i < words.length) {
    i = Math.min(words.length, i + perTick * 2);
    let part = words.slice(0, i).join('');
    if ((part.match(/\*\*/g) || []).length % 2) part += '**';
    el.innerHTML = md(part);
    const last = el.lastElementChild && (el.lastElementChild.tagName === 'UL' ? el.lastElementChild.lastElementChild : el.lastElementChild);
    if (last) last.insertAdjacentHTML('beforeend', '<span class="caret"></span>');
    scrollChat();
    await new Promise(r => setTimeout(r, delay));
  }
  el.innerHTML = md(text);
}

function feedback(mid, kind, btn) {
  const meta = S.msgMeta[mid]; if (!meta) return;
  const wrap = btn.parentElement;
  if (wrap.dataset.done) return; wrap.dataset.done = '1';
  btn.setAttribute('aria-pressed', 'true');
  wrap.querySelectorAll('button').forEach(b => b.disabled = true);
  const note = wrap.querySelector('.note');
  const e = S.cache.find(x => x.id === meta.entryId);
  const label = meta.intent && I(meta.intent) ? I(meta.intent).label : 'this topic';
  if (kind === 'up') {
    if (e) { const old = e.conf; e.conf = Math.min(0.99, e.conf + 0.05); note.textContent = `Reinforced “${label}”`; logEvent('feedback', `Thumbs up on <b>${esc(label)}</b>, confidence ${old.toFixed(2)} → ${e.conf.toFixed(2)}`); }
    else { note.textContent = 'Thanks, noted'; logEvent('feedback', 'Thumbs up recorded for retrieval tuning'); }
  } else {
    if (e && meta.hit) {
      e.stale = true; e.staleBy = 'feedback'; const old = S.clusterTau[e.intent] ?? S.tau; S.clusterTau[e.intent] = 0.95; S.learn.tau++;
      note.textContent = `Flagged. “${label}” will be regenerated next time`;
      logEvent('feedback', `Thumbs down on cached <b>${esc(label)}</b> answer, marked for refresh`);
      logEvent('tau', `<b>${esc(label)}</b> τ ${old.toFixed(2)} → 0.95`);
      const it = I(e.intent);
      setSuggestions([{ text: freshPara(e.intent)[0], note: 'ask again' }, ...defaultSuggestions().slice(0, 2)], 'See the effect');
    } else if (e) {
      e.stale = true; e.staleBy = 'feedback'; note.textContent = 'Flagged. The answer will be regenerated next time';
      logEvent('feedback', `Thumbs down on <b>${esc(label)}</b>, answer marked for refresh`);
    } else { note.textContent = 'Noted for retrieval tuning'; logEvent('feedback', 'Thumbs down recorded, retrieval ranking weights adjusted'); }
  }
  renderCache(); renderStats(); renderMap();
}

/* ================= Uploads ================= */
function fileKeywords(name) {
  return [...new Set(words(docTitle(name).replace(/[_.]/g, ' ')).map(stem).filter(w => w.length > 2 && !STOP.has(w) && !FILE_NOISE.has(w) && !/^\d+$/.test(w) && !/^v\d+$/.test(w)))];
}
const DYN_SPOTS = [[150, 130], [30, 200], [300, 200], [180, 20], [140, 100], [300, 20]];
function docAnswer(title, kw, alt) {
  const sec = cap(kw);
  return alt
    ? `**${title}** is the document that governs this. Its ${sec} section lists the requirements, the approvals needed and any limits that apply.\n\n- Check the eligibility rules at the start of that section\n- Get sign-off before you commit to anything outside the stated limits\n- Questions the document does not answer go to the team that owns it\n\nFor exact numbers, the document itself is the source of truth.`
    : `According to **${title}**, this is covered in its ${sec} section. In short, the document sets out who it applies to, the steps to follow and who has to sign off.\n\n- Follow the process and limits exactly as the document states them\n- Keep any confirmations or receipts it asks for\n- Exceptions need approval from your manager\n\nThis summary stays general; open the document for the exact figures and dates.`;
}
function makeDynTopic(d) {
  const k = Object.keys(S.dyn).length, id = 'doc' + (k + 1), title = docTitle(d.name);
  const kws = d.kw;
  S.dynVocab[id] = kws.map(w => [w, 3]);
  const sec = cap(kws[0]);
  S.dyn[id] = {
    dyn: true, label: trunc(title, 20), center: DYN_SPOTS[k % DYN_SPOTS.length], q: title, para: [],
    answer: docAnswer(title, kws[0]),
    alt: docAnswer(title, kws[0], true),
    sources: [[d.name, `§1 ${sec} · p.1`, 0.86], [d.name, `§2 Requirements · p.${Math.min(3, d.chunks + 1)}`, 0.78]],
  };
  d.dynId = id;
  return id;
}
function upload(files) {
  const st = S;
  for (const f of files) {
    const ext = ((f.name.match(/\.([a-z0-9]+)$/i) || [])[1] || '').toLowerCase();
    if (!OK_EXT.includes(ext)) {
      S.docs.push({ name: f.name, rejected: true, done: true, chunks: 0, kw: [], status: `Rejected: ${ext ? '.' + ext : 'this'} files are not supported`, meta: '' });
      logEvent('reject', `<b>${esc(trunc(f.name, 32))}</b> not indexed: only PDF, DOCX, MD, TXT, HTML and CSV are supported`);
      renderDocs();
      continue;
    }
    const chunks = Math.max(1, Math.round(f.size / 2048));
    const d = { name: f.name, chunks, uploaded: true, kw: fileKeywords(f.name), meta: `${fmtSize(f.size)} · ${chunks} chunk${chunks === 1 ? '' : 's'}`, status: 'Parsing…', pct: 8, done: false };
    S.docs.push(d); renderDocs();
    const steps = [[`Chunking (512 tokens, 64 overlap)…`, 30], [`Embedding ${chunks} chunk${chunks === 1 ? '' : 's'} with Qwen3-Embedding…`, 70], ['Indexed', 100]];
    steps.forEach(([s, p], i) => setTimeout(() => {
      if (S !== st) return;
      d.status = s; d.pct = p;
      if (p === 100) {
        d.done = true; d.status = null;
        const topic = analyse(docTitle(d.name).replace(/[_]/g, ' '));
        if (topic.id && INTENTS[topic.id]) d.intent = topic.id;
        else if (d.kw.length) makeDynTopic(d);
        const checked = S.cache.length;
        const hitEntries = d.intent ? S.cache.filter(e => e.intent === d.intent && !e.stale) : [];
        logEvent('index', `<b>${esc(trunc(f.name, 32))}</b> indexed: ${chunks} chunk${chunks === 1 ? '' : 's'}. Re-checked ${checked} cached answer${checked === 1 ? '' : 's'} against new sources, ${hitEntries.length} invalidated`);
        if (hitEntries.length) {
          for (const e of hitEntries) { e.stale = true; e.staleBy = 'upload'; e.staleDoc = d.name; }
          S.learn.ref += hitEntries.length;
          flashEntry = { id: hitEntries[0].id, kind: 'hit' };
          logEvent('invalid', `<b>${esc(INTENTS[d.intent].label)}</b> invalidated: newer source <b>${esc(trunc(docTitle(d.name), 28))}</b>. The answer will be rebuilt on the next ask`);
          renderCache(); renderStats(); renderMap();
          if (!S.busy) setSuggestions([{ text: freshPara(d.intent)[0], note: 'ask again' }, ...defaultSuggestions().slice(0, 2)], 'See the effect');
        }
      }
      renderDocs();
    }, 700 * (i + 1) + 300));
  }
}

/* ================= Wiring ================= */
function setBusy(b) {
  $('send').disabled = b || !$('q').value.trim();
  $('reset').disabled = b;
  $('reset').title = b ? 'Available when the current answer finishes' : 'Reset the playground';
  document.querySelectorAll('#suggest .chip').forEach(c => c.disabled = b);
}
function boot() {
  S = freshState();
  $('msgs').innerHTML = `<div class="msg-bot"><div class="bot-avatar" style="color:var(--accent)"><svg><use href="#i-mark"/></svg></div><div class="bot-body"><div class="bot-text"><p>Hi! I answer questions from Meridian's ${DOCS.length} documents. Watch the panel on the right: new questions are answered by the RAG pipeline and cached, and <strong>questions with the same meaning</strong> come straight from the cache, even when the wording is different.</p></div></div></div>`;
  $('log').innerHTML = '';
  $('mode-sem').setAttribute('aria-pressed', 'true'); $('mode-exact').setAttribute('aria-pressed', 'false');
  $('tau').value = BASE_TAU; $('tau-out').textContent = BASE_TAU.toFixed(2);
  addEntry('sso', INTENTS.sso.q, { hits: 3, silent: true });
  addEntry('price', INTENTS.price.q, { hits: 5, silent: true });
  renderDocs(); renderCache(); renderStats(); renderLog(); renderMap();
  logEvent('cache', '2 answers carried over from earlier sessions');
  // pre-run a miss and a semantic hit so the first view shows the product working
  return ask(INTENTS.refund.q, { instant: true }).then(() => ask('How long do I have to get my money back?', { instant: true })).then(() => { setSuggestions(defaultSuggestions()); bootScroll(); requestAnimationFrame(bootScroll); });
}

$('attach').setAttribute('aria-label', 'Upload documents');
$('reset').setAttribute('aria-label', 'Reset the playground');
$('composer').addEventListener('submit', e => { e.preventDefault(); if (S.busy) return; const v = $('q').value; $('q').value = ''; autosize(); ask(v); });
$('q').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('composer').requestSubmit(); } });
function autosize() { const t = $('q'); t.style.height = 'auto'; t.style.height = Math.min(160, t.scrollHeight) + 'px'; $('send').disabled = S.busy || !t.value.trim(); }
$('q').addEventListener('input', autosize);
$('suggest').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b && !S.busy && suggestions[+b.dataset.i]) ask(suggestions[+b.dataset.i].text); });
$('msgs').addEventListener('click', e => { const b = e.target.closest('[data-fb]'); if (b) feedback(b.dataset.m, b.dataset.fb, b); });
$('mode-sem').addEventListener('click', () => setMode('semantic'));
$('mode-exact').addEventListener('click', () => setMode('exact'));
function setMode(m) {
  if (S.mode === m) return;
  S.mode = m;
  $('mode-sem').setAttribute('aria-pressed', String(m === 'semantic')); $('mode-exact').setAttribute('aria-pressed', String(m === 'exact'));
  logEvent('index', m === 'exact' ? 'Switched to <b>exact-match</b> lookup for comparison' : 'Switched back to <b>semantic</b> lookup');
  if (S.busy) return;
  if (m === 'exact') {
    const e = S.cache.find(x => !x.stale && INTENTS[x.intent]);
    if (e) setSuggestions([{ text: freshPara(e.intent)[0], note: 'paraphrase' }, { text: e.question, note: 'identical' }, ...defaultSuggestions().slice(0, 1)], 'Compare');
  } else setSuggestions(defaultSuggestions());
}
$('tau').addEventListener('input', e => { S.tau = +e.target.value; $('tau-out').textContent = S.tau.toFixed(2); });
$('tau').addEventListener('change', () => logEvent('tau', `Global τ set to ${S.tau.toFixed(2)}`));
$('reset').addEventListener('click', () => { if (!S.busy) boot(); });
$('attach').addEventListener('click', () => $('file').click());
$('drop').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', e => { upload([...e.target.files]); e.target.value = ''; });
const side = document.querySelector('.side');
['dragenter', 'dragover'].forEach(ev => side.addEventListener(ev, e => { e.preventDefault(); $('drop').classList.add('drag'); }));
['dragleave', 'drop'].forEach(ev => side.addEventListener(ev, e => { e.preventDefault(); if (ev === 'drop' || !side.contains(e.relatedTarget)) $('drop').classList.remove('drag'); }));
side.addEventListener('drop', e => { if (e.dataTransfer && e.dataTransfer.files.length) upload([...e.dataTransfer.files]); });

/* ================= Economics calculator ================= */
const VOLS = [50e3, 100e3, 250e3, 500e3, 1e6, 2.5e6, 5e6, 10e6, 25e6];
function calc() {
  const vol = VOLS[+$('c-vol').value], hr = +$('c-hr').value / 100, cost = +$('c-cost').value * 0.0005;
  $('c-vol-out').textContent = vol.toLocaleString('en-US');
  $('c-hr-out').textContent = Math.round(hr * 100) + '%';
  $('c-cost-out').textContent = '$' + cost.toFixed(4);
  const avoided = vol * hr;
  $('c-calls').textContent = Math.round(avoided).toLocaleString('en-US');
  $('c-save').textContent = '$' + Math.round(avoided * cost).toLocaleString('en-US');
  $('c-lat').textContent = (hr * 0.04 + (1 - hr) * 1.9).toFixed(2) + ' s';
  $('c-wait').textContent = Math.round(avoided * (1.9 - 0.04) / 3600).toLocaleString('en-US') + ' h';
}
['c-vol', 'c-hr', 'c-cost'].forEach(id => $(id).addEventListener('input', calc));
calc();

boot();
const settle = () => { if (S.stats.q <= 2) bootScroll(); };
window.addEventListener('load', settle);
if (document.fonts) document.fonts.ready.then(settle);
})();
