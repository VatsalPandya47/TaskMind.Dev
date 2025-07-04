import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTrelloAuth } from "@/hooks/useTrelloAuth";
import { useTrelloBoards } from "@/hooks/useTrelloBoards";
import { 
  Trello, 
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
  Target,
  Key,
  Eye,
  EyeOff
} from "lucide-react";

const TrelloIntegration = () => {
  const { isConnected, disconnectTrello, saveCredentials } = useTrelloAuth();
  const { boards, user, isLoadingBoards, refetchBoards, getBoardLists, createCard } = useTrelloBoards();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showToken, setShowToken] = useState(false);
  
  const [credentialsForm, setCredentialsForm] = useState({
    apiKey: '',
    token: '',
  });

  const [selectedBoard, setSelectedBoard] = useState('');
  const [boardLists, setBoardLists] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const [cardForm, setCardForm] = useState({
    listId: '',
    name: '',
    desc: '',
    due: '',
  });

  // Enable boards query when connected
  useEffect(() => {
    if (isConnected) {
      refetchBoards();
    }
  }, [isConnected, refetchBoards]);

  const handleConnect = async () => {
    if (!credentialsForm.apiKey || !credentialsForm.token) {
      return;
    }

    setIsConnecting(true);
    try {
      await saveCredentials.mutateAsync({
        apiKey: credentialsForm.apiKey,
        token: credentialsForm.token,
      });
      
      // Reset form
      setCredentialsForm({
        apiKey: '',
        token: '',
      });
      setShowCredentials(false);
    } catch (error) {
      console.error("Failed to connect to Trello:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectTrello.mutateAsync();
      setShowCreateCard(false);
      setSelectedBoard('');
      setBoardLists([]);
    } catch (error) {
      console.error("Failed to disconnect from Trello:", error);
    }
  };

  const handleBoardChange = async (boardId: string) => {
    setSelectedBoard(boardId);
    setCardForm(prev => ({ ...prev, listId: '' }));
    
    if (boardId) {
      setLoadingLists(true);
      try {
        const result = await getBoardLists.mutateAsync(boardId);
        setBoardLists(result.lists || []);
      } catch (error) {
        console.error("Failed to fetch board lists:", error);
        setBoardLists([]);
      } finally {
        setLoadingLists(false);
      }
    } else {
      setBoardLists([]);
    }
  };

  const handleCreateCard = async () => {
    if (!cardForm.listId || !cardForm.name) {
      return;
    }

    try {
      await createCard.mutateAsync({
        listId: cardForm.listId,
        name: cardForm.name,
        desc: cardForm.desc || undefined,
        due: cardForm.due || undefined,
      });
      
      // Reset form
      setCardForm({
        listId: '',
        name: '',
        desc: '',
        due: '',
      });
      setShowCreateCard(false);
      setSelectedBoard('');
      setBoardLists([]);
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm">
          <Trello className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Trello Integration
          </h2>
          <p className="text-gray-300">
            Connect your Trello account to create cards and manage boards
          </p>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              Not Connected
            </CardTitle>
            <CardDescription className="text-gray-300">
              Connect your Trello account to start creating cards and managing boards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                <h4 className="font-medium text-white mb-2">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Create cards in any board
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Access to all your boards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Set due dates and descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Streamlined task management
                  </li>
                </ul>
              </div>
              
              <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Trello className="h-4 w-4 mr-2" />
                    Connect Trello Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Connect to Trello</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Enter your Trello API key and token to connect your account.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      To connect Trello, you'll need your API credentials from Trello's developer portal.
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">📋 Quick Setup Guide:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Visit <a href="https://trello.com/app-key" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">trello.com/app-key</a></li>
                        <li>2. Copy your API Key</li>
                        <li>3. Click "Token" to generate a token (choose "Never" for expiration)</li>
                        <li>4. Paste both values below</li>
                      </ol>
                      <p className="text-xs text-blue-600 mt-2">
                        💡 This is a one-time setup that takes about 2 minutes
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="text-white">API Key</Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showApiKey ? "text" : "password"}
                          value={credentialsForm.apiKey}
                          onChange={(e) => setCredentialsForm(prev => ({ ...prev, apiKey: e.target.value }))}
                          placeholder="Enter your Trello API key"
                          className="bg-gray-700 border-gray-600 text-white pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="token" className="text-white">Token</Label>
                      <div className="relative">
                        <Input
                          id="token"
                          type={showToken ? "text" : "password"}
                          value={credentialsForm.token}
                          onChange={(e) => setCredentialsForm(prev => ({ ...prev, token: e.target.value }))}
                          placeholder="Enter your Trello token"
                          className="bg-gray-700 border-gray-600 text-white pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowToken(!showToken)}
                        >
                          {showToken ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowCredentials(false)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConnect}
                        disabled={isConnecting || !credentialsForm.apiKey || !credentialsForm.token}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Connected State */
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>Boards & Cards</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateCard(!showCreateCard)}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Card
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={disconnectTrello.isPending}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  {disconnectTrello.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Disconnect"
                  )}
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              {user?.username && `@${user.username} • `}
              {boards.length} boards available
            </CardDescription>
          </CardHeader>
          
          {showCreateCard && (
            <CardContent className="border-t border-gray-700/50">
              <div className="space-y-4 pt-4">
                <h4 className="text-lg font-medium text-white mb-4">Create New Card</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="board" className="text-white">Board</Label>
                    <Select value={selectedBoard} onValueChange={handleBoardChange}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="list" className="text-white">List</Label>
                    <Select 
                      value={cardForm.listId} 
                      onValueChange={(value) => setCardForm(prev => ({ ...prev, listId: value }))}
                      disabled={!selectedBoard || loadingLists}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder={loadingLists ? "Loading lists..." : "Select a list"} />
                      </SelectTrigger>
                      <SelectContent>
                        {boardLists.map((list) => (
                          <SelectItem key={list.id} value={list.id}>
                            {list.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-white">Card Name *</Label>
                  <Input
                    id="cardName"
                    value={cardForm.name}
                    onChange={(e) => setCardForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter card name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardDesc" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="cardDesc"
                    value={cardForm.desc}
                    onChange={(e) => setCardForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Enter card description"
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardDue" className="text-white">Due Date (Optional)</Label>
                  <Input
                    id="cardDue"
                    type="date"
                    value={cardForm.due}
                    onChange={(e) => setCardForm(prev => ({ ...prev, due: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateCard(false);
                      setCardForm({ listId: '', name: '', desc: '', due: '' });
                      setSelectedBoard('');
                      setBoardLists([]);
                    }}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCard}
                    disabled={createCard.isPending || !cardForm.listId || !cardForm.name}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {createCard.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Card
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
          
          {!showCreateCard && boards.length > 0 && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.slice(0, 6).map((board) => (
                  <div
                    key={board.id}
                    className="p-4 bg-gradient-to-br from-gray-700/50 to-gray-600/30 rounded-lg border border-gray-600/50 hover:border-blue-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white truncate">{board.name}</h4>
                      {board.pinned && (
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-400/30 text-xs">
                          Pinned
                        </Badge>
                      )}
                    </div>
                    {board.desc && (
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{board.desc}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(board.url, '_blank')}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50 text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {boards.length > 6 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Showing 6 of {boards.length} boards
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default TrelloIntegration; 