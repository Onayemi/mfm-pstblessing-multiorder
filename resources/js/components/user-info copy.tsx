import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import type { User } from "@/types";

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    // const initials = user.name
    // .split(" ")
    // .map((part) => part[0])
    // .join("")
    // .toUpperCase()
    // .slice(0, 2);

    const initials = getInitials(user?.name ?? "");

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {initials}
                    {/* {getInitials(user.name)} */}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
