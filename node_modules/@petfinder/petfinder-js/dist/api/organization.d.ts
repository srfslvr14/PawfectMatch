import { AxiosResponse } from "axios";
import { ApiClient } from "./client";
export declare class Organization extends ApiClient {
    search(params?: object): Promise<AxiosResponse>;
    show(id: string): Promise<AxiosResponse>;
}
