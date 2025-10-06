import { usePermissions } from '@/hooks/use-permissions';
import { CanProps } from '@/types';

export default function Can({
    permission,
    children,
    fallback = null,
}: CanProps) {
    const { hasPermission } = usePermissions();

    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}
