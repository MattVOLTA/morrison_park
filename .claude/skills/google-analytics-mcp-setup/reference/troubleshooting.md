# Troubleshooting Google Analytics MCP Setup

This guide covers common issues encountered during setup and how to resolve them.

## Table of Contents
1. [Installation Issues](#installation-issues)
2. [Authentication Issues](#authentication-issues)
3. [Connection Issues](#connection-issues)
4. [API Issues](#api-issues)
5. [Data Access Issues](#data-access-issues)

---

## Installation Issues

### Homebrew Installation Fails

**Symptoms:**
- Error during Homebrew installation script
- "Permission denied" errors

**Solutions:**

**Issue: Xcode Command Line Tools not installed**
```bash
xcode-select --install
```
Follow the prompts to install.

**Issue: Rosetta 2 needed (M1/M2 Macs)**
```bash
softwareupdate --install-rosetta
```

**Issue: Permission errors**
```bash
sudo chown -R $(whoami) /usr/local/Homebrew
```

### pyenv Installation Issues

**Symptoms:**
- `pyenv: command not found` after installation
- Python version not changing

**Solutions:**

**Issue: Shell not configured**

Add to `~/.zshrc` (for zsh) or `~/.bash_profile` (for bash):
```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

**Issue: Build dependencies missing**

Install required libraries:
```bash
brew install openssl readline sqlite3 xz zlib
```

### Python Installation Fails

**Symptoms:**
- `BUILD FAILED` during `pyenv install`
- Missing libraries errors

**Solutions:**

**Issue: Missing build dependencies**
```bash
# Install build tools
brew install openssl readline sqlite3 xz zlib tcl-tk

# Set compiler flags
export LDFLAGS="-L/usr/local/opt/openssl@3/lib"
export CPPFLAGS="-I/usr/local/opt/openssl@3/include"

# Retry installation
pyenv install 3.11.0
```

**Issue: Apple Silicon (M1/M2) compatibility**
```bash
# Use arch command
arch -arm64 pyenv install 3.11.0
```

### pipx Installation Issues

**Symptoms:**
- `pipx: command not found`
- pipx installed but not in PATH

**Solutions:**

**Issue: PATH not updated**
```bash
pipx ensurepath
source ~/.zshrc  # or source ~/.bash_profile
```

**Issue: pipx installed in wrong location**
```bash
# Reinstall via Homebrew
brew reinstall pipx
pipx ensurepath
```

---

## Authentication Issues

### "Could not load credentials" Error

**Symptoms:**
- MCP fails to start
- Error mentions credentials file not found

**Solutions:**

**Check file path in `.mcp.json`:**
```json
{
  "mcpServers": {
    "google-analytics": {
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/your/credentials.json"
      }
    }
  }
}
```

**Verify path is correct:**
```bash
ls -l /path/to/your/credentials.json
```

**Use absolute path (not relative):**
- ✅ `/Users/username/project/credentials/sa.json`
- ❌ `./credentials/sa.json`
- ❌ `~/project/credentials/sa.json` (expand ~ to full path)

### "Invalid credentials" Error

**Symptoms:**
- Authentication fails
- Error about malformed credentials

**Solutions:**

**Validate JSON structure:**
```bash
python3 -m json.tool /path/to/credentials.json
```

If this fails, the JSON is invalid. Re-download from Google Cloud Console.

**Check required fields:**
```bash
grep -E '"(type|project_id|private_key|client_email)"' /path/to/credentials.json
```

Should show all four fields. If any are missing, re-download credentials.

**Verify file permissions:**
```bash
chmod 600 /path/to/credentials.json
```

### "Service account does not exist" Error

**Symptoms:**
- Error mentions service account not found
- Authentication fails with 404

**Solutions:**

1. Verify service account exists in Google Cloud Console:
   - Go to IAM & Admin → Service Accounts
   - Check if your service account is listed

2. Verify project ID matches:
   - Check `project_id` in credentials JSON
   - Check `GOOGLE_CLOUD_PROJECT` in `.mcp.json`
   - Both should match

3. If service account was deleted, create a new one following `google-cloud-setup.md`

---

## Connection Issues

### MCP Server Won't Start

**Symptoms:**
- No response when querying Analytics
- MCP server not showing in Claude Code

**Solutions:**

**Check Python installation:**
```bash
which python3
python3 --version
```

Should show Python 3.9 or higher.

**Check pipx:**
```bash
pipx --version
```

**Test MCP server manually:**
```bash
python3 -m pipx run --spec git+https://github.com/googleanalytics/google-analytics-mcp.git google-analytics-mcp
```

**Check environment variables:**
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
echo $GOOGLE_CLOUD_PROJECT
```

Both should be set when running MCP.

### "No account summaries found"

**Symptoms:**
- MCP connects but returns empty results
- `get_account_summaries` returns `[]`

**Solutions:**

**Most common: Service account not granted Analytics access**
1. See `analytics-access.md` for detailed steps
2. Verify service account email is in Property Access Management
3. Wait 2-3 minutes for permissions to propagate

**Check service account email:**
```bash
grep client_email /path/to/credentials.json
```

Ensure this exact email is added to your Analytics properties.

**Verify API is enabled:**
1. Go to Google Cloud Console
2. APIs & Services → Dashboard
3. Confirm "Google Analytics Data API" is enabled

### Connection Timeout

**Symptoms:**
- Long delay then timeout error
- "Failed to connect to Google Analytics API"

**Solutions:**

**Check internet connection:**
```bash
ping -c 3 analyticsdata.googleapis.com
```

**Check firewall/VPN:**
- Disable VPN temporarily
- Check corporate firewall settings
- Ensure outbound HTTPS (443) is allowed

**Verify API endpoint accessibility:**
```bash
curl -I https://analyticsdata.googleapis.com
```

Should return HTTP 200 or similar (not connection refused).

---

## API Issues

### "API not enabled" Error

**Symptoms:**
- Error: "Google Analytics Data API has not been used in project..."
- 403 Forbidden errors

**Solutions:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to APIs & Services → Library
4. Search for "Google Analytics Data API"
5. Click Enable
6. Wait 1-2 minutes for activation
7. Retry connection

### "Quota exceeded" Error

**Symptoms:**
- Error about API quota limits
- Requests failing after working previously

**Solutions:**

**Check quota usage:**
1. Google Cloud Console → APIs & Services → Dashboard
2. Click "Google Analytics Data API"
3. View Quotas tab

**Default quotas (per project per day):**
- Requests: 50,000
- Concurrent requests: 10

**If quota exceeded:**
- Wait until quota resets (midnight Pacific Time)
- Request quota increase via Google Cloud Console
- Use pagination to reduce number of requests

### "Permission denied" on API calls

**Symptoms:**
- 403 errors when querying data
- Error mentions insufficient permissions

**Solutions:**

**Verify Analytics property access:**
1. Service account must have Viewer role minimum
2. Check Property Access Management in Google Analytics
3. Verify service account email is listed

**Verify API scopes:**
Service account should have access to:
- `https://www.googleapis.com/auth/analytics.readonly`

This is automatic with proper Analytics property access.

---

## Data Access Issues

### "Property not found" Error

**Symptoms:**
- Error when querying specific property
- Property ID not recognized

**Solutions:**

**Get correct property ID:**
```bash
# Via MCP (if account summaries work)
mcp__google-analytics__get_account_summaries
```

Or in Google Analytics:
1. Go to Admin
2. Select property
3. Property Settings
4. Copy Property ID (numeric value)

**Use correct format:**
- ✅ `288353961`
- ✅ `properties/288353961`
- ❌ `GA4-288353961`
- ❌ `UA-288353961`

### "Dimension not found" Error

**Symptoms:**
- Error when running reports
- "Unknown dimension" message

**Solutions:**

**Use correct dimension names:**
- Dimension names are case-sensitive
- Use `eventName` not `event_name` or `EventName`

**Check dimension compatibility:**
- Some dimensions only work with specific metrics
- Realtime reports have different dimensions than standard reports

**Verify dimension exists:**
- Standard dimensions: See [API Schema](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- Custom dimensions: Use `get_custom_dimensions_and_metrics` tool

### Empty Data Results

**Symptoms:**
- Query succeeds but returns no data
- Expected data is missing

**Solutions:**

**Check date range:**
```json
{
  "date_ranges": [
    {"start_date": "30daysAgo", "end_date": "today"}
  ]
}
```

Ensure date range contains data collection period.

**Verify data collection:**
1. Check Google Analytics dashboard
2. Confirm data is being collected for the property
3. New properties may have no historical data

**Check filters:**
- Remove dimension/metric filters temporarily
- Verify filter syntax is correct
- Filters may be excluding all data

---

## Advanced Troubleshooting

### Enable Debug Logging

Set environment variable for verbose logging:
```bash
export GOOGLE_APPLICATION_CREDENTIALS_DEBUG=1
```

Then check logs for detailed error messages.

### Test Credentials Manually

Use Google Cloud SDK to test credentials:
```bash
# Install gcloud CLI
brew install google-cloud-sdk

# Authenticate with service account
gcloud auth activate-service-account --key-file=/path/to/credentials.json

# Test API access
gcloud analytics data run-report --property=YOUR_PROPERTY_ID
```

### Verify .mcp.json Syntax

Check for JSON errors:
```bash
python3 -m json.tool .mcp.json
```

Should print formatted JSON. If it errors, fix JSON syntax.

### Check Claude Code Logs

Look for MCP errors in Claude Code logs:
1. Open Claude Code
2. View → Output
3. Select "MCP" from dropdown
4. Check for error messages

---

## Getting Help

If issues persist after trying these solutions:

### Collect Diagnostic Information

1. **Python version:**
   ```bash
   python3 --version
   ```

2. **pipx version:**
   ```bash
   pipx --version
   ```

3. **Credentials validation:**
   ```bash
   python3 -m json.tool /path/to/credentials.json | grep -E '"(type|project_id|client_email)"'
   ```

4. **MCP configuration:**
   ```bash
   cat .mcp.json
   ```

5. **Error messages:**
   - Copy exact error text
   - Include stack traces if available

### Resources

- **Google Analytics API Docs:** https://developers.google.com/analytics/devguides/reporting/data/v1
- **Google Analytics MCP GitHub:** https://github.com/googleanalytics/google-analytics-mcp
- **Claude Code Documentation:** https://docs.claude.ai/claude-code
- **Stack Overflow:** Tag questions with `google-analytics-data-api`

### Common Error Messages Reference

| Error Message | Likely Cause | Solution Reference |
|--------------|--------------|-------------------|
| "Could not load credentials" | Invalid path in `.mcp.json` | [Authentication Issues](#authentication-issues) |
| "API not enabled" | Analytics API not activated | [API Issues](#api-issues) |
| "No account summaries" | Service account lacks property access | [Connection Issues](#connection-issues) |
| "Permission denied" | Insufficient role in Analytics | [Data Access Issues](#data-access-issues) |
| "Quota exceeded" | Too many API requests | [API Issues](#api-issues) |
| "Invalid credentials" | Malformed JSON file | [Authentication Issues](#authentication-issues) |
| "Property not found" | Wrong property ID format | [Data Access Issues](#data-access-issues) |
| "Dimension not found" | Invalid dimension name | [Data Access Issues](#data-access-issues) |

---

## Prevention Tips

### Before Setup
- Verify you have admin access to Google Analytics
- Confirm you can create Google Cloud projects
- Check internet connectivity is stable

### During Setup
- Follow guides in exact order
- Complete each verification checkpoint
- Don't skip credential security steps

### After Setup
- Test connection immediately
- Document working configuration
- Keep credentials backed up securely
- Add `.gitignore` entries for sensitive files

### Ongoing Maintenance
- Monitor API quota usage
- Rotate credentials periodically (every 90 days)
- Audit Analytics property access quarterly
- Keep dependencies updated (pyenv, pipx, Python)

This proactive approach minimizes troubleshooting needs and keeps your integration running smoothly.
