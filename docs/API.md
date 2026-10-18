# CampusConnect API

The backend is served from `http://localhost:5000` by default. JSON endpoints
are prefixed with `/api`.

## Health

### `GET /api/health`

Reports API and MongoDB connectivity.

Successful response:

```json
{
  "success": true,
  "data": {
    "service": "campusconnect-api",
    "status": "ok",
    "database": "connected"
  }
}
```

The endpoint returns HTTP 503 while MongoDB is unavailable. The response keeps
the database state visible so deployment and local setup problems are explicit.

## Error format

Unknown routes return HTTP 404. Unexpected server errors return HTTP 500.
Both use this shape:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Route not found: GET /api/unknown"
  }
}
```

Authentication is provided under `/api/auth`. Community endpoints are:

- `/api/donations` — browse, create, update, cancel, and claim donations.
- `/api/lost-and-found` — report and manage lost or found items.
- `/api/volunteering` — publish opportunities and atomically join/leave
  capacity-limited opportunities.
- `/api/events` — publish events and atomically attend/leave capacity-limited events.
- `/api/announcements` — browse announcements; authorized faculty and admins can publish.
- `/api/notifications` — read the authenticated user's notifications.
- `/api/admin` — protected user suspension and audit-log endpoints.

Create and ownership-changing operations require a Bearer token. A user may
only update or delete records they own (the event organizer or opportunity
owner), while registration operations prevent duplicate registrations and
over-capacity updates.
