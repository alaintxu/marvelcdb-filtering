import { Middleware, Dispatch } from "redux";
import { RootState } from "../configureStore";
import * as apiActions from "../api";
import i18n from 'i18next';


type ApiMiddlewareParams = {
    dispatch: Dispatch;
    getState: () => RootState;
}

const dispatchError = (dispatch: Dispatch, error: any, onError: string, payload?: any) => {
    console.error("Error fetching data", error);
    dispatch(apiActions.apiCallFailed(error));
    dispatchCheckingArray(onError, dispatch, { error: error, errorPayload: payload });
}

const dispatchCheckingArray = (onAction: string | string[], dispatch: Dispatch, payload?: any) => {
    if (!onAction) return;
    if (Array.isArray(onAction)){
        onAction.forEach((actionType) => dispatch({ type: actionType, payload }));
    } else {
        dispatch({ type: onAction, payload });
    }
}

const api: Middleware<ApiMiddlewareParams> = ({ dispatch }) => (next) => async (action: any) => {
    if (action.type !== apiActions.apiCallBegan.type) return next(action);

    const { 
        url, 
        method, 
        data,
        onStart,
        onStartPayload,
        onSuccess,
        onError,
        onErrorPayload
    } = action.payload;

    const full_url = `${i18n.t('base_path', {ns: 'global'})}/api/public${url}`;

    dispatchCheckingArray(onStart, dispatch, onStartPayload);
    next(action); // In order to show api action in redux dev tools

    let requestConfig: RequestInit = {
        headers: {'Accept': 'application/json'},
        method: method || 'get',
    };

    if (data) {
        requestConfig.headers= {...requestConfig.headers, 'Content-Type': 'application/json'};
        requestConfig['body'] = JSON.stringify(data);
    }
    
    try{
        const response = await fetch(full_url, requestConfig);
        if (!response.ok) {
            dispatchError(dispatch, `${response.status}: ${response.statusText}`, onError, onErrorPayload);
            return;
        }
        const responseData = await response.json();
        dispatch(apiActions.apiCallSuccess(responseData));
        dispatchCheckingArray(onSuccess, dispatch, responseData);
    } catch (error: any) {
        dispatchError(dispatch, (error as Error).message || "?", onError, onErrorPayload);
    }
};

export default api;