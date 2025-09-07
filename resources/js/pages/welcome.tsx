import Hero from '@/components/hero';
import LandingLayout from '@/layouts/landing-layout';
import { Head } from '@inertiajs/react';
import CardStats from '@/components/card-stats';
import { ChartBarDefault } from '@/components/ui/bar-chart-02';
import { Card } from '@/components/ui/card';
import { MyChart } from '@/components/my-chart';
import { NorthernLightsBackground } from '@/components/ui/northern-lights-background';

export default function Welcome() {
    return (
        <LandingLayout className={`isolate`}>
            <Head title="Welcome" />
            <NorthernLightsBackground
                className={`min-h-200 fixed top-0 -z-10 opacity-25 dark:opacity-75`}
                colorStops={["#ff8127", "#fffb27", "#d72020"]}
                amplitude={2.0}
                speed={0.25}
            />
            <Hero />
            <div className="space-y-6 mb-6">

            <CardStats/>
                <div className="container mx-auto">
                    <MyChart/>
                </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 container mx-auto">
                <Card>
                    <ChartBarDefault/>
                </Card>
                <Card>
                    <ChartBarDefault/>
                </Card>
                <Card>
                    <ChartBarDefault/>
                </Card>
            </div>

            </div>

        </LandingLayout>
    );
}
