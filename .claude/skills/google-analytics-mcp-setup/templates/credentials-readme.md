# Google Analytics Service Account Credentials

This directory contains sensitive Google Cloud service account credentials for Google Analytics API access.

## Security Notice

**IMPORTANT:** Never commit these files to version control!

## Contents

- `google-analytics-sa.json` - Service account credentials for Google Analytics MCP

## Credentials Information

**Service Account Email:** [Will be shown after setup]
**Project ID:** [Will be shown after setup]
**Created:** [Date will be shown after setup]

## Usage

These credentials are referenced in your `.mcp.json` configuration file:

```json
{
  "mcpServers": {
    "google-analytics": {
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/this/directory/google-analytics-sa.json"
      }
    }
  }
}
```

## Security Best Practices

1. **File Permissions:** Ensure files are readable only by you
   ```bash
   chmod 600 google-analytics-sa.json
   ```

2. **Git Ignore:** Add this directory to `.gitignore`
   ```
   credentials/
   *.json
   ```

3. **Backup:** Keep a secure backup of these credentials
   - Store in password manager
   - Or keep encrypted backup in secure location

4. **Rotation:** Rotate credentials every 90 days
   - Create new service account key in Google Cloud Console
   - Update `.mcp.json` with new file path
   - Delete old key from Google Cloud Console
   - Securely delete old credentials file

## If Credentials Are Compromised

If these credentials are exposed or compromised:

1. **Immediately revoke the key:**
   - Go to Google Cloud Console
   - Navigate to IAM & Admin → Service Accounts
   - Select your service account
   - Go to Keys tab
   - Delete the compromised key

2. **Create new credentials:**
   - Follow the setup guide to create a new key
   - Download new credentials JSON
   - Update `.mcp.json` configuration

3. **Audit access:**
   - Check Google Analytics property access
   - Review API usage logs in Google Cloud Console
   - Remove service account access if needed

## Need Help?

See the troubleshooting guide in the skill documentation:
`.claude/skills/google-analytics-mcp-setup/reference/troubleshooting.md`
