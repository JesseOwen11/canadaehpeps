# CanadaEhPeps — Roadmap & Task List

## Security — pending
- [ ] SERVER-SIDE ADMIN LOCKOUT — count failed admin sign-in attempts on the
      server (keyed by email/IP) so switching browsers or incognito does NOT
      reset the counter. Raise this at the next security review.
      Current state (client-side only): 3-attempt lockout, owner alert email,
      5-minute idle logout. These deter and alert, but are bypassable.

## Security — completed (August 24, 2026)
- [x] Owner protection — owner account cannot be deleted or demoted
- [x] Invite-only admin promotion (one-time codes, owner-created)
- [x] Admin PIN as a second sign-in factor
- [x] 3-attempt lockout + owner alert email (client-side)
- [x] 5-minute idle auto-logout
- [x] Row-level security on all tables
- [x] Staff/owner flag self-promotion blocked at database level
- [x] Customer self-delete with staff/owner safeguards

## Launch runway
- [ ] Custom domain
- [ ] Telegram / Signal support handles
- [ ] Wording polish (list items when ready)
- [ ] Real pricing (you set these in Admin → Bulk products)
