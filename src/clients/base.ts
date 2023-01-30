import axios, { AxiosResponse, Method, RawAxiosRequestHeaders } from "axios";

export default class BaseClient {
    _baseUrl: string;
    _baseHeaders: {[x: string]: string};

    constructor(baseUrl: string, baseHeaders: {[x: string]: string}) {
        this._baseUrl = baseUrl;
        this._baseHeaders = baseHeaders;
    }

    async _request({ method, path, headers, args }: { method: Method, path: string, headers?: RawAxiosRequestHeaders, args?: {[arg: string]: any}}): Promise<AxiosResponse<any, any>> {
        path = path.startsWith('/') ? path : `/${path}`
        headers = {...headers, ...this._baseHeaders}

        const config = {
            url: `${this._baseUrl}${path}`,
            method,
            headers,
            ...args
        };
        return await axios.request(config);
    }

    async _get(path: string, params?: {[param: string]: string | number}): Promise<AxiosResponse<any, any>> {
        return await this._request({ method: 'GET', path, args: { params }});
    }

    async _delete(path: string): Promise<AxiosResponse<any, any>> {
        return await this._request({ method: 'DELETE', path });
    }

    async _post(path: string, data: {[k: string]: any}): Promise<AxiosResponse<any, any>> {
        return await this._request({ method: 'POST', path, args: { data }});
    }

    async _put(path: string, data: {[k: string]: any}): Promise<AxiosResponse<any, any>> {
        return await this._request({ method: 'PUT', path, args: { data }});
    }
}