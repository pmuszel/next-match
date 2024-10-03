import {differenceInYears, format, formatDistance} from 'date-fns'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ZodIssue } from 'zod';

export function calculateAge(dob: Date) {
    return differenceInYears(new Date(), dob);
}

export function formatShortDateTime(date: Date) {
    return format(date, 'dd-MM-yyyy HH:MM')
}

export function timeAgo(date: string) {
    return formatDistance(new Date(parseInt(date.slice(6,10)), parseInt(date.slice(3,5)) - 1, parseInt(date.slice(0,2)), parseInt(date.slice(11,13)), parseInt(date.slice(14,16))), new Date()) + ' ago';
}


export function handleFormServerErrors<TFieldValues extends FieldValues>(
    errorResponse: {error: string | ZodIssue[]},
    setError: UseFormSetError<TFieldValues>
) {
    if(Array.isArray(errorResponse.error)) {
        errorResponse.error.forEach(e => {
            const fieldName = e.path.join('.') as Path<TFieldValues>;
            setError(fieldName, {message: e.message});
        })
    } else {
        setError('root.serverError', {message: errorResponse.error})
    }
}

export function transformImageUrl(imageUrl?: string | null) {
    if(!imageUrl) return null;


    if(!imageUrl.includes('cloudinary')) return imageUrl;

    const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length;

    const transformation = 'c_fill,w_300,h_300,g_faces/';

    return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`;
}


export function truncateString(text?: string | null, num = 50) {
    if(!text) return null;
    if(text.length <= 50) return text;

    return text.slice(0, num) + '...';
}

export function createChatId(a: string, b: string) {
    return a > b ? `${b}-${a}` : `${a}-${b}`;
}