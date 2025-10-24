import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { name } = usePage<SharedData>().props;
    return (
        <div className={`relative flex items-center`}>
            <AppLogoIcon
                aria-hidden={true}
                className={`absolute left-0 size-26 -translate-x-1/2 animate-pulse opacity-25 blur-sm`}
            />
            <AppLogoIcon className={`size-10`} />
            <div className="ml-0 grid flex-1 text-left text-lg">
                <span className="mb-0 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </div>
    );
}
