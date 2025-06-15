
import { useSlackAuth } from '@/hooks/useSlackAuth'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import React from 'react'

export const SlackIntegration = () => {
  const { isConnected, isLoading, teamName, connect, disconnect } = useSlackAuth()
  const { toast } = useToast()

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

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading Slack status...</span>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="text-sm space-y-2">
        <p className="text-gray-600">
          Connected to Slack: <span className="font-medium text-gray-900">{teamName}</span>
        </p>
        <Button variant="outline" size="sm" className="w-full" onClick={() => disconnect()}>
          Disconnect Slack
        </Button>
      </div>
    )
  }

  return (
    <div className="text-sm space-y-2">
        <p className="text-gray-600">Connect to Slack to sync insights.</p>
        <Button variant="outline" size="sm" className="w-full" onClick={() => connect()}>
            Connect to Slack
        </Button>
    </div>
  )
}
