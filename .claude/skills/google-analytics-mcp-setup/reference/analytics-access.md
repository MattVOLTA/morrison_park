# Google Analytics Property Access Setup

This guide walks through granting your service account access to Google Analytics properties.

## Table of Contents
1. [Overview](#overview)
2. [Find Service Account Email](#find-service-account-email)
3. [Grant Property Access](#grant-property-access)
4. [Verify Access](#verify-access)
5. [Multiple Properties](#multiple-properties)

---

## Overview

For the MCP integration to access your Google Analytics data, the service account must be granted permissions at the **property level** in Google Analytics.

**Key Concepts:**
- **Service Account:** The technical user created in Google Cloud
- **Property:** A Google Analytics property (e.g., your website's analytics)
- **Role:** The permission level (Viewer, Analyst, Marketer, or Administrator)

**Minimum Required Role:** Viewer (read-only access)

---

## Find Service Account Email

You need the service account email address to grant access. There are two ways to find it:

### Option A: From Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project from the project dropdown
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Find your service account in the list
5. Copy the email address (e.g., `claude-analytics-mcp@project-id.iam.gserviceaccount.com`)

### Option B: From Credentials JSON File

1. Open your downloaded credentials JSON file
2. Find the `"client_email"` field
3. Copy the email address

**Example:**
```json
{
  "type": "service_account",
  "project_id": "gen-lang-client-0486429536",
  "client_email": "claude-analytics-mcp@gen-lang-client-0486429536.iam.gserviceaccount.com",
  ...
}
```

The email to use is: `claude-analytics-mcp@gen-lang-client-0486429536.iam.gserviceaccount.com`

**Checkpoint:** You have the service account email copied and ready to paste.

---

## Grant Property Access

Now you'll add the service account as a user to your Google Analytics property.

### Step 1: Navigate to Google Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account (must have admin access)
3. You should see your Analytics properties

### Step 2: Access Admin Settings

1. Click the **Admin** icon (⚙️) in the bottom left corner
2. You'll see three columns: Account, Property, and View

### Step 3: Select Property

1. In the **Property** column (middle), select the property you want to grant access to
2. Make sure you've selected the correct property name

### Step 4: Property Access Management

1. In the **Property** column, click **Property Access Management**
2. You'll see a list of current users with access

### Step 5: Add Service Account User

1. Click the **+ (plus)** button in the top right corner
2. Select **Add users**
3. In the dialog that appears:

   **Email addresses:**
   - Paste your service account email
   - Example: `claude-analytics-mcp@project-id.iam.gserviceaccount.com`

   **Roles (select at least one):**
   - ☑️ **Viewer** - Recommended for read-only access
   - ☐ Analyst - If you need to create/edit shared assets
   - ☐ Marketer - If you need to manage campaigns
   - ☐ Administrator - Only if you need full admin access

   **Notify new users by email:**
   - Leave **unchecked** (service accounts don't receive emails)

4. Click **Add** in the top right

**Checkpoint:** You should see the service account email in the user list with the assigned role.

---

## Verify Access

### Visual Verification

In Google Analytics Property Access Management, you should see:
- Service account email in the user list
- Role assigned (e.g., "Viewer")
- Status showing as active

### Test with MCP (Automated by Claude)

Once the MCP configuration is complete, Claude will test the connection by:

1. Fetching account summaries
2. Displaying your Analytics properties
3. Running a simple test query

**Expected output:**
```
Account: Your Account Name (209057426)

Properties:
1. Property Name 1 (288353961)
2. Property Name 2 (350444795)
...
```

If you see your properties listed, access is configured correctly!

### Troubleshooting Verification

**No properties shown:**
- Service account not added to any properties
- Follow steps above to grant access

**Some properties missing:**
- Service account only added to specific properties
- Repeat grant access steps for missing properties

**Permission denied errors:**
- Service account has insufficient role
- Change role to at least "Viewer" in Property Access Management

---

## Multiple Properties

If you have multiple Google Analytics properties, you need to grant access to each one separately.

### Same Service Account for All Properties

**Best Practice:** Use the same service account email for all properties.

**Steps:**
1. Go to Admin → Select first property
2. Property Access Management → Add service account with Viewer role
3. Repeat for each additional property:
   - Select next property
   - Property Access Management → Add same service account email
   - Assign Viewer role
   - Click Add

**Benefits:**
- Single credentials file works for all properties
- One MCP configuration accesses all data
- Easier to manage and audit

### Verify All Properties

After granting access to multiple properties, Claude's test will show all accessible properties:

```
Account: Your Account Name (209057426)

Properties:
1. Website Production (288353961)
2. Website Staging (350444795)
3. Mobile App (401974623)
4. Partner Portal (410404587)
```

All listed properties are accessible via the MCP integration.

---

## Access Levels Explained

### Viewer (Recommended)
**What it allows:**
- Read all reports and data
- View configuration settings
- Export data

**What it doesn't allow:**
- Create or modify reports
- Change property settings
- Manage users

**Use when:**
- You only need to query and analyze data
- This is the most common use case for MCP

### Analyst
**Additional capabilities:**
- Create and edit shared assets (segments, audiences)
- Set up custom reports

**Use when:**
- You need to create custom segments or audiences via MCP

### Marketer
**Additional capabilities:**
- Manage campaign links
- Create marketing campaigns

**Use when:**
- You need to create or modify marketing campaigns

### Administrator
**Full access to:**
- All property settings
- User management
- Data retention settings
- Property deletion

**Use when:**
- You need complete control (rarely necessary for MCP)

**Security note:** Always use the minimum role necessary. For most MCP use cases, **Viewer** is sufficient.

---

## Common Issues

### "User already exists"

**Cause:** Service account already added to this property

**Solution:**
1. Check the user list for the service account email
2. Verify it has the correct role
3. If role is insufficient, click the email → Edit → Change role

### "Invalid email address"

**Cause:** Service account email is incorrect or malformed

**Solution:**
1. Copy email directly from Google Cloud Console or JSON file
2. Ensure no extra spaces or characters
3. Email should end in `.iam.gserviceaccount.com`

### "You don't have permission to add users"

**Cause:** Your Google account lacks admin access to the property

**Solution:**
1. Contact a property administrator
2. Ask them to either:
   - Grant you Administrator role
   - Add the service account for you

### Cannot find "Property Access Management"

**Cause:** Viewing wrong column or old Analytics interface

**Solution:**
1. Ensure you're in the **Property** column (middle column in Admin)
2. If using old Universal Analytics, look for "User Management" instead
3. For GA4 properties, it's called "Property Access Management"

### Service account shows but access still fails

**Cause:** Permissions may take a few minutes to propagate

**Solution:**
1. Wait 2-3 minutes
2. Restart Claude Code
3. Try the connection test again

---

## Removing Access

If you need to revoke service account access:

1. Go to Google Analytics → Admin
2. Select the property
3. Click **Property Access Management**
4. Find the service account email
5. Click the three dots (⋮) on the right
6. Select **Remove access**
7. Confirm removal

**Note:** This immediately revokes access. MCP queries will fail until access is re-granted.

---

## Next Steps

Once you've:
1. ✅ Found your service account email
2. ✅ Granted access to your Analytics properties
3. ✅ Verified the service account appears in the user list

You're ready for:
- **Connection Testing** (automated by Claude)
- Running your first Analytics queries via MCP

---

## Security Considerations

### Audit Access Regularly

Periodically review who has access to your Analytics properties:
1. Go to Property Access Management
2. Review all users (including service accounts)
3. Remove any unused or unknown accounts
4. Verify roles are appropriate

### Principle of Least Privilege

- Start with Viewer role
- Only upgrade if specific features require it
- Document why elevated access is needed

### Monitor Usage

Google Cloud Console shows API usage:
1. APIs & Services → Dashboard
2. Review Analytics Data API calls
3. Investigate unexpected spikes in usage

### Service Account Lifecycle

When you're done with MCP integration:
- Consider keeping access but revoking the key
- Or remove property access entirely
- Delete service account from Google Cloud if no longer needed

This ensures your Analytics data remains secure even if credentials are compromised.
