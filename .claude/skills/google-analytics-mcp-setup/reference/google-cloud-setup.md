# Google Cloud Service Account Setup

This guide walks through creating a Google Cloud service account for Google Analytics API access.

## Table of Contents
1. [Create or Select Project](#create-or-select-project)
2. [Enable Required APIs](#enable-required-apis)
3. [Create Service Account](#create-service-account)
4. [Generate Credentials](#generate-credentials)
5. [Verification](#verification)

---

## Create or Select Project

### Option A: Use Existing Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown in the top navigation bar
3. Select your existing project
4. Note the **Project ID** (you'll need this later)
5. Skip to [Enable Required APIs](#enable-required-apis)

### Option B: Create New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown in the top navigation bar
3. Click **"New Project"** in the top right of the dialog
4. Fill in project details:
   - **Project name:** Choose a descriptive name (e.g., "Analytics MCP")
   - **Organization:** Select if applicable (can leave as "No organization")
   - **Location:** Leave default unless you have specific requirements
5. Click **"Create"**
6. Wait for project creation (usually takes 10-30 seconds)
7. Once created, click **"Select Project"** in the notification
8. Note the **Project ID** shown in the project info section

**Checkpoint:** You should see your project name in the top navigation bar.

---

## Enable Required APIs

The Google Analytics Data API must be enabled for your project.

1. In your Google Cloud project, open the navigation menu (☰)
2. Navigate to **"APIs & Services"** → **"Library"**
3. In the search bar, type: `Google Analytics Data API`
4. Click on **"Google Analytics Data API"** from the results
5. Click the **"Enable"** button
6. Wait for the API to be enabled (usually instant)

**Optional but recommended - Enable Admin API:**

7. Return to the API Library (back button or search again)
8. Search for: `Google Analytics Admin API`
9. Click on **"Google Analytics Admin API"**
10. Click **"Enable"**

**Checkpoint:** You should see "API enabled" with a green checkmark. The page will show quota and usage information.

---

## Create Service Account

Service accounts are special Google accounts that applications use for authentication.

### Step 1: Navigate to Service Accounts

1. Open the navigation menu (☰)
2. Go to **"IAM & Admin"** → **"Service Accounts"**
3. You should see a list of service accounts (may be empty if none exist yet)

### Step 2: Create Service Account

1. Click **"+ Create Service Account"** at the top
2. Fill in the service account details:

   **Service account details (Step 1 of 3):**
   - **Service account name:** Choose a descriptive name (e.g., "Claude Analytics MCP")
   - **Service account ID:** Auto-generated (you can customize if desired)
   - **Description:** Optional (e.g., "Service account for Claude Code MCP integration")

3. Click **"Create and Continue"**

   **Grant access to project (Step 2 of 3):**
   - **Select a role:** This step is optional for our use case
   - You can click **"Continue"** without selecting a role
   - (Analytics access is granted at the property level, not project level)

4. Click **"Continue"**

   **Grant users access (Step 3 of 3):**
   - This step is optional - leave blank

5. Click **"Done"**

**Checkpoint:** You should see your new service account in the list with an email like:
`service-account-name@project-id.iam.gserviceaccount.com`

---

## Generate Credentials

Now you need to create and download the credentials JSON file.

### Step 1: Create Key

1. In the Service Accounts list, click on your service account's email
2. Navigate to the **"Keys"** tab at the top
3. Click **"Add Key"** dropdown → **"Create new key"**
4. Select key type: **JSON** (should be selected by default)
5. Click **"Create"**

### Step 2: Download and Save

1. A JSON file will automatically download to your Downloads folder
2. The file name will be something like: `project-id-xxxxxxxxxxxx.json`
3. **Move this file to a secure location:**

   **Recommended locations:**
   - Project directory: `your-project/credentials/google-analytics-sa.json`
   - Home directory: `~/.config/google-analytics/credentials.json`
   - Any secure location NOT in version control

   **Example command to move file:**
   ```bash
   mkdir -p ~/your-project/credentials
   mv ~/Downloads/project-id-xxxxxxxxxxxx.json ~/your-project/credentials/google-analytics-sa.json
   ```

4. **Important:** Add this location to your `.gitignore` if using version control:
   ```
   credentials/
   *.json
   ```

### Step 3: Note the Service Account Email

You'll need the service account email for the next step (granting Analytics access).

**Option A: Copy from Console**
- In the Service Accounts list, copy the email address

**Option B: Extract from JSON file**
- Open the downloaded JSON file
- Find the `"client_email"` field
- Copy the email address (e.g., `claude-analytics-mcp@project-id.iam.gserviceaccount.com`)

**Checkpoint:** You should have:
1. JSON credentials file saved securely
2. Service account email copied/noted
3. Project ID noted

---

## Verification

### Verify JSON File Contents

The credentials JSON should contain these fields:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "...",
  "universe_domain": "googleapis.com"
}
```

**What to check:**
- `"type"` is `"service_account"`
- `"project_id"` matches your Google Cloud project
- `"client_email"` contains your service account email
- `"private_key"` is present and starts with `-----BEGIN PRIVATE KEY-----`

### Common Issues

**"Cannot create key" error:**
- Your Google account may lack permissions to create service accounts
- Contact your Google Cloud organization admin

**Downloaded file is not JSON:**
- Ensure you selected "JSON" (not P12) when creating the key
- Delete the key and create a new one

**File downloaded but can't find it:**
- Check your Downloads folder
- Check browser download settings
- Some browsers may block downloads - check browser notifications

**Multiple JSON files in Downloads:**
- Use the most recently downloaded one
- Each key creation downloads a new file
- Old keys remain valid unless revoked

---

## Next Steps

Once you have:
1. ✅ Google Cloud project created/selected
2. ✅ Google Analytics Data API enabled
3. ✅ Service account created
4. ✅ Credentials JSON downloaded and saved securely
5. ✅ Service account email noted

You're ready to proceed to:
- **MCP Configuration** (automated by Claude)
- **Analytics Access Setup** (see `analytics-access.md`)

---

## Security Best Practices

### Do:
- Store credentials outside version control
- Use restrictive file permissions (chmod 600)
- Rotate keys periodically (create new key, update config, delete old key)
- Grant minimum necessary permissions (Viewer role for read-only access)
- Use separate service accounts for different applications

### Don't:
- Commit credentials to Git repositories
- Share credentials via email or messaging
- Use same service account across unrelated projects
- Grant Owner or Editor roles unless necessary
- Leave unused service accounts/keys active

### If Credentials Are Compromised:

1. Go to Service Accounts in Google Cloud Console
2. Click on the compromised service account
3. Go to the "Keys" tab
4. Find the compromised key and click the three dots (⋮)
5. Click **"Delete"** to revoke the key immediately
6. Create a new key following the steps above
7. Update your `.mcp.json` configuration with the new credentials path
8. Review Analytics property access and remove if necessary
