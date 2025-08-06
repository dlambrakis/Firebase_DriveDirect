import { Link } from 'react-router-dom';
import { useAuth, useConversations } from '@directdrive/hooks';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@directdrive/ui';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '@directdrive/core-types';

const RecentConversationsSection = () => {
  const { user } = useAuth();
  // Assuming user.id is the string UUID from Supabase auth.
  // The useConversations hook should handle converting this to a number if needed.
  const { data: conversations, isLoading } = useConversations(user?.id, {
    limit: 5,
  });

  const getInitials = (name?: string | null) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Messages</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/messages">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations && conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((convo: Conversation) => {
              // Logic to determine the 'other' participant needs to be based on the conversation details view
              // This is a placeholder until the detailed conversation type is used.
              const otherParticipantName = 'Other User';
              const otherParticipantAvatar = '';

              return (
                <Link
                  key={convo.id}
                  to={`/messages/${convo.public_id}`}
                  className="flex items-center p-2 -m-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={otherParticipantAvatar || undefined}
                      alt={otherParticipantName}
                    />
                    <AvatarFallback>
                      {getInitials(otherParticipantName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 overflow-hidden">
                    <p className="text-sm font-medium leading-none truncate">
                      {otherParticipantName}
                    </p>
                    {/* The base 'conversations' table doesn't have last message content.
                        This would come from a detailed view or a related table. */}
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      ...
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(convo.updated_at), {
                      addSuffix: true,
                    })}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent conversations.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentConversationsSection;
