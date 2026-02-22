---
name: google-analytics-mcp-setup
description: "Sets up Google Analytics MCP integration for Claude Code on macOS from scratch. Automates local dependencies (Python, pipx) and provides step-by-step guidance for Google Cloud service account creation and Analytics access permissions. Use when setting up Google Analytics MCP on a new Mac or troubleshooting MCP connection issues."
---

# Google Analytics MCP Setup

## Purpose
This skill guides you through the complete setup process for connecting Google Analytics to Claude Code via the Model Context Protocol (MCP) on macOS. It automates local environment setup and provides detailed instructions for configuring Google Cloud credentials and Analytics access.

## When to Use This Skill
- Setting up Google Analytics MCP on a new Mac with only Claude Code installed
- Troubleshooting broken MCP connections to Google Analytics
- Reconfiguring Analytics access with a new service account
- Understanding what's needed for Google Analytics MCP integration

## Prerequisites
- macOS computer
- Claude Code installed
- Admin access to your Google Analytics account
- Ability to create Google Cloud projects (or access to existing project)

## Workflow Overview

The setup process follows these stages:

### Stage 1: Automated Local Environment Setup
1. Verify system requirements
2. Install Homebrew (if not present)
3. Install pyenv and Python
4. Install pipx
5. Verify installations

### Stage 2: Google Cloud Service Account Setup (Manual)
6. Create or select Google Cloud project
7. Enable required APIs
8. Create service account
9. Generate and download credentials JSON file

Detailed steps: See `reference/google-cloud-setup.md`

### Stage 3: MCP Configuration (Automated)
10. Create `.mcp.json` configuration file
11. Configure Google Analytics MCP server with credentials

### Stage 4: Google Analytics Access (Manual)
12. Grant service account access to Analytics properties

Detailed steps: See `reference/analytics-access.md`

### Stage 5: Verification (Automated)
13. Test MCP connection
14. Verify access to Analytics properties
15. Run sample query

## How Claude Uses This Skill

When you activate this skill, Claude will:

1. **Ask for your project directory** - Where to set up the configuration
2. **Run automated setup** - Install dependencies and verify installations
3. **Guide you through Google Cloud** - Provide step-by-step instructions with verification checkpoints
4. **Create configuration files** - Generate `.mcp.json` with your settings
5. **Guide Analytics access** - Walk through granting permissions
6. **Test everything** - Verify the connection works end-to-end

### Interactive Checkpoints

Claude will pause at key steps to:
- Verify manual steps completed successfully
- Confirm file locations and credentials
- Test connections before proceeding
- Troubleshoot any issues encountered

## Expected Outputs

By the end of this setup, you will have:

1. **Dependencies installed:**
   - Homebrew
   - pyenv with Python 3.9+
   - pipx

2. **Google Cloud resources:**
   - Service account with Analytics API access
   - Credentials JSON file downloaded locally

3. **Configuration files:**
   - `.mcp.json` in your project directory
   - Properly configured Google Analytics MCP server

4. **Working connection:**
   - Ability to query Google Analytics data via MCP
   - Service account with Viewer access to your properties

## Execution Steps

### Step 1: Initialize Setup

Claude will ask:
- Where to create the `.mcp.json` file (project directory)
- Whether to use existing Google Cloud project or create new one

### Step 2: Install Local Dependencies

Claude automatically runs:
```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install pyenv
brew install pyenv

# Install Python
pyenv install 3.11.0
pyenv global 3.11.0

# Install pipx
brew install pipx
pipx ensurepath
```

Verification: Claude checks each installation succeeded before proceeding.

### Step 3: Google Cloud Setup

Claude provides detailed instructions from `reference/google-cloud-setup.md`:
- Creating/selecting project
- Enabling Google Analytics Data API
- Creating service account
- Downloading credentials JSON

**Checkpoint:** Claude verifies you have the credentials JSON file and it's valid.

### Step 4: Configure MCP

Claude automatically creates `.mcp.json` using `templates/mcp-config-template.json`:
- Prompts for credentials file path
- Prompts for Google Cloud project ID
- Generates configuration file
- Validates JSON structure

### Step 5: Grant Analytics Access

Claude provides detailed instructions from `reference/analytics-access.md`:
- Finding service account email in credentials JSON
- Adding service account to Google Analytics
- Selecting appropriate role (minimum: Viewer)

**Checkpoint:** Claude verifies the service account email was added correctly.

### Step 6: Test Connection

Claude automatically:
1. Attempts to fetch account summaries via MCP
2. Displays your Analytics accounts and properties
3. Runs a simple test query
4. Confirms everything is working

If any step fails, Claude refers to `reference/troubleshooting.md`.

## Key Information

### Service Account vs OAuth

This setup uses **service account authentication** (not OAuth):
- More suitable for automated/programmatic access
- No browser-based login required
- Requires manual permission grants in Analytics
- Credentials stored in JSON file

### Security Considerations

The credentials JSON file contains sensitive information:
- Store it securely (outside version control)
- Don't share or commit to repositories
- Consider using environment variables for the path
- Limit service account permissions to minimum needed

### File Locations

Recommended structure:
```
your-project/
├── .mcp.json                          # MCP configuration
├── credentials/
│   └── google-analytics-sa.json      # Service account credentials
└── .gitignore                         # Add credentials/ to this
```

### Multiple Analytics Properties

One service account can access multiple Analytics properties:
- Add the same service account email to each property
- Access is granted per-property in Analytics UI
- No changes needed to MCP configuration

## Troubleshooting Quick Reference

Common issues and solutions:

**"No accounts found"**
→ Service account not added to Analytics properties
→ See `reference/analytics-access.md`

**"Permission denied"**
→ Service account lacks proper role in Analytics
→ Minimum role required: Viewer

**"Python not found"**
→ Shell not reloaded after pyenv installation
→ Run: `eval "$(pyenv init -)"`

**"Invalid credentials"**
→ Check JSON file path in `.mcp.json`
→ Verify JSON file format is valid

For detailed troubleshooting: See `reference/troubleshooting.md`

## Reference Files

- `reference/google-cloud-setup.md` - Complete Google Cloud Console walkthrough
- `reference/analytics-access.md` - Step-by-step Analytics permission granting
- `reference/troubleshooting.md` - Common issues and solutions
- `templates/mcp-config-template.json` - MCP configuration template

## Notes

- This skill is designed for macOS; Linux setup would be similar but Windows differs significantly
- Python 3.9+ required (skill installs 3.11 by default)
- Internet connection required for package installations and API calls
- Estimated setup time: 15-20 minutes (depending on manual steps)
