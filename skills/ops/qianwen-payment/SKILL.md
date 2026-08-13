---
name: qianwen-payment
description: "Payment center for account funds. Use for: check account balance, recharge / top-up entry. Skip for: usage/billing queries (use qianwen-usage), model tasks."
---

# QianWen Payment

Check account balance and open the official recharge page via the QianWen CLI.

## Security Boundary

> [!CAUTION]
> This skill NEVER completes any fund operation inside the conversation. Recharge is only completed by the user on the official page opened by the CLI.
>
> **Before running `qianwen billing balance recharge`**, you MUST, in order:
> 1. Show the user their current balance (`qianwen billing balance summary --format json`)
> 2. Explain that the recharge command will **attempt to open the official recharge page in the browser, and will return a link to that page**
> 3. Obtain the user's explicit confirmation (report result status as `confirmation_required` until confirmed)
>
> The command attempts to open the browser the moment it runs — asking after execution is too late. (In sandboxed/headless hosts the browser may not open; the returned `rechargeUrl` is the reliable fallback — see Recharge entry below.)

**NEVER:**

- ❌ Run `qianwen billing balance recharge` before the user explicitly confirms — NEVER execute first and ask afterwards
- ❌ Perform, simulate, or promise any payment, transfer, or fund operation in the conversation
- ❌ Judge that the balance is "insufficient" or proactively suggest recharging — only display the balance as-is
- ❌ Construct, guess, or rewrite any recharge URL — only use the `rechargeUrl` returned by the CLI

## Prerequisites

- **QianWen CLI >= 1.3.0** is required. Verify with:

```bash
qianwen version
```

If the installed version is below 1.3.0, do NOT call the missing billing commands. Explain that the payment commands require CLI >= 1.3.0 and wait for the user to confirm the upgrade before proceeding.

If not installed, run:

```bash
npm install -g @qianwenai/qianwen-cli
```

Node.js >= 18 required.

### Authentication

This skill authenticates through the CLI login session (OAuth device flow). It does NOT need — and MUST NOT be given — any API key configuration.

TL;DR — 3-step auth path:

1. `qianwen auth status --format json` → `authenticated: true` → skip to commands
2. `qianwen auth login --init-only --format json` → extract `verification_url` → open in browser
3. `qianwen auth login --complete --format json` → poll until `success` event

For the full authentication flow (event structure, non-TTY handling, pitfalls), see the **qianwen-usage** skill.

## Commands

All commands must be run with an explicit `--format json` and their JSON output parsed.

### Check balance

**`qianwen billing balance summary`** — Show available account balance

```bash
qianwen billing balance summary --format json
```

JSON structure:

```json
{
  "availableAmount": "1234.56",
  "currency": "CNY"
}
```

Present the balance to the user as a formatted amount with its currency (e.g. `¥1,234.56` for CNY) — this mirrors the CLI's own `displayAmount` rendering in table/text mode. Do not show the raw JSON.

### Recharge entry (confirmation required)

**`qianwen billing balance recharge`** — Open the official recharge page in the browser

Only run this AFTER completing the Security Boundary confirmation steps above.

```bash
qianwen billing balance recharge --format json
```

JSON structure:

```json
{
  "rechargeUrl": "https://platform.qianwenai.com/home/billing/overview?target=recharge",
  "opened": true,
  "message": "Recharge page opened in browser"
}
```

**Always surface `rechargeUrl` to the user — regardless of `opened`.** The `opened` flag reflects whether the CLI's browser-launch command returned successfully, but a successful launch does not guarantee a browser window actually appeared. In sandboxed or headless hosts (e.g. the **Codex desktop app**, remote containers, CI) the browser often cannot open even when `opened` is reported as `true`. So never rely on `opened` alone to decide whether to give the user the link.

Parse `opened`, but present the link in both cases:

- `true` → tell the user the official recharge page has been opened in their browser, **and still include the `rechargeUrl`** with a note like "if it didn't open automatically, use this link".
- `false` → tell the user the browser could not be opened automatically, and show the `rechargeUrl` so they can open it manually.

In every case, show the `rechargeUrl` exactly as returned by the CLI (never construct or rewrite it). The recharge itself happens entirely on that official page; this skill's job ends once the entry — including the copyable link — is presented.

## Output and Agent Display Rules

**JSON is the primary output mode for agents** — always pass `--format json` explicitly, parse the structured response, then present a human-readable summary to the user.

**When using `--format json` (recommended for agents):**

1. **Parse the JSON** and extract the relevant data for the user's question
2. **Present a human-readable summary** — do not dump raw JSON to the user
3. **Add analysis AFTER the summary** — clearly separated with `---`

**When using `--format text`:**

1. **Display CLI output EXACTLY AS-IS** — no modification, no reformatting
2. **Preserve all formatting** — alignment, spacing, separators
3. **Add analysis AFTER output only** — clearly separated with `---`

Never parse `table` format programmatically — it contains ANSI codes and Unicode borders.

**NEVER:**

- ❌ Dump raw JSON to the user without interpretation
- ❌ Reformat or summarize text/table output
- ❌ Add prefixes like "Here's your balance:"
- ❌ Convert text/table output to bullet points
- ❌ Fabricate or mock values to fill in missing real results

### Result status mapping

Report every operation with exactly one of these statuses:

| Status                  | When                                                                     |
|-------------------------|--------------------------------------------------------------------------|
| `success`               | Command succeeded and full data was parsed                               |
| `partial`               | Command succeeded but some fields are missing/`null`                     |
| `empty`                 | Command succeeded but there is no data to show                            |
| `confirmation_required` | Recharge requested but user confirmation not yet obtained                |
| `error`                 | Command failed (see Error Handling below)                                |

Never substitute mock data for a real result under any status.

## Error Handling / Exit Codes

| Code | Meaning              |
|------|----------------------|
| 0    | Success              |
| 1    | General/usage error  |
| 2    | Authentication error |
| 3    | Network error        |
| 4    | Configuration error  |
| 130  | Interrupted          |

- On a non-zero exit code, still attempt to parse any structured output on stdout first — it may contain a usable error payload or partial result.
- On exit code 2 (authentication error): guide the user through the auth flow (see Prerequisites), then retry the original task **at most once**. NEVER loop login attempts.

## Regional Note

This skill targets the QianWen China site (`platform.qianwenai.com`) only. For the international site, use the **qwencloud-payment** skill instead. This skill does not include any international-site-specific commands such as `payment-method` or `bind`.
