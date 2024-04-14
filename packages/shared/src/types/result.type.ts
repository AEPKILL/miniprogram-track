/**
 * @overview
 * @author AEPKILL
 * @created 2024-04-12 14:31:29
 */
export type SuccessResult<T = void> = {
  success: true;
  data: T;
  code?: number;
  message?: string;
};

export type ErrorResult = {
  success: false;
  code?: number;
  message?: string;
  error?: any;
};

export type Result<T = void> = SuccessResult<T> | ErrorResult;
