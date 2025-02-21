import { Middleware, Dispatch } from "redux";
import { RootState } from "../configureStore";
// const action = {
//     type: 'apiCallBegan',
//     payload: {
//         url: '/bugs',
//         method: 'get',
//         data: {},
//         onSuccess: 'bugsReceived',
//         onError: 'apiRequestFailed',
//         requestConfig: {}
//     }
// }

type ApiMiddlewareParams = {
    dispatch: Dispatch;
    getState: () => RootState;
}

const api: Middleware<ApiMiddlewareParams> = ({ dispatch }) => (next) => async (action: any) => {
    if (action.type !== 'apiCallBegan') return next(action);

    next(action); // In order to show api action in redux dev tools

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

    if (onStart) dispatch({ type: onStart, payload: onStartData });

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
        const response = await fetch(url as string, requestConfig);
        if (!response.ok) {
            dispatch({ type: onError, payload: `${response.status}: ${response.statusText}` });
            return;
        }
        const responseData = await response.json();
        dispatch({ type: onSuccess, payload: responseData });
    } catch (error) {
        console.error("Error fetching data", error);
        dispatch({ type: onError, payload: error });
    }
    if (onFinish) dispatch({ type: onFinish, payload: onFinishData });
};

export default api;