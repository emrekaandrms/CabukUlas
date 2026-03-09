# CabukUlas Data Architecture Notes

## Goal
Support a public read-optimized mobile app and a controlled editorial admin workflow on the same Supabase foundation without leaking draft content or weakening data quality.

## Public vs Editorial Separation
- Public app should only read published-safe data.
- Editorial writes should land in workflow-aware tables with status, verification, audit, and approval metadata.
- A published projection or view should act as the source of truth for the mobile app when the CMS matures.

## Recommended Tables
- `categories`
- `companies`
- `contact_channels`
- `company_aliases`
- `company_sources`
- `contact_channel_hours`
- `featured_placements`
- `verification_checks`
- `automation_suggestions`
- `content_reports`
- `audit_logs`
- `company_revisions`
- `channel_revisions`
- `admin_profiles`

## Search Strategy
- Exact match first
- Alias match second
- Prefix match third
- Fuzzy / trigram match fourth
- Verified and recommended data should rank higher than low-confidence records

## RLS Strategy
- Public: read `published`, not archived content only
- Editor: draft create/update access
- Reviewer: review + approve access
- Admin: publish, archive, rollback, manage placements
- Audit and revision tables: restricted to operational roles only

## Validation Strategy
- Partial unique index for one recommended channel per company
- Duplicate channel prevention
- Publish-time completeness checks
- Verification metadata requirements for high-trust content

## Automation Strategy
- Scheduled link checks
- Freshness recalculation
- Report queue ingestion
- Suggested changes pipeline for scraping or source sync

## Observability
- Public events: search, company view, channel tap, cargo start, no-result search
- Editorial events: create, update, review, approve, reject, publish, archive, rollback
- Dashboard metrics should combine product and operations visibility without mixing permissions
