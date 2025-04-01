export interface ResponseObj<T> {
  success: boolean;
  message: string;
  data: T;  
}
