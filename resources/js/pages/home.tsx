import UserTable from '@/components/data-tables/user-table';
import MainLayout from '@/main-layout';

export default function Home() {
    return (
        <MainLayout>
            <UserTable />
        </MainLayout>
    );
}
