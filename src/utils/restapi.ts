export class RestApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  error?: string;

    constructor(status: string, message: string, data?: T, error?: string) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    static success<T>(message: string, data?: T): RestApiResponse<T> {
        return new RestApiResponse('success', message, data);
    }

    static error(message: string, error?: string): RestApiResponse<any> {
        return new RestApiResponse('error', message, undefined, error);
    }
}