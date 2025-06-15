
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type Channel = {
  id: string
  name: string
}

const fetchSlackChannels = async () => {
  const { data, error } = await supabase.functions.invoke('get-slack-channels')
  if (error) throw new Error(error.message)
  return data.channels
}

interface SlackChannelSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectChannel: (channel: Channel) => void
  isUpdatingChannel: boolean
}

export const SlackChannelSelectDialog: React.FC<SlackChannelSelectDialogProps> = ({
  open,
  onOpenChange,
  onSelectChannel,
  isUpdatingChannel,
}) => {
  const { data: channels, isLoading, error } = useQuery<Channel[]>({
    queryKey: ['slackChannels'],
    queryFn: fetchSlackChannels,
    enabled: open, // Only fetch when the dialog is open
  })

  const handleSelect = (channel: Channel) => {
    onSelectChannel(channel)
  }

  React.useEffect(() => {
    if (!isUpdatingChannel) {
        onOpenChange(false)
    }
  }, [isUpdatingChannel, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Slack Channel</DialogTitle>
          <DialogDescription>
            Choose a public channel to send notifications and summaries to.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {channels && (
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleSelect(channel)}
                    disabled={isUpdatingChannel}
                  >
                    {isUpdatingChannel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `# ${channel.name}`}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
