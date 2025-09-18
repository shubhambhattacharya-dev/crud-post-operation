import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);        // actual File object
  const [preview, setPreview] = useState(null);  // preview URL (objectURL)
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
      const data = await res.json();
      if (data.error) return null;
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: createPost, isLoading: isPending, isError, error } = useMutation({
    mutationFn: async (formData) => {
      // formData is a FormData instance
      const res = await fetch("/api/posts/create", {
        method: "POST",
        credentials: "include",
        body: formData, // DO NOT set Content-Type header — browser adds boundary
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      setText("");
      setFile(null);
      // revoke object URL
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      if (imgRef.current) imgRef.current.value = "";
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create post");
    },
  });

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      toast.error("Please add text or an image");
      return;
    }

    const formData = new FormData();
    formData.append("text", text.trim());
    if (file) {
      formData.append("image", file); // <-- MUST match multer.single('image')
    }

    createPost(formData);
  };

  const handleImgChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      return;
    }

    // Optional: client-side file size check
    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (f.size > MAX_BYTES) {
      toast.error("Image too large — max 10MB");
      e.target.value = "";
      return;
    }

    setFile(f);
    // create preview
    const url = URL.createObjectURL(f);
    // revoke previous
    if (preview) URL.revokeObjectURL(preview);
    setPreview(url);
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="me" />
        </div>
      </div>

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />

        {preview && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                // clear file + preview
                setFile(null);
                if (imgRef.current) imgRef.current.value = null;
                URL.revokeObjectURL(preview);
                setPreview(null);
              }}
            />
            <img src={preview} className="w-full mx-auto h-72 object-contain rounded" alt="preview" />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current?.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />

          <button className="btn btn-primary rounded-full btn-sm text-white px-4" type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && <div className="text-red-500">{error?.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
