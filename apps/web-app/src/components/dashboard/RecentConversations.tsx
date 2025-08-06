import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@directdrive/ui';
import { RecentConversation } from '@directdrive/core-types';
import { formatDistanceToNow } from 'date-fns';

interface RecentConversationsProps {
  conversations: RecentConversation[];
}

const RecentConversations: React.FC<RecentConversationsProps> = ({
  conversations,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Messages</CardTitle>
        <Button asChild variant="link" className="text-sm">
          <Link to="/messages">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <Link
                // Corrected to use 'conversation_id'
                to={`/messages/${convo.conversation_id}`}
                key={convo.conversation_id}
                className="flex items-start space-x-4 group"
              >
                <Avatar>
                  <AvatarImage
                    src={convo.other_participant_avatar_url || undefined}
                    alt={convo.other_participant_name || 'User'}
                  />
                  <AvatarFallback>
                    {convo.other_participant_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                      {convo.other_participant_name}
                    </p>
                    <p className="text-xs text-text-tertiary flex-shrink-0 ml-2">
                      {/* Corrected to use 'last_message_at' */}
                      {convo.last_message_at
                        ? formatDistanceToNow(new Date(convo.last_message_at), {
                            addSuffix: true,
                          })
                        : ''}
                    </p>
                  </div>
                  <p
                    className={`text-sm text-text-secondary truncate ${
                      // Corrected to use 'is_read'
                      !convo.is_read ? 'font-bold text-text-primary' : ''
                    }`}
                  >
                    {/* Corrected to use 'last_message_preview' */}
                    {convo.last_message_preview}
                  </p>
                  <p className="text-xs text-text-tertiary truncate">
                    Re: {convo.listing_title}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-text-secondary text-center py-4">
              You have no recent messages.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentConversations;
