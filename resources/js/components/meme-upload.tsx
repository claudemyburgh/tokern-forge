'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Upload, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

const ImagePreview = ({
    url,
    onRemove,
}: {
    url: string;
    onRemove: () => void;
}) => (
    <div className="relative h-48 w-48">
        <button
            className="absolute -top-2 -right-2 z-10 rounded-full bg-background shadow-lg transition-transform hover:scale-110"
            onClick={onRemove}
            type="button"
        >
            <XCircleIcon className="h-7 w-7 text-destructive" />
        </button>
        <img
            src={url || '/placeholder.svg'}
            height={500}
            width={500}
            alt="Token preview"
            className="h-full w-full rounded-xl border-2 object-cover shadow-md"
        />
    </div>
);

export default function MemeUpload({
    onFileChange,
}: {
    onFileChange?: (file: File | null) => void;
}) {
    const [memePicture, setMemePicture] = useState<string | null>(null);

    return (
        <div className="w-full space-y-2">
            <Label htmlFor="meme" className="text-base font-semibold">
                Token Image <span className="text-destructive">*</span>
            </Label>
            <div className="w-full">
                {memePicture ? (
                    <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 p-6">
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
                                    'group flex min-h-[240px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/30 p-8 transition-all hover:border-primary hover:bg-muted/50 focus:border-primary focus:outline-hidden',
                                    {
                                        'border-primary bg-primary/5':
                                            isDragActive && isDragAccept,
                                        'border-destructive bg-destructive/5':
                                            isDragActive && isDragReject,
                                    },
                                )}
                            >
                                <input {...getInputProps()} id="meme" />
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                    <Upload
                                        className="h-8 w-8 text-primary"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-base font-semibold">
                                        Drop your image here, or{' '}
                                        <span className="text-primary">
                                            browse
                                        </span>
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        PNG, JPG, JPEG or WEBP (max. 10MB)
                                    </p>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        </div>
    );
}
