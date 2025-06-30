import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Brain, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  Clock,
  User,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface AiLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  input_text: string;
  output_text: string;
  processing_time: number;
  tokens_used: number;
  model: string;
  status: 'success' | 'error' | 'processing';
  cost: number;
}

const AdminAiLogDashboard = () => {
  const [logs, setLogs] = useState<AiLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AiLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    successRate: 0,
    averageProcessingTime: 0,
    totalCost: 0,
    totalTokens: 0
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLogs: AiLogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
        user_id: 'user123',
        action: 'summarize_meeting',
        input_text: 'Meeting transcript about Q4 planning...',
        output_text: 'Summary: Q4 planning discussion covered...',
        processing_time: 2.5,
        tokens_used: 1500,
        model: 'gpt-4',
        status: 'success',
        cost: 0.045
      },
      {
        id: '2',
        timestamp: '2024-01-15T09:15:00Z',
        user_id: 'user456',
        action: 'extract_tasks',
        input_text: 'Meeting notes from team sync...',
        output_text: 'Tasks extracted: 1. Review proposal...',
        processing_time: 1.8,
        tokens_used: 1200,
        model: 'gpt-4',
        status: 'success',
        cost: 0.036
      },
      {
        id: '3',
        timestamp: '2024-01-15T08:45:00Z',
        user_id: 'user789',
        action: 'memory_search',
        input_text: 'Search query: previous design decisions',
        output_text: 'Found 3 relevant meetings...',
        processing_time: 0.8,
        tokens_used: 800,
        model: 'gpt-3.5-turbo',
        status: 'success',
        cost: 0.012
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    
    // Calculate stats
    const totalRequests = mockLogs.length;
    const successCount = mockLogs.filter(log => log.status === 'success').length;
    const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;
    const averageProcessingTime = totalRequests > 0 
      ? mockLogs.reduce((sum, log) => sum + log.processing_time, 0) / totalRequests 
      : 0;
    const totalCost = mockLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalTokens = mockLogs.reduce((sum, log) => sum + log.tokens_used, 0);

    setStats({
      totalRequests,
      successRate,
      averageProcessingTime,
      totalCost,
      totalTokens
    });

    setIsLoading(false);
  }, []);

  // Filter logs based on search term and status
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.input_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, statusFilter]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-400/30">Error</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">Processing</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-400/30">Unknown</Badge>;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User ID', 'Action', 'Status', 'Processing Time', 'Tokens Used', 'Cost'],
      ...filteredLogs.map(log => [
        formatTimestamp(log.timestamp),
        log.user_id,
        log.action,
        log.status,
        `${log.processing_time}s`,
        log.tokens_used.toString(),
        `$${log.cost.toFixed(3)}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm">
            <Brain className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Activity Dashboard
            </h2>
            <p className="text-gray-300">
              Monitor AI processing logs, performance metrics, and usage analytics
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportLogs}
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.totalRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Success Rate</p>
                <p className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Avg Processing</p>
                <p className="text-2xl font-bold text-white">{stats.averageProcessingTime.toFixed(1)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border border-orange-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Tokens</p>
                <p className="text-2xl font-bold text-white">{stats.totalTokens.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm border border-red-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Cost</p>
                <p className="text-2xl font-bold text-white">${stats.totalCost.toFixed(3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-blue-400" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by action, user, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'success' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('success')}
                className={statusFilter === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              >
                Success
              </Button>
              <Button
                variant={statusFilter === 'error' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('error')}
                className={statusFilter === 'error' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              >
                Errors
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">AI Processing Logs</CardTitle>
          <CardDescription className="text-gray-300">
            Recent AI activity and processing results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50">
                  <TableHead className="text-gray-300">Timestamp</TableHead>
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Action</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Processing Time</TableHead>
                  <TableHead className="text-gray-300">Tokens</TableHead>
                  <TableHead className="text-gray-300">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-gray-700/30 hover:bg-gray-700/20">
                    <TableCell className="text-gray-300">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {log.user_id}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {log.processing_time}s
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {log.tokens_used.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      ${log.cost.toFixed(3)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No logs found</h3>
              <p className="text-gray-300">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms.' 
                  : 'No AI processing logs available yet.'
                }
        </p>
      </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAiLogDashboard;
