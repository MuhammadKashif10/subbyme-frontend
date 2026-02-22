import { useState, useEffect } from "react";
import {
  useNotifications,
  useNotificationUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-api";
import { useSocket } from "@/context/SocketContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Loader2, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { data, refetch } = useNotifications(1, 15);
  const { data: unreadData, refetch: refetchUnread } =
    useNotificationUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const onNotif = () => {
      refetch();
      refetchUnread();
    };
    socket.on("notification", onNotif);
    return () => {
      socket.off("notification", onNotif);
    };
  }, [socket, refetch, refetchUnread]);

  const unreadCount = unreadData?.count ?? 0;
  const notifications = data?.notifications ?? [];

  const handleMarkRead = async (id: string) => {
    await markRead.mutateAsync(id);
    refetch();
    refetchUnread();
  };

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
    refetch();
    refetchUnread();
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCheck size={14} className="mr-1" />
              )}
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {!data ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n._id}
                className={`flex cursor-pointer flex-col items-start gap-0.5 py-3 ${
                  !n.read ? "bg-muted/50" : ""
                }`}
                onSelect={() => {
                  if (!n.read) handleMarkRead(n._id);
                }}
              >
                <p className="text-sm">{n.message}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
