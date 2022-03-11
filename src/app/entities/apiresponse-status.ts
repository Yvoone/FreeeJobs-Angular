export interface IAPIResponseStatus {
    statusCode?: number;
    statusText?: string;
    message?: string;
}

export class APIResponseStatus implements IAPIResponseStatus {
    constructor(
        public statusCode?: number,
        public statusText?: string,
        public message?: string
    ) { }
}