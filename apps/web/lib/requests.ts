import { Methods } from "./constants";
import { AddWebsiteValues, ChangePasswordValues, SignInValues, SignUpValues, UpdateProfileValues } from "./schemas";

type ApiRequestData<T> = {
  data?: T;
  endpoint: string;
  method?: Methods;
};

export type AuthRequestData = ApiRequestData<SignInValues | SignUpValues | UpdateProfileValues | ChangePasswordValues>;
export type WebsiteRequestData = ApiRequestData<AddWebsiteValues>;
