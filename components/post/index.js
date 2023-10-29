import { useMutation } from "@/hooks/useMutation";
import { useToast } from "@chakra-ui/react";
import { Button, Card, Textarea } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Post({
  setIsPost,
  value,
  method,
  url = "post",
  button = "Post",
  placeholder = "What's happening...",
}) {
  const [post, setPost] = useState(value ? value : "");
  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();
  async function handlePost() {
    setIsPost && setIsPost(true);
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/${url}`,
      ...(method === "PATCH" && { method }),
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
      payload: {
        description: post,
      },
    });

    if (!response?.success) {
      toast({
        title: response?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      setPost("");
      toast({
        title: response?.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      router.reload();
    }
    setIsPost && setIsPost(false);
  }

  return (
    <div className="max-w-2xl bg-white p-5">
      <Card className="p-5">
        <Textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          variant="flat"
          placeholder={placeholder}
          className="col-span-12 md:col-span-6 mb-6 md:mb-0 border-cyan-500"
        />
        <Button
          isDisabled={post.length === 0 && true}
          className="w-full mt-2 text-md"
          color="primary"
          size="sm"
          onClick={handlePost}
        >
          {button}
        </Button>
      </Card>
    </div>
  );
}
