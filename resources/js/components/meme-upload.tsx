'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

const ImagePreview = ({
    url,
    onRemove,
}: {
    url: string;
    onRemove: () => void;
}) => (
    <div className="relative h-40 w-40">
        <button
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
            onClick={onRemove}
        >
            <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
        </button>
        <img
            src={url}
            height={500}
            width={100}
            alt=""
            className="h-full w-full rounded-md border border-border object-cover"
        />
    </div>
);

export default function MemeUpload({ onFileChange }: { onFileChange?: (file: File | null) => void }) {
    const [memePicture, setMemePicture] = useState<string | null>(null);

    return (
        <div className="w-full">
            <Label htmlFor="meme">Meme Picture</Label>
            <div className="mt-1 w-full">
                {memePicture ? (
                    <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed p-4">
                        <ImagePreview
                            url={memePicture}
                            onRemove={() => {
                                setMemePicture(null);
                                onFileChange?.(null);
                            }}
                        />
                    </div>
                ) : (
                    <Dropzone
                        onDrop={(acceptedFiles) => {
                            const file = acceptedFiles[0];
                            if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setMemePicture(imageUrl);
                                onFileChange?.(file);
                            }
                        }}
                        accept={{
                            'image/png': ['.png', '.jpg', '.jpeg', '.webp'],
                        }}
                        maxFiles={1}
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
                                    'flex h-[200px] w-full items-center justify-center rounded-md border border-dashed focus:border-primary focus:outline-hidden',
                                    {
                                        'border-primary bg-secondary':
                                            isDragActive && isDragAccept,
                                        'border-destructive bg-destructive/20':
                                            isDragActive && isDragReject,
                                    },
                                )}
                            >
                                <input {...getInputProps()} id="meme" />
                                <ImageIcon
                                    className="h-16 w-16"
                                    strokeWidth={1.25}
                                />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Click or drag and drop image
                                </p>
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        </div>
    );
}
