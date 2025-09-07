import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { SiDiscord, SiFacebook, SiGithub, SiGoogle } from 'react-icons/si';

const SocialLoginButtons = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const socialProviders = [
        { name: 'Google', icon: <SiGoogle className="mr-2 h-4 w-4" />, href: '/auth/google/redirect' },
        { name: 'Facebook', icon: <SiFacebook className="mr-2 h-4 w-4" />, href: '/auth/facebook/redirect' },
        { name: 'GitHub', icon: <SiGithub className="mr-2 h-4 w-4" />, href: '/auth/github/redirect' },
        { name: 'Discord', icon: <SiDiscord className="mr-2 h-4 w-4" />, href: '/auth/discord/redirect' },
    ];

    return (
        <div className={cn('grid grid-cols-2 gap-4', className)} {...props}>
            {socialProviders.map((provider) => (
                <Button asChild key={provider.name} variant="outline">
                    <a href={provider.href}>
                        {provider.icon}
                        {provider.name}
                    </a>
                </Button>
            ))}
        </div>
    );
};

export default SocialLoginButtons;
