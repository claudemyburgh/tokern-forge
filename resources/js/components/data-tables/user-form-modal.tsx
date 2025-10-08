import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Role, User } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    roles: z.array(z.string()).default([]),
});

const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'If provided, password must be at least 8 characters').optional().or(z.literal('')),
    roles: z.array(z.string()).default([]),
});

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    user: User | null;
    roles: Role[];
    isLoading: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    roles,
    isLoading,
}) => {
    const formSchema = user ? updateUserSchema : createUserSchema;
    type FormData = z.infer<typeof formSchema>;

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            roles: [],
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (user) {
                reset({
                    name: user.name,
                    email: user.email,
                    password: '',
                    roles: user.roles.map((role) => role.name),
                });
            } else {
                reset({
                    name: '',
                    email: '',
                    password: '',
                    roles: [],
                });
            }
        }
    }, [user, reset, isOpen]);

    const handleFormSubmit = (values: FormData) => {
        const dataToSend = { ...values };
        if (user && !dataToSend.password) {
            delete (dataToSend as Partial<FormData>).password;
        }
        onSubmit(dataToSend);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" {...register('name')} className="col-span-3" />
                            {errors.name && <p className="col-span-4 text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input id="email" {...register('email')} className="col-span-3" />
                            {errors.email && <p className="col-span-4 text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="col-span-3"
                                placeholder={user ? 'Leave blank to keep current password' : ''}
                            />
                            {errors.password && (
                                <p className="col-span-4 text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">
                                Roles
                            </Label>
                            <div className="col-span-3 flex flex-wrap gap-4">
                                <Controller
                                    name="roles"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {roles.map((role) => (
                                                <div key={role.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`role-${role.id}`}
                                                        checked={field.value?.includes(role.name)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), role.name])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== role.name,
                                                                    ),
                                                                );
                                                        }}
                                                    />
                                                    <Label htmlFor={`role-${role.id}`} className="font-normal capitalize">{role.name}</Label>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserFormModal;