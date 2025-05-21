
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/types/auth";
import { Badge } from "@/components/ui/badge";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
}

export const UserDetailsDialog = ({
  open,
  onOpenChange,
  user
}: UserDetailsDialogProps) => {
  if (!user) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user.full_name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user.full_name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Badge className="ml-auto">
              {user.user_type}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">ID</h4>
              <p className="text-sm mt-1 break-all">{user.id}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
              <p className="text-sm mt-1">{user.phone_number || "Not provided"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">IC Number</h4>
              <p className="text-sm mt-1">{user.ic_number || "Not provided"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">User Group</h4>
              <p className="text-sm mt-1">{user.nd_user_group?.group_name || "None"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Created At</h4>
              <p className="text-sm mt-1">{formatDate(user.created_at)}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
              <p className="text-sm mt-1">{formatDate(user.updated_at)}</p>
            </div>

            {user.gender && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                <p className="text-sm mt-1">{user.gender}</p>
              </div>
            )}

            {user.work_email && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Work Email</h4>
                <p className="text-sm mt-1">{user.work_email}</p>
              </div>
            )}
          </div>

          {user.avatar_url && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Avatar</h4>
              <img 
                src={user.avatar_url} 
                alt="User avatar" 
                className="mt-2 h-24 w-24 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
