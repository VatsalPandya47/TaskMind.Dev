# 🔧 Asana Developer Console Setup Instructions

## Step-by-Step OAuth App Configuration

### **Step 1: Access Asana Developer Console**
1. **Open your browser** and navigate to: https://app.asana.com/0/my-apps
2. **Sign in** with your Asana account credentials
3. You should see the Asana Developer Console dashboard

### **Step 2: Find Your Existing App**
1. **Look for your app** with Client ID: `1210702173912973`
2. **Click on the app name** to open its configuration settings
3. If you don't see the app, it might be under a different account or team

### **Step 3: Configure OAuth Settings**
1. **Find the "OAuth" section** in the app settings
2. **Look for "Redirect URIs" or "OAuth redirect URIs"**
3. **Add the following redirect URI** (copy exactly):
   ```
   http://localhost:8081/asana-callback
   ```
4. **Click "Add" or "Save"** to add this URI to your app

### **Step 4: Verify App Permissions**
Make sure your app has the following scopes/permissions:
- ✅ **Read access to projects**
- ✅ **Read access to tasks** 
- ✅ **Write access to tasks** (to create new tasks)
- ✅ **Read access to workspaces**

### **Step 5: Save Configuration**
1. **Click "Save" or "Update App"** at the bottom of the page
2. **Verify the redirect URI** appears in the list: `http://localhost:8081/asana-callback`

---

## 📋 App Configuration Checklist

- [ ] App found with Client ID: `1210702173912973`
- [ ] Redirect URI added: `http://localhost:8081/asana-callback`
- [ ] Required permissions/scopes enabled
- [ ] Configuration saved successfully

---

## 🎯 Quick Reference

**Your App Details:**
- **Client ID**: `1210702173912973`
- **Redirect URI**: `http://localhost:8081/asana-callback`
- **Your Dev Server**: http://localhost:8081

---

## 🔍 Troubleshooting

### **"App Not Found"**
If you can't find your app:
1. Check if you're signed into the correct Asana account
2. Look under different workspaces/teams
3. Verify the Client ID matches exactly

### **"Permission Denied"**
If you can't edit the app:
1. Make sure you're the app owner
2. Check if you have admin rights in the workspace
3. Contact the app creator if it's shared

### **"Invalid Redirect URI"**
If Asana rejects the redirect URI:
1. Ensure exact match: `http://localhost:8081/asana-callback`
2. No trailing slashes or extra characters
3. Use HTTP (not HTTPS) for localhost
4. Check port number matches your dev server

---

## ✅ After Configuration

Once you've completed the setup:

1. **Test the integration**:
   - Go to: http://localhost:8081
   - Sign into TaskMind
   - Navigate to Settings tab
   - Find "Asana Integration" section
   - Click "Connect Asana Account"

2. **Expected OAuth Flow**:
   - Redirects to Asana authorization page
   - Shows your workspace and permissions
   - Click "Allow" to authorize
   - Redirects back to TaskMind with success

3. **Verify Connection**:
   - Should show "Connected" status
   - Display your Asana workspace name
   - List your available projects
   - Allow task creation

---

**Need help?** If you encounter any issues during setup, let me know what error message or problem you're seeing! 