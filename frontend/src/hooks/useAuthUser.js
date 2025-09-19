import { useQuery } from "@tanstack/react-query";

const useAuthUser = () => {
	return useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});
};

export default useAuthUser;
