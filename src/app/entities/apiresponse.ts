import { APIResponseStatus } from "./apiresponse-status";

export interface IAPIResponse<T> {
    status?: APIResponseStatus;
    data?: T;
}

export class APIResponse<T> implements IAPIResponse<T> {
    constructor(
        public status?: APIResponseStatus,
        public data?: T
    ) { }
}