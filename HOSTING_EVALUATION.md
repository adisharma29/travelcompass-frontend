# Hosting Evaluation: TravelCompass Frontend

## Project Profile

| Attribute | Value |
|-----------|-------|
| **Framework** | Next.js 16.1.6 (App Router, React 19) |
| **Rendering** | SSR + Client-side hybrid (Server Components) |
| **Build output** | `standalone` (self-contained Node.js server) |
| **Backend** | None — calls external Django API |
| **API routes** | None |
| **Docker** | Yes — multi-stage build, runs `node server.js` on port 6001 |
| **External services** | Mapbox GL, external Django API |

**Key constraint:** This is an SSR app with `output: "standalone"`. It requires a Node.js runtime — it cannot be deployed as a purely static site.

---

## Option 1: Cloudflare Workers (via OpenNext)

**Estimated cost: $0–$5/month**

| | Free | Paid ($5/mo) |
|--|------|--------------|
| Requests | 100k/day | 10M/month |
| CPU time | 10ms/request | 30s/request |
| Worker size | 3 MiB | 10 MiB |
| Bandwidth | Unlimited | Unlimited |
| Egress | Free | Free |

### How it works

The legacy `@cloudflare/next-on-pages` is deprecated. The current approach uses the **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`) which transforms the Next.js build output to run on Cloudflare Workers. Full Next.js 16 support including App Router, SSR, and ISR is available.

### Pros

- **$0 egress fees** — huge advantage over most competitors
- **Global edge deployment** — low latency worldwide, no region selection needed
- **Free tier is generous** — 100k requests/day covers most small-to-medium sites
- **No cold starts** — Workers spin up in milliseconds
- **Built-in DDoS protection and CDN** included at no extra cost
- **$5/month paid tier** includes 10M requests — very competitive

### Cons

- **Not a native Node.js runtime** — requires OpenNext adapter transformation
- **3 MiB worker size limit on free tier** — may be tight depending on bundle size
- **Compatibility gaps** — some npm packages don't work, no filesystem access, crypto method differences
- **Debugging is harder** — errors in the adapter layer can be opaque
- **Mapbox GL JS bundle is large** — may push against worker size limits
- **Vendor lock-in** to Cloudflare's runtime model

### Build Test Results (Tested Feb 2026)

The OpenNext Cloudflare adapter (`@opennextjs/cloudflare@1.16.4`) was tested against this project:

- **Build: PASSED** — `opennextjs-cloudflare build` completed successfully with Next.js 16.1.6
- **Worker bundle size: 9,058 KiB (~8.8 MiB)** uncompressed / **2,135 KiB (~2.1 MiB)** gzip
- **Static assets: 2.5 MiB** (served free and unlimited)
- **Server handler: 4.4 MiB** (bundled into the worker)

#### Size Limit Impact

| Tier | Limit | Fits? |
|------|-------|-------|
| Free (3 MiB) | 3 MiB uncompressed | **NO — 8.8 MiB exceeds 3 MiB** |
| Paid ($5/mo, 10 MiB) | 10 MiB uncompressed | **YES — 8.8 MiB fits within 10 MiB** |

> **The free tier will NOT work for this project.** The worker bundle at 8.8 MiB far exceeds the 3 MiB free-tier limit. The $5/month paid plan (10 MiB limit) is required, and the bundle is close to that limit too — future growth could push it over.

### Verdict

Cloudflare Workers **works but requires the $5/month paid plan** due to worker size limits. The build compiles cleanly, but the 8.8 MiB bundle size rules out the free tier and leaves only ~1.2 MiB headroom on the paid tier. This makes Cloudflare less attractive compared to a Hetzner VPS (~€3.49/month) which has no such constraints.

**Recommendation: Viable at $5/month, but the tight size margin is a concern for long-term growth. Not recommended as the primary choice.**

---

## Option 2: Vercel (Free Hobby Tier)

**Estimated cost: $0 (hobby) / $20/month (pro)**

| | Hobby (Free) | Pro ($20/mo) |
|--|--------------|--------------|
| Bandwidth | 100 GB/month | 1 TB/month |
| Builds | 6,000 min/month | 24,000 min/month |
| Serverless exec | 100 GB-hrs | 1,000 GB-hrs |
| Edge requests | 1M/month | 10M/month |
| Deployments | 100/day | 6,000/day |

### Pros

- **Zero-config deployment** for Next.js — built by the same team
- **Free tier works** for low-traffic hobby/staging sites
- **Preview deployments** on every PR
- **Automatic HTTPS, CDN, and edge caching**
- **Best DX** — fastest path from code to production

### Cons

- **Not free for commercial use** — Hobby plan is non-commercial only
- **Expensive at scale** — $20/seat/month, overage charges add up
- **100 GB bandwidth cap** on free tier can be hit with media-heavy sites
- **Edge request limits** — even static assets count, ~50 requests per page load
- **Vendor lock-in** to Vercel's infrastructure

### Verdict

Best developer experience, but **the free tier is non-commercial**. If this is a production commercial app, the minimum cost is $20/month. Not the cheapest option.

---

## Option 3: Railway

**Estimated cost: $5/month (usage-based)**

| | Hobby ($5/mo) | Pro ($20/mo) |
|--|---------------|--------------|
| Credits included | $5 | $20 |
| vCPU | $0.000463/min | $0.000463/min |
| Memory | $0.000231/GB/min | $0.000231/GB/min |
| Egress | $0.10/GB | $0.10/GB |

### Pros

- **Usage-based billing** — a small Next.js app may cost $2–5/month total
- **Native Docker support** — your existing Dockerfile works as-is
- **Auto-deploys from GitHub**
- **Simple DX** — good middle ground between Vercel and raw VPS
- **No cold starts** — always-on containers

### Cons

- **No free tier** — 30-day trial only, then $5/month minimum
- **Egress charges** at $0.10/GB
- **Single region** per deployment (no global edge)

### Verdict

**Great balance of cost and simplicity.** Your existing Docker setup works immediately. Predictable low costs for small apps. Good choice if you want managed hosting without Vercel's price tag.

---

## Option 4: Fly.io

**Estimated cost: ~$3–7/month**

| Resource | Cost |
|----------|------|
| Shared 1x CPU, 256MB | ~$1.94/month |
| Shared 1x CPU, 512MB | ~$3.57/month |
| Dedicated IPv4 | $2/month |
| Egress (NA/EU) | $0.02/GB |
| Volumes | $0.15/GB/month |

### Pros

- **Firecracker microVMs** — real VMs, not containers, no cold starts
- **Multi-region deployment** possible
- **Docker-native** — your Dockerfile works directly
- **Fine-grained scaling** — scale to zero, auto-wake on request
- **~$5/month free allowance** for small apps

### Cons

- **Requires credit card** upfront
- **IPv4 costs $2/month extra** (shared IPv6 is free)
- **Complexity** — more operational overhead than Railway or Vercel
- **Volume snapshot charges** introduced Jan 2026

### Verdict

Good for multi-region needs. Slightly more complex than Railway but offers more control. Cost is comparable at ~$5/month for a small app.

---

## Option 5: Self-Hosted VPS + Coolify

**Estimated cost: €3.49–5/month (Hetzner) + free (Coolify)**

| VPS Provider | Cheapest Plan | Specs |
|-------------|---------------|-------|
| Hetzner CX23 | €3.49/mo | 2 vCPU, 4GB RAM, 40GB SSD, 20TB traffic |
| Hetzner CAX11 (ARM) | €3.79/mo | 2 vCPU, 4GB RAM, 40GB SSD, 20TB traffic |
| DigitalOcean | $6/mo | 1 vCPU, 1GB RAM, 25GB SSD, 1TB traffic |

### How it works

Install [Coolify](https://coolify.io) (open-source, free) on a cheap VPS. Coolify provides a Vercel-like dashboard: git push deploys, automatic SSL, preview URLs, monitoring — all self-hosted. Your existing Dockerfile works directly.

### Pros

- **Cheapest option overall** — €3.49/month for a capable VPS
- **20 TB included traffic** on Hetzner — no egress surprises
- **Full control** — no vendor lock-in, no runtime constraints
- **Coolify gives you Vercel-like DX** for free
- **Can host multiple apps** on one VPS (frontend + other projects)
- **Your Docker setup works as-is** — zero changes needed

### Cons

- **You manage the server** — updates, security patches, monitoring
- **Single point of failure** without redundancy setup
- **No global edge CDN built-in** (add Cloudflare free CDN in front)
- **Initial setup overhead** — ~30 minutes to set up Coolify
- **Hetzner has limited US/no Asia presence**

### Verdict

**Cheapest production-grade option.** A Hetzner VPS at €3.49/month + Coolify gives you a Vercel-like experience at a fraction of the cost. Add Cloudflare's free CDN/DNS in front for global caching and DDoS protection.

---

## Comparison Matrix

| | Cloudflare Workers | Vercel Free | Railway | Fly.io | Hetzner + Coolify |
|--|-------------------|-------------|---------|--------|-------------------|
| **Monthly cost** | $5 (free tier too small) | $0 (non-commercial) | ~$5 | ~$5 | ~€3.49 |
| **Commercial use** | Yes | No (free tier) | Yes | Yes | Yes |
| **Your Docker works** | No (needs adapter) | No (managed) | Yes | Yes | Yes |
| **Global edge** | Yes | Yes | No | Optional | No (add CF CDN) |
| **Egress fees** | None | Included | $0.10/GB | $0.02/GB | 20TB included |
| **Cold starts** | None | Possible | None | None | None |
| **Setup effort** | Medium | Low | Low | Medium | Medium-High |
| **Vendor lock-in** | Medium | High | Low | Low | None |
| **SSR support** | Via OpenNext | Native | Native | Native | Native |

---

## Recommendations (Updated After Testing)

### 1. Best Overall for Low Cost: **Hetzner CX23 + Coolify + Cloudflare CDN**
- **~€3.49/month** (~$3.75 USD) — cheapest option
- Your Docker setup works with zero changes
- Coolify handles deploys, SSL, monitoring
- Put Cloudflare free CDN in front for caching + DDoS protection
- 20TB traffic included — no egress surprises
- Can host your Django backend on the same VPS later
- **No bundle size limits or runtime constraints**

### 2. Best Balance of DX and Cost: **Railway**
- **~$5/month** usage-based
- Docker works immediately, GitHub auto-deploy
- Simple and predictable, no operational overhead

### 3. Cloudflare Workers ($5/month paid plan required)
- Build succeeds but **worker bundle is 8.8 MiB — exceeds 3 MiB free tier**
- Requires $5/month paid plan (10 MiB limit), with only 1.2 MiB headroom
- Zero egress, global edge, built-in security
- **Risk:** bundle growth could exceed the 10 MiB paid tier limit over time

### Final Recommendation

**Go with Hetzner + Coolify** at €3.49/month. It's the cheapest, has no artificial limits, your Docker setup works unmodified, and you can host additional services on the same VPS. Use Cloudflare's **free** CDN/DNS tier in front for global caching and DDoS protection — this gives you the best of both worlds.
