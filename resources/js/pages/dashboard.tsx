import Can from '@/components/can';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Token Management</CardTitle>
                            <CardDescription>
                                Manage your digital tokens
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Can permissions="view tokens">
                                <Button asChild>
                                    <a href="/tokens">View Tokens</a>
                                </Button>
                            </Can>
                            <Can
                                permissions="create tokens"
                                fallback={
                                    <p className="text-sm text-muted-foreground">
                                        Upgrade to Pro or Admin plan to create
                                        tokens
                                    </p>
                                }
                            >
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="ml-2"
                                >
                                    <a href="/tokens/create">Create Token</a>
                                </Button>
                            </Can>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Plan</CardTitle>
                            <CardDescription>
                                Your current subscription level
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Can roles="super-admin">
                                <p className="text-lg font-semibold text-green-600">
                                    Super Admin
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Full access to all features
                                </p>
                            </Can>
                            <Can roles="admin" fallback={null}>
                                <p className="text-lg font-semibold text-blue-600">
                                    Admin
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Manage tokens and users
                                </p>
                            </Can>
                            <Can roles="pro" fallback={null}>
                                <p className="text-lg font-semibold text-purple-600">
                                    Pro User
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Create and edit tokens
                                </p>
                            </Can>
                            <Can roles="free" fallback={null}>
                                <p className="text-lg font-semibold text-gray-600">
                                    Free User
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    View tokens only
                                </p>
                            </Can>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>What you can do</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Can permissions="manage users">
                                <Button variant="outline">Manage Users</Button>
                            </Can>
                            <Can permissions="manage settings">
                                <Button variant="outline" className="ml-2">
                                    Settings
                                </Button>
                            </Can>
                        </CardContent>
                    </Card>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
                    delectus dolorem fugit impedit omnis repudiandae similique
                    veniam. Consectetur debitis distinctio dolore error in
                    minima nisi officia porro quas, quia quod ratione sint
                    tempora vero, voluptatibus? Commodi, ducimus libero porro
                    provident rerum sequi tenetur voluptates. A adipisci
                    consequuntur distinctio dolore dolores, doloribus error
                    illum laboriosam libero minus molestiae nemo ullam, unde. A
                    asperiores dolore enim eos esse est explicabo, facilis harum
                    ipsum obcaecati odio officiis praesentium provident
                    quibusdam recusandae rem similique soluta tenetur vitae
                    voluptatum? Autem eligendi minima pariatur quisquam vel,
                    vitae? Deserunt dignissimos error et id inventore magni
                    sapiente suscipit voluptatem. Aliquam assumenda, consequatur
                    cumque deserunt dignissimos dolore in itaque iure obcaecati
                    odit omnis quas quia quo temporibus voluptas? Ad aliquid
                    aspernatur dicta dolorum fugit laborum molestias obcaecati
                    placeat quia sed. Blanditiis deleniti ducimus esse eum harum
                    hic, mollitia placeat quisquam? Assumenda deserunt obcaecati
                    perspiciatis quasi sequi ut velit vitae. Autem dolor dolore,
                    eligendi et excepturi, explicabo id in ipsum molestiae
                    nesciunt nihil nobis recusandae rerum saepe soluta totam
                    voluptate! Animi asperiores, beatae culpa dignissimos
                    ducimus eum harum id, impedit laudantium maxime nam
                    necessitatibus officia placeat quibusdam ratione repellat
                    repellendus repudiandae, similique sit vel voluptas
                    voluptatem voluptates. Aliquam aspernatur, beatae
                    consequuntur cumque enim esse eveniet expedita ipsum
                    laudantium maiores, maxime nihil non nulla officia pariatur
                    provident quasi repellendus saepe suscipit unde velit
                    voluptas voluptatem voluptatum? Cupiditate debitis fuga
                    incidunt ipsam libero nemo porro. Accusamus adipisci alias
                    asperiores aspernatur assumenda aut autem consequatur
                    corporis dolor dolorem ex excepturi facilis illo, labore
                    necessitatibus qui quos reiciendis, reprehenderit sint sit
                    ullam ut voluptate voluptatum! Assumenda commodi delectus
                    deserunt ducimus error eveniet neque quod sit veritatis
                    voluptatem. Aliquam asperiores cupiditate fugiat id maxime
                    nesciunt praesentium quas, quisquam rem sit veritatis,
                    voluptate. Alias aperiam esse fuga labore laudantium
                    mollitia nam officia sunt? Adipisci aperiam dolores
                    doloribus maiores possimus repudiandae ullam. Consequatur
                    debitis dicta ipsa ipsam modi, quia sequi temporibus.
                    Aliquid architecto eius, eos explicabo, fuga fugit hic,
                    impedit minima nam odit placeat qui repellat veritatis? A
                    consectetur cupiditate deserunt facilis fuga fugiat neque
                    non, numquam quo ratione repudiandae veniam, vero voluptas
                    voluptate voluptatem. Accusantium adipisci, alias assumenda
                    atque consectetur consequatur corporis dolor est explicabo,
                    id, ipsa ipsum iste itaque laboriosam nam officiis
                    perferendis quae quibusdam sint vero! Aspernatur nesciunt
                    saepe tempora. Alias corporis deserunt, dicta doloribus
                    eaque est facere impedit iure, magnam modi officiis
                    perferendis perspiciatis porro quam sit totam unde velit?
                    Sed, temporibus, voluptas!
                </p>
            </div>
        </AppLayout>
    );
}
