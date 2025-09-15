'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingDown, 
  Calendar,
  BarChart3,
  UtensilsCrossed
} from 'lucide-react';

const recipeActivities = [
  {
    id: 1,
    dateTime: '2024-01-15 14:32',
    activity: 'Premium Recipe Upload',
    description: 'Chocolate Lava Cake',
    cost: 2.50
  },
  {
    id: 2,
    dateTime: '2024-01-15 11:18',
    activity: 'Recipe Enhancement',
    description: 'Added nutrition facts',
    cost: 1.00
  },
  {
    id: 3,
    dateTime: '2024-01-15 09:45',
    activity: 'Premium Recipe Upload',
    description: 'Beef Wellington Recipe',
    cost: 3.50
  },
  {
    id: 4,
    dateTime: '2024-01-14 16:22',
    activity: 'Recipe Analytics',
    description: 'Monthly usage report',
    cost: 0.75
  },
  {
    id: 5,
    dateTime: '2024-01-14 13:09',
    activity: 'Recipe Enhancement',
    description: 'Photo optimization',
    cost: 1.25
  },
  {
    id: 6,
    dateTime: '2024-01-14 10:33',
    activity: 'Premium Recipe Upload',
    description: 'Sourdough Bread Guide',
    cost: 2.25
  },
  {
    id: 7,
    dateTime: '2024-01-13 15:47',
    activity: 'Recipe Enhancement',
    description: 'Video thumbnail creation',
    cost: 1.50
  }
];

export function UsageOverview() {
  const totalUsage = recipeActivities.reduce((sum, activity) => sum + activity.cost, 0);
  const totalActivities = recipeActivities.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Recipe Activities This Month
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
            <TrendingDown className="w-3 h-3 mr-1" />
            -8% vs last month
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Usage */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Credits Used</span>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Jan 2024</span>
              </div>
            </div>
            <div className="flex items-end space-x-4">
              <div>
                <p className="text-2xl font-semibold text-foreground">${totalUsage.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{totalActivities} activities</p>
              </div>
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Avg: ${(totalUsage / totalActivities).toFixed(2)} per activity</span>
              </div>
            </div>
          </div>

          {/* Activities Table */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Recent Activities</h4>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm text-muted-foreground">Date & Time</th>
                      <th className="text-left p-3 font-medium text-sm text-muted-foreground">Activity</th>
                      <th className="text-left p-3 font-medium text-sm text-muted-foreground">Description</th>
                      <th className="text-right p-3 font-medium text-sm text-muted-foreground">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recipeActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/25 transition-colors">
                        <td className="p-3 text-sm text-foreground">
                          {new Date(activity.dateTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })} at {new Date(activity.dateTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </td>
                        <td className="p-3 text-sm text-foreground">{activity.activity}</td>
                        <td className="p-3 text-sm text-muted-foreground">{activity.description}</td>
                        <td className="p-3 text-sm text-foreground text-right font-medium">${activity.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}