import { AxiosResponse } from "axios";
import { ApiClient } from "./client";
export declare class AnimalData extends ApiClient {
    types(): Promise<AxiosResponse>;
    type(type: string): Promise<AxiosResponse>;
    breeds(type: string): Promise<AxiosResponse>;
}
