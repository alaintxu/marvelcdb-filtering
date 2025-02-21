import {createAction} from '@reduxjs/toolkit';

export const apiCallBegan = createAction<{
    url: string;
    method?: string;
    data?: any;
    
    onStart?: string;
    onStartData?: any;

    onSuccess?: string;

    onError?: string;

    onFinish?: string;
    onFinishData?: any;
}>('api/callBegan');
export const apiCallSuccess = createAction<any>('api/callSuccess');
export const apiCallFailed = createAction<any>('api/callFailed');