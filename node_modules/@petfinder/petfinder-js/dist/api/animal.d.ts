import { AxiosResponse } from "axios";
import { ApiClient } from "./client";
export declare class Animal extends ApiClient {
    search(params?: object): Promise<AxiosResponse>;
    show(id: number): Promise<AxiosResponse>;
}
