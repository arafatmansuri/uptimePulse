import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL, Methods } from "../constants";
import { ApiErrorResponse, AuthResponse } from "../responses";
import { AuthRequestData } from "../requests";

async function auth({endpoint,data,method}:AuthRequestData): Promise<AuthResponse> {
    try {
        const res = await axios({
        data:data,
        method: Methods[method || Methods.POST],
        url: `${BACKEND_URL}/users${endpoint}`,
        withCredentials:true
        })
        return res.data;
    }

    catch(err){
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

export const useAuthMutation = () => useMutation<AuthResponse,ApiErrorResponse,AuthRequestData>({
    mutationFn: async ({data,endpoint}:AuthRequestData): Promise<AuthResponse> => await auth({data,method:Methods.POST,endpoint:endpoint}),
    mutationKey: ['authMutation']
});
export const useAuthQuery = ({endpoint}:AuthRequestData) => useQuery<AuthResponse,ApiErrorResponse>({
    queryFn: async (): Promise<AuthResponse> => await auth({method:Methods.GET,endpoint}),
    queryKey: ['authQuery']
});