# DNS Configuration for Hiems.se

## SPF Record Configuration

To improve email security and deliverability, add the following SPF record to your DNS settings:

### Record Type: TXT
**Name/Host:** `@` or `hiems.se`  
**Value/Content:** `v=spf1 include:_spf.google.com ~all`

### Example for different DNS providers:

**Cloudflare:**
- Type: TXT
- Name: @
- Content: `v=spf1 include:_spf.google.com ~all`
- TTL: Auto

**GoDaddy:**
- Type: TXT
- Host: @
- TXT Value: `v=spf1 include:_spf.google.com ~all`
- TTL: 1 Hour

**Namecheap:**
- Type: TXT Record
- Host: @
- Value: `v=spf1 include:_spf.google.com ~all`
- TTL: Automatic

### What this does:
- **v=spf1** - Specifies SPF version 1
- **include:_spf.google.com** - Authorizes Google servers to send email on your behalf (if using Google Workspace)
- **~all** - Softfail for all other servers (marks as suspicious but doesn't reject)

### Verification:
After adding the record, verify it using:
```bash
dig TXT hiems.se +short
```

Or use online tools like:
- https://mxtoolbox.com/spf.aspx
- https://www.kitterman.com/spf/validate.html

### Additional Email Security (Recommended):

**DKIM Record:**
Get DKIM record from your email provider (Google Workspace, SendGrid, etc.) and add as TXT record.

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@hiems.se; pct=100
```

## Other DNS Considerations

### WWW Redirect
Ensure www.hiems.se redirects to hiems.se for canonical URL consistency.

### CNAME Records
If using CDN or hosting services, configure appropriate CNAME records.

### MX Records
Configure MX records for email routing based on your email provider.
