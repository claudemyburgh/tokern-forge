import Can from '@/components/can';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import MainLayout from '@/main-layout';
import { PaginatedResponse, User } from '@/types';

interface UsersProps {
    users: PaginatedResponse<User>;
}

export default function Home({ users }: UsersProps) {
    return (
        <MainLayout>
            <div className="grid grid-cols-2 gap-4">
                {users.data.map((user) => (
                    <Card key={user.id}>
                        <CardHeader>
                            <div className="flex space-x-2">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                </Avatar>
                                <div className="grid gap-0.5">
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>
                                        {user.email}
                                    </CardDescription>
                                </div>
                            </div>

                            <CardAction>
                                {user.is_super_admin && (
                                    <Badge variant={`secondary`}>
                                        Super Admin
                                    </Badge>
                                )}
                                <Can permission={'delete token'}>
                                    <Button size={`sm`}>Delete</Button>
                                </Can>
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </MainLayout>
    );
}
