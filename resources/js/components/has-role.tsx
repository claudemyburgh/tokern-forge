import { usePermissions } from '@/hooks/use-permissions';
import { HasRoleProps } from '@/types';

export default function HasRole({
    role,
    children,
    fallback = null,
}: HasRoleProps) {
    const { hasRole } = usePermissions();

    return hasRole(role) ? <>{children}</> : <>{fallback}</>;
}
