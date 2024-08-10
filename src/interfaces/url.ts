export interface IGenericAPIResponse<T> {
    message: string;
    data: T;
  }

export interface IShortUrlResponse {
  id: number;
  shortUrl: string;
  originalUrl: string;
  visitCount: number;
}