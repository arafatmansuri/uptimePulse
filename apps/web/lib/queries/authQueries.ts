import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useAuthMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, ApiErrorResponse, AuthRequestData>({
    mutationFn: async ({
      data,
      endpoint,
      method
    }: AuthRequestData): Promise<AuthResponse> =>
      await auth({ data, method: method || Methods.POST, endpoint: endpoint }),
    mutationKey: ["authMutation"],
    onError(error) {
      if (error.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["authQuery"] });
    },
  });
};
export const useAuthQuery = ({ endpoint }: AuthRequestData) =>
  useQuery<AuthResponse, ApiErrorResponse>({
    queryFn: async (): Promise<AuthResponse> =>
      await auth({ method: Methods.GET, endpoint }),
    queryKey: ["authQuery"],
    throwOnError(error) {
      if (error.status === 401) {
        refreshAccessToken().then(() => {
          return false;
        }).catch(() => {
          return false;
        });
      }
      return false;
    },
  });
export const useRefreshTokenQuery = () =>
  useQuery<AuthResponse, ApiErrorResponse>({
    queryFn: async (): Promise<AuthResponse> => await auth({ method: Methods.POST, endpoint: "/refresh-token" }),
    queryKey: ["refreshTokenQuery"],
    throwOnError() {
      localStorage.removeItem("user");
      window.location.href = "/signin";
      return false;
    },
  });

export const refreshAccessToken = async () => {
  try {
    auth({ method: Methods.POST, endpoint: "/refresh-token" }).then((res) => {
      window.location.reload();
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return false;
    });
  } catch (error) {
    localStorage.removeItem("user");
    window.location.href = "/signin";
    return false;
  }
} 