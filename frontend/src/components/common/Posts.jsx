import { useEffect } from "react";
import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ feedType }) => {
	const getPostEndPoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndPoint();

	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts", feedType],
		queryFn: async () => {
			const res = await fetch(POST_ENDPOINT, { credentials: "include" });
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		},
	});

	useEffect(() => {
		refetch(); 
	}, [feedType, refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
