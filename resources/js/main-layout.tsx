import { type ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: MainLayoutProps) => (
    <div {...props} className={`mx-auto my-12 min-h-screen w-full max-w-4xl`}>
        {children}
    </div>
);
