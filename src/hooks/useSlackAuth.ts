import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useSlackAuth = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: slackToken, isLoading } = useQuery({
    queryKey: ['slackToken', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('slack_tokens')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const connectToSlack = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated')

      const { data, error } = await supabase.functions.invoke('get-slack-auth-url', {
        body: { jwt: session.access_token, return_url: window.location.origin + window.location.pathname },
      })

      if (error) throw error
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    },
  })

  const disconnectFromSlack = useMutation({
    mutationFn: async () => {
      if (!slackToken) return;
      const { error } = await supabase.from('slack_tokens').delete().eq('id', slackToken.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slackToken', user?.id] })
      toast({ title: 'Success', description: 'Disconnected from Slack.' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: `Failed to disconnect: ${error.message}`, variant: 'destructive' })
    },
  })

  const setSelectedChannel = useMutation({
    mutationFn: async ({ channelId, channelName }: { channelId: string; channelName: string }) => {
      if (!slackToken) throw new Error('Not connected to Slack');
      
      const { error } = await supabase
        .from('slack_tokens')
        .update({ selected_channel_id: channelId, selected_channel_name: channelName })
        .eq('id', slackToken.id)
        .select()
        .single()
      
      if (error) {
        console.error("Error updating slack channel:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slackToken', user?.id] });
      toast({ title: 'Success', description: 'Slack channel updated.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: `Failed to update channel: ${error.message}`, variant: 'destructive' });
    },
  })

  return {
    isConnected: !!slackToken,
    isLoading,
    teamName: slackToken?.team_name,
    selectedChannelId: slackToken?.selected_channel_id,
    selectedChannelName: slackToken?.selected_channel_name,
    connect: connectToSlack.mutate,
    disconnect: disconnectFromSlack.mutate,
    setSelectedChannel: setSelectedChannel.mutate,
    isUpdatingChannel: setSelectedChannel.isPending,
  }
}
