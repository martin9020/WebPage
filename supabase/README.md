# Steelit Website Visit Notifications

This Supabase project is dedicated to the company website only.

Current project:

```text
steelit.site
ref: wtjnqpvaerhvmeeuhuxq
endpoint: https://wtjnqpvaerhvmeeuhuxq.supabase.co/functions/v1/track-company-visit
```

Required GitHub secrets in `martin9020/WebPage`:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`
- `NTFY_TOPIC`
- `VISIT_HASH_SALT`

Optional secrets:

- `NTFY_BASE_URL`, defaults to `https://ntfy.sh`
- `NTFY_BEARER_TOKEN`
- `NTFY_PRIORITY`, defaults to `3`
- `VISIT_NOTIFY_COOLDOWN_MINUTES`, defaults to `1440`

Create a new Supabase project:

```powershell
npx supabase login
npx supabase orgs list
npx supabase projects create steelit-website-notifications --org-id <org-id> --db-password <strong-password> --region eu-central-2
```

After the project is created, add the project ref and secrets to the `WebPage` GitHub repo, then run the `Deploy Company Supabase` workflow.

Tracked fields include the visitor path/referrer/timezone, raw IP address, hashed IP address, country, country code, city, region, user agent, and notification status.

The public website should call:

```text
https://<project-ref>.supabase.co/functions/v1/track-company-visit
```
