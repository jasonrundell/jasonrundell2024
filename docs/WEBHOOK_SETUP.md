# Contentful to Vercel Webhook Setup Guide

This guide explains how to set up webhooks between Contentful and Vercel to trigger incremental builds when content is published, updated, or deleted.

## Overview

When you publish content in Contentful, a webhook will automatically trigger Vercel to revalidate only the affected pages, rather than rebuilding the entire site. This provides faster updates and reduces build times.

## Prerequisites

- A Vercel deployment of your site
- A Contentful space with published content
- Access to both Vercel and Contentful dashboards

## Step 1: Generate Webhook Secret

You need a secret token to secure your webhook endpoint. Generate a secure random string:

### Windows (PowerShell)
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Windows (Command Prompt)
```cmd
powershell -Command "-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})"
```

### Mac OS / Linux
```bash
openssl rand -base64 32
```

Or using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Save this secret** - you'll need it in the next steps.

## Step 2: Configure Environment Variable in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `CONTENTFUL_WEBHOOK_SECRET`
   - **Value**: The secret you generated in Step 1
   - **Environment**: Select all environments (Production, Preview, Development)
5. Click **Save**

**Important**: After adding the environment variable, you need to redeploy your site for it to take effect. You can trigger a redeploy from the **Deployments** tab.

## Step 3: Get Your Webhook URL

Your webhook endpoint will be:
```
https://your-domain.com/api/revalidate
```

Replace `your-domain.com` with your actual Vercel deployment domain. You can find this in:
- Vercel Dashboard → Your Project → **Settings** → **Domains**
- Or use your production domain if you have a custom domain configured

**Example URLs:**
- Production: `https://jasonrundell.com/api/revalidate`
- Vercel preview: `https://your-project.vercel.app/api/revalidate`

## Step 4: Configure Webhook in Contentful

1. Log in to [Contentful](https://app.contentful.com)
2. Select your space
3. Navigate to **Settings** → **Webhooks** (or go directly to: `https://app.contentful.com/spaces/YOUR_SPACE_ID/settings/webhooks`)
4. Click **Add webhook**
5. Configure the webhook:

   **Name**: `Vercel Revalidation` (or any descriptive name)

   **URL**: Enter your webhook URL from Step 3
   ```
   https://your-domain.com/api/revalidate
   ```

   **HTTP Basic username**: Leave empty

   **HTTP Basic password**: Leave empty

   **Custom Header**: 
   - **Header name**: `Authorization`
   - **Header value**: `Bearer YOUR_WEBHOOK_SECRET`
     (Replace `YOUR_WEBHOOK_SECRET` with the secret from Step 1)

6. **Triggers**: Select when the webhook should fire:
   - ✅ **Entry publish**
   - ✅ **Entry unpublish**
   - ✅ **Entry delete**
   - ❌ **Entry archive** (optional, only if you use archiving)
   - ❌ **Entry unarchive** (optional, only if you use archiving)
   - ❌ **Asset publish** (optional, only if you want to revalidate on asset changes)
   - ❌ **Asset unpublish** (optional)
   - ❌ **Asset delete** (optional)

   **Note**: The current implementation only processes Entry events. Asset events are ignored.

7. **Content types**: 
   - Select **All content types** to revalidate on any content change
   - Or select specific content types: `post`, `project`, `skill`, `reference`, `position`, `lastSong`

8. Click **Save**

## Step 5: Test the Webhook

1. In Contentful, make a small change to a published entry (e.g., edit a blog post)
2. Publish the entry
3. Check your Vercel deployment logs:
   - Go to Vercel Dashboard → Your Project → **Deployments**
   - Click on the latest deployment
   - Check the **Functions** tab for logs from `/api/revalidate`
4. Verify the page was revalidated:
   - Visit the updated page on your site
   - The content should reflect your changes

### Testing with curl (Optional)

You can test the webhook endpoint directly:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -d '{
    "sys": {
      "id": "test-entry-id",
      "type": "Entry",
      "contentType": {
        "sys": {
          "id": "post"
        }
      }
    },
    "fields": {
      "slug": {
        "en-US": "test-post"
      }
    }
  }'
```

Expected response:
```json
{
  "revalidated": true,
  "paths": ["/posts/test-post", "/"],
  "contentType": "post",
  "entryId": "test-entry-id",
  "slug": "test-post",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## How It Works

1. **Content Change**: You publish, update, or delete content in Contentful
2. **Webhook Trigger**: Contentful sends a POST request to `/api/revalidate` with the entry details
3. **Authentication**: The webhook handler verifies the `Authorization` header matches your secret
4. **Path Revalidation**: Based on the content type, the handler calls `revalidatePath()` for:
   - The specific page (e.g., `/posts/my-post` for a post)
   - The home page (if the content appears in lists)
5. **Incremental Build**: Vercel regenerates only the revalidated pages on the next request

## Content Type Mapping

The webhook handler revalidates paths based on content type:

| Content Type | Revalidated Paths |
|-------------|-------------------|
| `post` | `/posts/{slug}`, `/` |
| `project` | `/projects/{slug}`, `/` |
| `skill` | `/` |
| `reference` | `/` |
| `position` | `/` |
| `lastSong` | `/` |
| Other | `/` (home page as safe default) |

## Troubleshooting

### Webhook Not Firing

1. **Check Contentful Webhook Status**:
   - Go to Contentful → Settings → Webhooks
   - Check if the webhook shows as "Active"
   - Click on the webhook to see recent delivery attempts

2. **Check Vercel Logs**:
   - Vercel Dashboard → Your Project → **Deployments** → Latest → **Functions** tab
   - Look for errors in `/api/revalidate` function logs

3. **Verify Environment Variable**:
   - Ensure `CONTENTFUL_WEBHOOK_SECRET` is set in Vercel
   - Ensure you've redeployed after adding the environment variable

### 401 Unauthorized Error

- Verify the `Authorization` header in Contentful webhook settings matches your `CONTENTFUL_WEBHOOK_SECRET`
- Ensure there are no extra spaces in the header value
- The format should be: `Bearer YOUR_SECRET_HERE`

### Pages Not Updating

1. **Check if revalidation is working**:
   - Look for success responses in Vercel function logs
   - Verify the `revalidated` field in the response is `true`

2. **Verify paths are correct**:
   - Check that the slug in Contentful matches the URL structure
   - Ensure content types match (e.g., `post` not `posts`)

3. **Cache issues**:
   - Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Check if Vercel's edge cache needs to be cleared

### Webhook Secret Not Working

- Ensure the secret in Contentful webhook settings exactly matches `CONTENTFUL_WEBHOOK_SECRET` in Vercel
- Remember to include the `Bearer ` prefix in the Authorization header value
- Redeploy your Vercel site after changing the environment variable

## Security Considerations

1. **Never commit the webhook secret** to your repository
2. **Use different secrets** for different environments (production, preview, development)
3. **Regularly rotate** your webhook secret
4. **Monitor webhook logs** in both Contentful and Vercel for suspicious activity

## Advanced Configuration

### Multiple Environments

If you have multiple Vercel environments (production, preview, staging), you can:

1. Create separate webhooks in Contentful for each environment
2. Use different `CONTENTFUL_WEBHOOK_SECRET` values for each
3. Configure webhooks to only fire in specific environments (Contentful webhook filters)

### Selective Revalidation

To customize which paths get revalidated, edit `src/app/api/revalidate/route.ts` and modify the switch statement to match your routing structure.

## Additional Resources

- [Next.js Revalidation Documentation](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [Vercel Webhooks Guide](https://vercel.com/docs/observability/webhooks)
- [Contentful Webhooks Documentation](https://www.contentful.com/developers/docs/concepts/webhooks/)

