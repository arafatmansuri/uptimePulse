import { Methods } from "./constants";
import { SignInValues, SignUpValues } from "./schemas";

type ApiRequestData<T> = {
    data?: T;
    endpoint: string;
    method?: Methods
}

export type AuthRequestData = ApiRequestData<SignInValues | SignUpValues>;