
import { useSlackAuth } from '@/hooks/useSlackAuth'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare, Check, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import React from 'react'
import { SlackChannelSelectDialog } from './SlackChannelSelectDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const SlackIntegration = () => {
  const {
    isConnected,
    isLoading,
    teamName,
    connect,
    disconnect,
    selectedChannelName,
    setSelectedChannel,
    isUpdatingChannel,
  } = useSlackAuth()
  const { toast } = useToast()
  const [isSelectChannelOpen, setSelectChannelOpen] = React.useState(false)

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('slack_auth') === 'success') {
      toast({ title: 'Success', description: 'Successfully connected to Slack!' })
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (urlParams.get('error')) {
      toast({
        title: 'Slack Connection Error',
        description: urlParams.get('error_description') || 'An unknown error occurred.',
        variant: 'destructive',
      })
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [toast])

  return (
    <Card className="bg-white border border-slate-200/60 card-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-green-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-green-600" />
          </div>
          Slack Integration
        </CardTitle>
        <CardDescription className="text-slate-600">
          Connect your Slack workspace to receive notifications and sync insights seamlessly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <span className="text-sm text-slate-600">Loading Slack status...</span>
          </div>
        )}
        
        {!isLoading && isConnected && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1 bg-green-500 rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium text-green-800">Connected to Slack</span>
              </div>
              <p className="text-sm text-green-700">
                Workspace: <span className="font-semibold">{teamName}</span>
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Selected channel:</p>
                <p className="font-medium text-slate-900">{selectedChannelName || 'None selected'}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full h-10 border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => setSelectChannelOpen(true)}
                disabled={isUpdatingChannel}
              >
                {isUpdatingChannel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {selectedChannelName ? 'Change Channel' : 'Select Channel'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-10 border-red-200 text-red-600 hover:bg-red-50" 
                onClick={() => disconnect()}
              >
                Disconnect Slack
              </Button>
            </div>
            
            <SlackChannelSelectDialog
              open={isSelectChannelOpen}
              onOpenChange={setSelectChannelOpen}
              onSelectChannel={(channel) => setSelectedChannel({ channelId: channel.id, channelName: channel.name })}
              isUpdatingChannel={isUpdatingChannel}
            />
          </div>
        )}
        
        {!isLoading && !isConnected && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-600 mb-3">
                Connect your Slack workspace to automatically sync meeting insights and receive notifications.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span>Real-time notifications</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span>Automated insights sharing</span>
              </div>
            </div>
            
            <Button 
              className="w-full h-11 gradient-bg text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all" 
              onClick={() => connect()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect to Slack
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
