import { AxiosInstance } from "axios";
import { Client } from "../main";
export declare abstract class ApiClient {
    private client;
    http: AxiosInstance;
    constructor(client: Client);
    protected ensureAuthenticated(): Promise<void>;
}
