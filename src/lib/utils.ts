import { toasts } from 'svelte-toasts';
export const sendSuccessToast = (title: string,subtitle:string) => {
    toasts.add({
        title,
        description: subtitle,
        duration: 3000,
        type: 'success',
        theme: 'dark',
        showProgress: true,
    });
}

export const sendErrorToast = (title: string,subtitle: string) => {
    toasts.add({
        title,
        description: subtitle,
        duration: 5000,
        type: 'error',
        theme: 'dark',
        showProgress: true,
    });
}