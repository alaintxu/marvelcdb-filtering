import {createAction} from '@reduxjs/toolkit';

export const apiCallBegan = createAction<{
    url: string;
    method?: string;
    data?: any;
    
    onStart?: string | string[];
    onStartPayload?: any;

    onSuccess?: string | string[];

    onError?: string | string[];
    onErrorPayload?: any;
}>('api/callBegan');
export const apiCallSuccess = createAction<any>('api/callSuccess');
export const apiCallFailed = createAction<any>('api/callFailed');