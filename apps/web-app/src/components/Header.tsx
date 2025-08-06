import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@directdrive/ui';
import { useAuth } from '../../providers/AuthProvider';
import {
  LayoutGrid,
  LogOut,
  MessageSquare,
  PlusCircle,
  Heart,
} from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // The signOut function from your context should handle errors internally
    await signOut();
    navigate('/');
  };

  const getInitials = (email?: string | null) => {
    return email?.[0]?.toUpperCase() ?? 'U';
  };

  return (
    <header className="bg-backgroundSecondary border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <Link to="/" className="text-2xl font-bold text-primary">
          DirectDrive
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                onClick={() => navigate('/sell')}
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Sell Your Car
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`}
                        alt="User avatar"
                      />
                      <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        My Account
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>My Listings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/saved-vehicles')}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Saved Vehicles</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/messages')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
