import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL, Methods } from "../constants";
import { AuthRequestData } from "../requests";
import { ApiErrorResponse, AuthResponse } from "../responses";

async function auth({
  endpoint,
  data,
  method,
}: AuthRequestData): Promise<AuthResponse> {
  try {
    const res = await axios({
      data: data,
      method: method,
      url: `${BACKEND_URL}/users${endpoint}`,
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw {
        message: err.response?.data?.message || "Unknown error",
        status: err.response?.status,
      };
    }

    throw {
      message: "Something went wrong from ourside",
    };
  }
}

export const useAuthMutation = () =>
  useMutation<AuthResponse, ApiErrorResponse, AuthRequestData>({
    mutationFn: async ({
      data,
      endpoint,
    }: AuthRequestData): Promise<AuthResponse> =>
      await auth({ data, method: Methods.POST, endpoint: endpoint }),
    mutationKey: ["authMutation"],
    onError(error) {
      if (error.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    },
  });
export const useAuthQuery = ({ endpoint }: AuthRequestData) =>
  useQuery<AuthResponse, ApiErrorResponse>({
    queryFn: async (): Promise<AuthResponse> =>
      await auth({ method: Methods.GET, endpoint }),
    queryKey: ["authQuery"],
    throwOnError(error) {
      if (error.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return false;
      }
      return false;
    },
  });
