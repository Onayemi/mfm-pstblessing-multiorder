// @ts-ignore -- Keep type-checking when Inertia's package declarations are unavailable.
import { usePage } from "@inertiajs/react";

interface CanProps {
    roles?: string[]; // e.g. ['superadmin', 'admin'] or ['*']
    children: any;
}

export default function Can({ roles = [], children }: CanProps) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role;

    // If no user is logged in, hide protected elements
    if (!userRole) {
        return null;
    }

    // If roles is empty or includes '*', show element to all logged-in roles
    if (roles.length === 0 || roles.includes("*")) {
        return <>{children}</>;
    }

    // Check specific role match
    if (!roles.includes(userRole)) {
        return null;
    }

    return <>{children}</>;
}
