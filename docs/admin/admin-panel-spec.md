# CabukUlas Admin Panel Specification

## Purpose
The admin surface should operate as a controlled publishing system, not a raw CRUD interface. Its job is to keep company contact data accurate, trustworthy, reviewable, and safe to publish to the public mobile app.

## Recommended Delivery
- Primary surface: web-based admin panel
- Recommended audience: editorial, reviewer, admin, operations, support
- Recommended structure: auth-gated internal app backed by Supabase Auth, role-aware RLS, and auditable write actions

## Role Model
### Super Admin
- Manages roles and system-level configuration
- Can publish, archive, rollback, and manage sponsorship settings

### Admin
- Full content management across companies, categories, channels, and placements
- Can approve and publish

### Editor
- Creates and edits draft content
- Cannot directly publish to the public app

### Reviewer
- Reviews submissions, checks diffs, approves or rejects changes

### Analyst / Support
- Reads dashboards, reports, and operational health
- Cannot change published content

## Core Modules
### 1. Dashboard
- Pending review count
- Items needing verification
- Broken source links
- Recently updated companies
- Expiring sponsored placements
- Searches with no result

### 2. Companies
- Table view with search, filters, status, category, freshness, verification status
- Detail editor with profile basics, aliases, description, website, cargo tracking, notes
- Right-side or split preview showing mobile-facing output

### 3. Categories
- Create, edit, reorder, archive
- Track category coverage and number of companies

### 4. Contact Channels
- Manage channel type, label, value, sort order, recommended flag
- Attach source URL, verification state, last checked state, and structured hours
- Enforce single recommended channel per company

### 5. Review Queue
- Field-level diff view
- Reviewer comments
- Approve, reject, or request changes
- Queue sorting by urgency, freshness, and impact

### 6. Featured / Sponsored Placements
- Configure placement type, screen, position, start/end dates
- Add rotation, priority, and campaign status

### 7. Audit Log
- Who changed what
- Before/after values
- Reason field
- Rollback action visibility

### 8. Data Health
- Missing fastest channel
- Multiple fastest channels
- Missing source URLs
- Broken links
- Stale records
- Invalid hours

### 9. Reports
- Incorrect info submissions from public app
- Review state, resolution notes, and impact tracking

## Publishing Workflow
1. Editor creates or updates a record in `draft`.
2. Editor submits the change to `in_review`.
3. Reviewer sees a structured diff and validation summary.
4. Reviewer approves or rejects.
5. Approved content is published manually or via scheduled publish.
6. Published content becomes available to the public projection/view consumed by the app.

## Status Model
- `draft`
- `in_review`
- `approved`
- `published`
- `rejected`
- `archived`
- `needs_verification`

## Safety Requirements
- No direct production edits without audit metadata.
- All publish and rollback operations must be logged.
- Destructive actions should default to archive, not hard delete.
- Bulk operations must support preview and confirmation.

## Data Quality Rules
- Unique company slug
- Unique `company_id + channel_type + value`
- One recommended channel per company
- Valid URL, phone, and email formats
- Working-hours completeness checks before publish
- Source attribution required for high-trust channels

## Reviewer Tooling
- Diff-by-field comparisons
- Confidence indicators for automated suggestions
- "Why changed" notes
- Last verification timestamp
- Link-open and validation helpers

## Automation Policy
- Automated updates must enter the system as suggestions, never as direct publish actions.
- Every suggestion should carry source attribution, fetched timestamp, and confidence score.
- Reviewers must be able to accept all, accept partially, or reject with reason.

## Metrics
- Time to publish
- Review backlog size
- Verification coverage
- Data freshness score
- No-result search rate
- Report resolution time
