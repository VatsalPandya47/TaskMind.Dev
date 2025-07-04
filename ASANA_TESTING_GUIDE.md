# 🧪 Asana Integration Testing Guide

## ✅ Prerequisites Complete
- ✅ Database migration applied (asana_tokens table created)
- ✅ All Supabase Edge Functions deployed and configured
- ✅ React components and hooks implemented
- ✅ UI integration added to Settings tab
- ✅ Development server compilation fixed and running

## 🚀 Complete Testing Process

### **Step 1: Configure Asana App Settings** ⚙️
**CRITICAL**: You must do this first or OAuth will fail!

1. **Go to Asana Developer Console**:
   - Navigate to: https://app.asana.com/0/my-apps
   - Sign in with your Asana account

2. **Find Your App**:
   - Look for your app with Client ID: `1210702173912973`
   - Click on it to open settings

3. **Add Redirect URI**:
   - Find the "OAuth redirect URIs" section
   - Add: `http://localhost:8081/asana-callback`
   - **Important**: Use exact URL (check port number in your terminal)
   - Save the changes

### **Step 2: Access Your App** 🌐
1. **Open the application**:
   - Your dev server should be running at: http://localhost:8081
   - (Check your terminal for the exact port)

2. **Sign in or create account**:
   - Use your existing TaskMind account
   - Or create a new account if needed

### **Step 3: Navigate to Settings** ⚙️
1. **Find the Settings tab**:
   - Look for "Settings" in your navigation menu
   - Click to open the settings page

2. **Locate Asana Integration**:
   - Scroll down to find "Asana Integration" section
   - Should have orange/red gradient styling

### **Step 4: Test OAuth Connection** 🔗

#### **Disconnected State Should Show**:
- ✅ "Connect Asana Account" button with orange gradient
- ✅ Asana logo and description
- ✅ Clear call-to-action text

#### **Click "Connect Asana Account"**:
1. **Expected: Redirect to Asana**
   - Browser should redirect to `app.asana.com`
   - You'll see Asana's OAuth authorization page
   - Should show your workspace name
   - Will ask permission to access projects and tasks

2. **Authorize the App**:
   - Click "Allow" to grant permissions
   - This authorizes TaskMind to access your Asana data

3. **Expected: Redirect Back**:
   - Should automatically redirect to: `http://localhost:8081/asana-callback`
   - You'll see a brief loading state
   - Then redirect back to Settings page

### **Step 5: Verify Connected State** ✅

#### **Connected State Should Show**:
- ✅ Green checkmark indicating connection
- ✅ Your Asana workspace name displayed
- ✅ "Projects & Tasks" section appears
- ✅ "Create Task" button available
- ✅ "Disconnect" button available
- ✅ Project count (e.g., "5 projects available")

### **Step 6: Test Project Loading** 📂

#### **Projects List Should Display**:
- ✅ Up to 10 of your Asana projects listed
- ✅ Each project shows name and description (if available)
- ✅ "+" button next to each project
- ✅ Scrollable list if you have many projects

#### **If No Projects Show**:
- Check that you have projects in your Asana workspace
- Verify you have proper access permissions
- Check browser console for any errors

### **Step 7: Test Task Creation** ✏️

#### **Open Task Creation Form**:
1. **Click "Create Task" button**
   - Form should expand below
   - Shows fields for project, name, notes, due date

#### **Fill Out Task Details**:
1. **Select Project** (required):
   - Dropdown should show all your projects
   - Select any project you want to test with

2. **Enter Task Name** (required):
   - Type something like: "Test task from TaskMind"

3. **Add Notes** (optional):
   - Add: "This is a test task created through OAuth integration"

4. **Set Due Date** (optional):
   - Pick any future date

#### **Create the Task**:
1. **Click "Create Task" button**
   - Should show loading spinner
   - Button text changes to "Creating..."

2. **Expected Results**:
   - ✅ Success message appears
   - ✅ Form resets/clears
   - ✅ Task created in your Asana project

#### **Verify in Asana**:
1. **Open Asana in another tab**
2. **Navigate to the project you selected**
3. **Look for your test task**
   - Should appear with the name you entered
   - Notes should match what you typed
   - Due date should be set if you provided one

### **Step 8: Test Disconnect** 🔌

#### **Click "Disconnect" button**:
1. **Expected Behavior**:
   - ✅ Shows loading state briefly
   - ✅ Returns to disconnected state
   - ✅ Projects list disappears
   - ✅ "Connect Asana Account" button reappears

#### **Verify Disconnection**:
- Token should be removed from database
- Subsequent API calls should fail (expected)
- Can reconnect by clicking connect again

## 🔍 Troubleshooting Common Issues

### **OAuth Redirect Fails**
**Problem**: Gets stuck on Asana page or shows error
**Solutions**:
- Check redirect URI in Asana app settings
- Ensure exact match: `http://localhost:8081/asana-callback`
- Verify port number matches your dev server
- Clear browser cache and try again

### **"Unauthorized" Errors**
**Problem**: API calls return 401 errors
**Solutions**:
- Check if you're logged into TaskMind
- Verify Supabase authentication is working
- Check browser network tab for auth headers
- Try refreshing the page

### **Projects Don't Load**
**Problem**: Connected but no projects show
**Solutions**:
- Verify you have projects in Asana workspace
- Check if you have access permissions
- Look at browser console for errors
- Try disconnecting and reconnecting

### **Task Creation Fails**
**Problem**: Error when creating tasks
**Solutions**:
- Ensure you have write permissions in the project
- Check that project still exists
- Verify all required fields are filled
- Check network tab for API error details

## 🎯 Expected User Experience

### **Smooth Flow**:
1. One-click OAuth connection
2. Immediate project listing
3. Intuitive task creation form
4. Real-time feedback and loading states
5. Clear success/error messaging

### **Visual Indicators**:
- Orange/red gradients for Asana branding
- Loading spinners during operations
- Success messages for completed actions
- Error messages with helpful information

## 📋 Final Testing Checklist

- [ ] Asana app redirect URI configured correctly
- [ ] Can access TaskMind app at localhost
- [ ] Settings page loads without errors
- [ ] Asana Integration section is visible
- [ ] OAuth flow completes successfully
- [ ] Connected state shows workspace and projects
- [ ] Can create tasks with all field types
- [ ] Tasks appear in Asana workspace
- [ ] Can disconnect and reconnect
- [ ] Error handling works appropriately

## 🎉 Success Criteria

**Integration is working correctly if**:
✅ OAuth flow completes without errors
✅ Projects load from your Asana workspace  
✅ Tasks can be created and appear in Asana
✅ UI provides clear feedback throughout
✅ Connection state persists between page refreshes
✅ Disconnect/reconnect cycle works properly

---

**Ready to test?** Start with Step 1 and work through each section systematically. The integration should provide a seamless experience connecting TaskMind with your Asana workspace! 🚀 