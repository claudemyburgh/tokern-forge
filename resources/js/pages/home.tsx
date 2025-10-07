import UserTable from '@/components/data-tables/user-table';
import MainLayout from '@/main-layout';

export default function Home() {
    return (
        <MainLayout>
            <UserTable
                hiddenColumns={['avatar', 'created_at', 'roles']}
                permissions={{
                    canView: true,
                    canEdit: true,
                    canDelete: true,
                }}
            />
        </MainLayout>
    );
}
