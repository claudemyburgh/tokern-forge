'use client';

import AvatarController from '@/actions/App/Http/Controllers/Settings/AvatarController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { router, useForm } from '@inertiajs/react';
import { CameraIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { toast } from 'sonner';

interface AvatarUploadProps {
    user: {
        avatar?: string;
        name: string;
    };
    errors?: Record<string, string>;
}

const ImagePreview = ({
    url,
    onCameraClick,
    onDrop,
    isUploading = false,
}: {
    url: string;
    onRemove: () => void;
    isUploaded?: boolean;
    onCameraClick?: () => void;
    onDrop?: (files: File[]) => void;
    isUploading?: boolean;
}) => (
    <Dropzone
        onDrop={(acceptedFiles) => {
            if (onDrop && acceptedFiles.length > 0) {
                onDrop(acceptedFiles);
            }
        }}
        accept={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp'],
        }}
        maxFiles={1}
        disabled={isUploading}
        noClick={true}
    >
        {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
        }) => (
            <div
                {...getRootProps()}
                className={cn(
                    'relative aspect-square rounded-full transition-all',
                    {
                        'ring-2 ring-primary ring-offset-2':
                            isDragActive && isDragAccept,
                        'ring-2 ring-destructive ring-offset-2':
                            isDragActive && isDragReject,
                        'opacity-50': isUploading,
                    },
                )}
            >
                <input {...getInputProps()} />
                <img
                    src={url}
                    height={50}
                    width={50}
                    alt="avatar"
                    className="h-full w-full rounded-full border-3 border-border object-cover"
                />
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                        <Loader2 className="size-6 animate-spin text-white" />
                    </div>
                )}
                {onCameraClick && !isUploading && (
                    <div className="absolute right-1 -bottom-1">
                        <Button
                            className="size-7 rounded-full !p-0.5"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCameraClick();
                            }}
                            title="Upload new avatar"
                        >
                            <CameraIcon className="size-3" />
                        </Button>
                    </div>
                )}
                {isDragActive && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-primary bg-primary/10">
                        <span className="text-xs font-medium text-primary">
                            {isDragAccept ? 'Drop here' : 'Invalid file'}
                        </span>
                    </div>
                )}
            </div>
        )}
    </Dropzone>
);

export default function AvatarUpload({ user, errors }: AvatarUploadProps) {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { submit } = useForm();

    const hasUploadedAvatar =
        user.avatar && !user.avatar.includes('ui-avatars.com');

    useEffect(() => {
        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, [profilePicture]);

    const handleFileSelect = (file: File) => {
        // Show preview immediately
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
    };

    const handleFileUpload = (file: File) => {
        // Show preview first
        handleFileSelect(file);

        // Then start upload
        setIsUploading(true);

        // Create FormData and upload
        const formData = new FormData();
        formData.append('avatar', file);

        router.post(AvatarController.update(), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsUploading(false);
                toast.success('Your avatar has been updated successfully');
                // Refresh to show new avatar
                router.reload({ only: ['auth'] });
            },
            onError: (errors) => {
                toast.error('Upload failed', {
                    description:
                        Object.values(errors).join(', ') || 'Please try again.',
                    richColors: true,
                });
                handleRemovePreview();
                setIsUploading(false);
            },
        });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        submit(AvatarController.destroy(), {
            onSuccess: () => {
                setProfilePicture(null);
                setIsDeleting(false);
                toast.success('Your avatar has been deleted successfully.');
                // Refresh to show updated avatar
                router.reload({ only: ['auth'] });
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Delete failed', {
                    description: 'Please try again.',
                    richColors: true,
                });
            },
        });
    };

    const handleRemovePreview = () => {
        if (profilePicture) {
            URL.revokeObjectURL(profilePicture);
        }
        setProfilePicture(null);
    };

    const handleDrop = (files: File[]) => {
        const file = files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const triggerFileUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/png,image/jpeg,image/webp';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleFileUpload(file);
            }
        };
        fileInput.click();
    };

    return (
        <div className={`grid gap-2`}>
            <div className={`flex items-center space-x-4`}>
                <div className="w-full max-w-20">
                    <Label className={`sr-only`} htmlFor="profile">
                        Profile Picture
                    </Label>
                    <div className="mt-1 w-full">
                        {hasUploadedAvatar ? (
                            <ImagePreview
                                url={user.avatar!}
                                onRemove={handleDelete}
                                isUploaded={true}
                                onCameraClick={triggerFileUpload}
                                onDrop={handleDrop}
                                isUploading={isUploading}
                            />
                        ) : profilePicture ? (
                            <ImagePreview
                                url={profilePicture}
                                onRemove={handleRemovePreview}
                                isUploaded={false}
                                isUploading={isUploading}
                            />
                        ) : (
                            <Dropzone
                                onDrop={(acceptedFiles) => {
                                    const file = acceptedFiles[0];
                                    if (file) {
                                        handleFileUpload(file);
                                    }
                                }}
                                accept={{
                                    'image/png': ['.png'],
                                    'image/jpeg': ['.jpg', '.jpeg'],
                                    'image/webp': ['.webp'],
                                }}
                                maxFiles={1}
                                disabled={isUploading}
                            >
                                {({
                                    getRootProps,
                                    getInputProps,
                                    isDragActive,
                                    isDragAccept,
                                    isDragReject,
                                }) => (
                                    <div
                                        {...getRootProps()}
                                        className={cn(
                                            'flex aspect-square cursor-pointer items-center justify-center rounded-full border border-dashed transition-colors hover:bg-primary/25 focus:border-primary focus:outline-hidden',
                                            {
                                                'border-primary bg-secondary':
                                                    isDragActive &&
                                                    isDragAccept,
                                                'border-destructive bg-destructive/20':
                                                    isDragActive &&
                                                    isDragReject,
                                                'cursor-not-allowed opacity-50':
                                                    isUploading,
                                            },
                                        )}
                                    >
                                        <input
                                            {...getInputProps()}
                                            id="profile"
                                        />
                                        {isUploading ? (
                                            <Spinner />
                                        ) : (
                                            <CameraIcon
                                                className="size-8"
                                                strokeWidth={1.25}
                                            />
                                        )}
                                    </div>
                                )}
                            </Dropzone>
                        )}
                    </div>
                </div>
                <div className={`flex flex-1 flex-col`}>
                    <HeadingSmall
                        title="Profile Picture"
                        description={
                            isUploading
                                ? 'Uploading...'
                                : 'Click on camera icon to upload new avatar'
                        }
                    />
                </div>
                <div className={`flex justify-end`}>
                    {hasUploadedAvatar && (
                        <Button
                            onClick={handleDelete}
                            size={`sm`}
                            variant={`destructive`}
                            disabled={isDeleting || isUploading}
                        >
                            {isDeleting ? (
                                <>
                                    <Spinner className={`mr-2`} />
                                    Removing...
                                </>
                            ) : (
                                'Remove'
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Show validation errors */}
            {errors?.avatar && (
                <>
                    {errors.avatar}
                    <InputError className="mt-2" message={errors.avatar} />
                </>
            )}
        </div>
    );
}
