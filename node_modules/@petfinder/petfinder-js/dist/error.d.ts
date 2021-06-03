import { AxiosResponse } from "axios";
export declare class ProblemDetailsError extends Error {
    request: any;
    response: AxiosResponse;
    type: string;
    status: number;
    details: string;
    invalidParams?: object;
    constructor(request: any, response: AxiosResponse);
}
