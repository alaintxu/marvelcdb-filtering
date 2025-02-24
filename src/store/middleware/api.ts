import { Middleware, Dispatch } from "redux";
import { RootState } from "../configureStore";
import * as apiActions from "../api";
import i18n from 'i18next';


type ApiMiddlewareParams = {
    dispatch: Dispatch;
    getState: () => RootState;
}

const dispatchError = (dispatch: Dispatch, error: any, onError: string) => {
    console.error("Error fetching data", error);
    dispatch(apiActions.apiCallFailed(error));
    if (onError) dispatch({ type: onError, payload: error });
}

const api: Middleware<ApiMiddlewareParams> = ({ dispatch }) => (next) => async (action: any) => {
    if (action.type !== apiActions.apiCallBegan.type) return next(action);

    const { 
        url, 
        method, 
        data,
        onStart,
        onStartData,
        onSuccess, 
        onError,
        onFinish,
        onFinishData
    } = action.payload;

    const full_url = `${i18n.t('base_path', {ns: 'global'})}/api/public${url}`;

    if (onStart) dispatch({ type: onStart, payload: onStartData });
    next(action); // In order to show api action in redux dev tools

    let requestConfig: { 
        headers?: { 
            'Content-Type'?: string,
            'Accept'?: string,

        },
        method?: string; 
        body?: string 
    } = {
        headers: {
            'Accept': 'application/json'
        }
    };


    if (method) requestConfig.method = method;
    if (data) {
        requestConfig.headers = { 
            ...requestConfig.headers,
            'Content-Type': 'application/json'
        };
        requestConfig['body'] = JSON.stringify(data);
    }
    try{
        const response = await fetch(full_url, requestConfig);
        if (!response.ok) {
            console.error("Error fetching data", response);
            dispatchError(dispatch, `${response.status}: ${response.statusText}`, onError);
            return;
        }
        const responseData = await response.json();
        dispatch(apiActions.apiCallSuccess(responseData));
        if (onSuccess) dispatch({ type: onSuccess, payload: responseData });
    } catch (error: any) {
        console.error("Error fetching data", error);
        dispatchError(dispatch, (error as Error).message || "?", onError);
    }
    if (onFinish) dispatch({ type: onFinish, payload: onFinishData });
};

export default api;