import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMondayAuth } from "@/hooks/useMondayAuth";
import { useMondayBoards } from "@/hooks/useMondayBoards";
import { 
  Calendar, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  Loader2,
  Plus,
  Monitor,
  Users,
  ChevronRight,
  Settings
} from "lucide-react";

const MondayIntegration = () => {
  const { isConnected, disconnectMonday, getAuthUrl } = useMondayAuth();
  const { boards, accountName, isLoadingBoards, refetchBoards, createItem } = useMondayBoards();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [itemForm, setItemForm] = useState({
    boardId: '',
    groupId: '',
    itemName: '',
    columnValues: {} as Record<string, any>,
  });

  // Enable boards query when connected
  useEffect(() => {
    if (isConnected) {
      refetchBoards();
    }
  }, [isConnected, refetchBoards]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const authData = await getAuthUrl.mutateAsync();
      if (authData?.authUrl && authData?.state) {
        // Store state in localStorage for security verification
        localStorage.setItem('monday_oauth_state', authData.state);
        // Redirect to Monday.com OAuth
        window.location.href = authData.authUrl;
      }
    } catch (error) {
      console.error("Failed to get Monday.com auth URL:", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectMonday.mutateAsync();
      setShowCreateItem(false);
    } catch (error) {
      console.error("Failed to disconnect from Monday.com:", error);
    }
  };

  const handleCreateItem = async () => {
    if (!itemForm.boardId || !itemForm.itemName) {
      return;
    }

    try {
      await createItem.mutateAsync({
        board_id: itemForm.boardId,
        group_id: itemForm.groupId || undefined,
        item_name: itemForm.itemName,
        column_values: Object.keys(itemForm.columnValues).length > 0 ? itemForm.columnValues : undefined,
      });
      
      // Reset form
      setItemForm({
        boardId: '',
        groupId: '',
        itemName: '',
        columnValues: {},
      });
      setShowCreateItem(false);
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  const selectedBoard = boards.find(board => board.id === itemForm.boardId);

  if (!isConnected) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-700 dark:text-blue-300">Monday.com Integration</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Connect your Monday.com account to create and manage items
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Connect Monday.com to:</p>
            <ul className="space-y-1 ml-4">
              <li>• Create items in your boards</li>
              <li>• Update item status and details</li>
              <li>• Access your workspaces and boards</li>
              <li>• Sync with your team's workflow</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 mr-2" />
                Connect Monday.com Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-green-700 dark:text-green-300">Monday.com Connected</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                {accountName && `Connected to ${accountName}`}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchBoards()}
              disabled={isLoadingBoards}
              className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingBoards ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Boards & Items Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              Boards & Items
            </h3>
            <Badge variant="secondary">
              {boards.length} boards available
            </Badge>
          </div>

          {isLoadingBoards ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading boards...</span>
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>No boards found in your Monday.com account.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {boards.slice(0, 5).map((board) => (
                <div
                  key={board.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Monitor className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {board.name}
                      </h4>
                      {board.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {board.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {board.groups.length} groups
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {board.columns.length} columns
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              {boards.length > 5 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    And {boards.length - 5} more boards...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Create Item Section */}
          {!showCreateItem && boards.length > 0 && (
            <Button
              onClick={() => setShowCreateItem(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Item
            </Button>
          )}

          {showCreateItem && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                  Create New Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="board-select">Board *</Label>
                  <Select
                    value={itemForm.boardId}
                    onValueChange={(value) => setItemForm(prev => ({ ...prev, boardId: value, groupId: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boards.map((board) => (
                        <SelectItem key={board.id} value={board.id}>
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBoard && selectedBoard.groups.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="group-select">Group (Optional)</Label>
                    <Select
                      value={itemForm.groupId}
                      onValueChange={(value) => setItemForm(prev => ({ ...prev, groupId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBoard.groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name *</Label>
                  <Input
                    id="item-name"
                    value={itemForm.itemName}
                    onChange={(e) => setItemForm(prev => ({ ...prev, itemName: e.target.value }))}
                    placeholder="Enter item name"
                    className="bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreateItem}
                    disabled={!itemForm.boardId || !itemForm.itemName || createItem.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {createItem.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Item
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateItem(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MondayIntegration; 