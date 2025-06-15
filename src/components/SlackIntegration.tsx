
import { useSlackAuth } from '@/hooks/useSlackAuth'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare } from 'lucide-react'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-700" />
          Slack Integration
        </CardTitle>
        <CardDescription>
          Connect your Slack account to receive notifications and sync insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading Slack status...</span>
          </div>
        )}
        {!isLoading && isConnected && (
          <div className="text-sm space-y-2">
            <p className="text-gray-600">
              Connected to Slack: <span className="font-medium text-gray-900">{teamName}</span>
            </p>
            <div className="space-y-1">
              <p className="text-gray-600">
                Selected channel: <span className="font-medium text-gray-900">{selectedChannelName || 'None'}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectChannelOpen(true)}
                disabled={isUpdatingChannel}
              >
                {isUpdatingChannel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {selectedChannelName ? 'Change Channel' : 'Select Channel'}
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => disconnect()}>
              Disconnect Slack
            </Button>
            <SlackChannelSelectDialog
              open={isSelectChannelOpen}
              onOpenChange={setSelectChannelOpen}
              onSelectChannel={(channel) => setSelectedChannel({ channelId: channel.id, channelName: channel.name })}
              isUpdatingChannel={isUpdatingChannel}
            />
          </div>
        )}
        {!isLoading && !isConnected && (
          <div className="text-sm space-y-2">
            <p className="text-gray-600">Connect to Slack to sync insights.</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => connect()}>
                Connect to Slack
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
