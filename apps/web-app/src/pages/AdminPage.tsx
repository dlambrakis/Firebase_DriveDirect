import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  BarChart3,
  Settings,
  AlertTriangle,
  Car,
  ChevronRight,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@directdrive/ui';

// --- Type Definitions for Data Structures ---
interface Stat {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

interface Activity {
  id: number;
  type: 'user_signup' | 'listing_created' | 'verification_pending' | 'transaction_completed';
  message: string;
  time: string;
}

interface AdminAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

// --- Component Data ---
const stats: Stat[] = [
  { title: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600' },
  { title: 'Active Listings', value: '456', change: '+8%', icon: Car, color: 'text-green-600' },
  { title: 'Pending Verifications', value: '23', change: '-5%', icon: Shield, color: 'text-yellow-600' },
  { title: 'Monthly Revenue', value: 'R45,678', change: '+15%', icon: BarChart3, color: 'text-purple-600' },
];

const recentActivity: Activity[] = [
  { id: 1, type: 'user_signup', message: 'New user registered: john.doe@email.com', time: '2 minutes ago' },
  { id: 2, type: 'listing_created', message: 'New vehicle listing: 2020 Toyota Camry', time: '15 minutes ago' },
  { id: 3, type: 'verification_pending', message: 'ID verification pending for user: sarah.smith@email.com', time: '1 hour ago' },
  { id: 4, type: 'transaction_completed', message: 'Vehicle sale completed: BMW 3 Series', time: '2 hours ago' },
];

const adminActions: AdminAction[] = [
  { title: 'User Management', description: 'Manage user accounts and permissions', icon: Users, href: '/admin/users' },
  { title: 'Vehicle Listings', description: 'Review and moderate vehicle listings', icon: Car, href: '/admin/listings' },
  { title: 'Verifications', description: 'Process user verification requests', icon: Shield, href: '/admin/verifications' },
  { title: 'Reports & Analytics', description: 'View platform statistics and reports', icon: BarChart3, href: '/admin/reports' },
  { title: 'System Settings', description: 'Configure platform settings', icon: Settings, href: '/admin/settings' },
  { title: 'Flagged Content', description: 'Review reported content and disputes', icon: AlertTriangle, href: '/admin/flagged' },
];

/**
 * A comprehensive dashboard for platform administrators to manage users,
 * listings, and view key statistics.
 */
const AdminPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage and monitor the DriveDirect platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {adminActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'user_signup' ? 'bg-blue-500' :
                    activity.type === 'listing_created' ? 'bg-green-500' :
                    activity.type === 'verification_pending' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button asChild variant="link" className="px-0">
                <Link to="/admin/activity">View all activity &rarr;</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Send Platform Announcement</Button>
          <Button variant="secondary">Export User Data</Button>
          <Button variant="secondary">Generate Monthly Report</Button>
          <Button variant="outline">System Maintenance</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
