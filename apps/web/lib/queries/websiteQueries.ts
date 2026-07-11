import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL, Methods } from "../constants";
import { WebsiteRequestData } from "../requests";
import {
  ApiErrorResponse,
  WebsiteResponse,
  WebsitesResponse,
} from "../responses";
import { refreshAccessToken } from "./authQueries";

async function websiteRequest<T>({
  endpoint,
  data,
  method,
}: WebsiteRequestData): Promise<T> {
  try {
    const res = await axios({
      data: data,
      method: method || Methods.POST,
      url: `${BACKEND_URL}/websites${endpoint}`,
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw {
        message: err.response?.data?.message || "Unknown error",
        status: err.response?.status,
        success: err.response?.data?.success || false,
      };
    }

    throw {
      message: "Something went wrong from ourside",
    };
  }
}

export const useWebsiteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<WebsiteResponse, ApiErrorResponse, WebsiteRequestData>({
    mutationFn: async ({
      data,
      endpoint,
      method,
    }: WebsiteRequestData): Promise<WebsiteResponse> =>
      await websiteRequest<WebsiteResponse>({
        data,
        method,
        endpoint: endpoint,
      }),
    mutationKey: ["websiteMutation"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteQuery"] });
    },
    onError: (error) => {
      if (error.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    },
  });
};
export const useWebsiteQuery = <T extends WebsitesResponse | WebsiteResponse>({ endpoint }: WebsiteRequestData) => {
  return useQuery<T, ApiErrorResponse>({
    queryFn: async (): Promise<T> =>
      await websiteRequest<T>({ method: Methods.GET, endpoint }),
    queryKey: ["websiteQuery"],
    // throwOnError(error) {
    //   if (error.status === 401) {
    //     refreshAccessToken()
    //       .then(() => {
    //         return false;
    //       })
    //       .catch(() => {
    //         return false;
    //       });
    //   }
    //   return false;
    // },
  });
};
