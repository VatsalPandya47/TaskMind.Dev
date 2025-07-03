import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAsanaAuth } from "@/hooks/useAsanaAuth";
import { useAsanaProjects } from "@/hooks/useAsanaProjects";
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  TrendingUp,
  FileText,
  Plus,
  Target
} from "lucide-react";

const AsanaIntegration = () => {
  const { isConnected, disconnectAsana, getAuthUrl } = useAsanaAuth();
  const { projects, workspace, isLoadingProjects, refetchProjects, createTask } = useAsanaProjects();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    projectId: '',
    name: '',
    notes: '',
    due_on: '',
  });

  // Enable projects query when connected
  useEffect(() => {
    if (isConnected) {
      refetchProjects();
    }
  }, [isConnected, refetchProjects]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const authData = await getAuthUrl.mutateAsync();
      if (authData?.authUrl && authData?.state) {
        // Store state in localStorage for security verification
        localStorage.setItem('asana_oauth_state', authData.state);
        // Redirect to Asana OAuth
        window.location.href = authData.authUrl;
      }
    } catch (error) {
      console.error("Failed to get Asana auth URL:", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsana.mutateAsync();
      setShowCreateTask(false);
    } catch (error) {
      console.error("Failed to disconnect from Asana:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!taskForm.projectId || !taskForm.name) {
      return;
    }

    try {
      await createTask.mutateAsync({
        projectId: taskForm.projectId,
        name: taskForm.name,
        notes: taskForm.notes || undefined,
        due_on: taskForm.due_on || undefined,
      });
      
      // Reset form
      setTaskForm({
        projectId: '',
        name: '',
        notes: '',
        due_on: '',
      });
      setShowCreateTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl backdrop-blur-sm">
            <CheckSquare className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Asana Integration
            </h2>
            <p className="text-gray-300">
              Connect your Asana account to create tasks and manage projects
            </p>
          </div>
        </div>
        
        {isConnected && (
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchProjects()}
              disabled={isLoadingProjects}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              {isLoadingProjects ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              Not Connected
            </CardTitle>
            <CardDescription className="text-gray-300">
              Connect your Asana account to start creating tasks and managing projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20">
                <h4 className="font-medium text-white mb-2">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Create tasks in any project
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Access to all your workspaces
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Set due dates and assignees
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Streamlined task management
                  </li>
                </ul>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Connect Asana Account
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Connected State - Projects and Task Creation */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Projects & Tasks</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateTask(!showCreateTask)}
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Task
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={disconnectAsana.isPending}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    {disconnectAsana.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-gray-300">
                {workspace?.name && `Workspace: ${workspace.name} • `}
                {projects.length} projects available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Create Task Form */}
              {showCreateTask && (
                <div className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 mb-6 space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-400" />
                    Create New Task
                  </h4>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="project" className="text-gray-300">Project</Label>
                      <Select 
                        value={taskForm.projectId} 
                        onValueChange={(value) => setTaskForm(prev => ({ ...prev, projectId: value }))}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {projects.map((project) => (
                            <SelectItem key={project.gid} value={project.gid} className="text-white hover:bg-gray-700">
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="taskName" className="text-gray-300">Task Name</Label>
                      <Input
                        id="taskName"
                        value={taskForm.name}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter task name"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="taskNotes" className="text-gray-300">Notes (optional)</Label>
                      <Textarea
                        id="taskNotes"
                        value={taskForm.notes}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add task description or notes"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dueDate" className="text-gray-300">Due Date (optional)</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={taskForm.due_on}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, due_on: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      onClick={handleCreateTask}
                      disabled={!taskForm.projectId || !taskForm.name || createTask.isPending}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      {createTask.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Task
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateTask(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              {projects.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-400" />
                    Available Projects
                  </h4>
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {projects.slice(0, 10).map((project) => (
                      <div
                        key={project.gid}
                        className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-3 hover:bg-gray-600/30 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-white mb-1 truncate">
                              {project.name}
                            </h5>
                            {project.notes && (
                              <p className="text-sm text-gray-400 truncate">
                                {project.notes}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTaskForm(prev => ({ ...prev, projectId: project.gid }))}
                            className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No projects found in your workspace</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Make sure you have access to projects in Asana
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AsanaIntegration; 