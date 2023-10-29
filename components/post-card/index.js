import { useQueries } from "@/hooks/useQueries";
import { Avatar, useToast } from "@chakra-ui/react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Skeleton,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { useState } from "react";
import IconChat from "../icons/Chat";
import IconLike from "../icons/Like";
import { useRouter } from "next/router";
import { useMutation } from "@/hooks/useMutation";
import IconKebab from "../icons/IconKebab";
import Post from "../post";
import IconRepliesNull from "../icons/IconRepliesNull";

export default function PostCard({ myDataPost }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const [idPost, setIdPost] = useState(null);
  const [replies, setReplies] = useState(null);
  const [post, setPost] = useState(null);

  const router = useRouter();
  const { mutate } = useMutation();
  const toast = useToast();

  const { data: allPost } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/posts?type=all",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    },
  });

  function convertDate(data) {
    const dates = data;
    const date = dates.slice(0, 10);
    const time = dates.slice(11, 16);
    const tgl = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const fulltime = tgl + ", " + time;
    return fulltime;
  }

  async function handleEdit(id) {
    onOpenEdit();
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/post/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    setPost(response?.data);
  }

  function handleDeleteModal(id) {
    onOpenDelete();
    setIdPost(id);
  }

  async function handleDelete() {
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/post/delete/${idPost}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    if (response?.success) {
      toast({
        title: response?.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      router.reload();
    } else {
      toast({
        title: response?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }

  async function handleReplies(id) {
    onOpen();
    setIdPost(id);
    setReplies(null);
    const response = await mutate({
      url: `https://paace-f178cafcae7b.nevacloud.io/api/replies/post/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });

    setReplies(response?.data);
  }

  async function handleLikePost(post) {
    const response = await mutate({
      url: !post?.is_like_post
        ? `https://paace-f178cafcae7b.nevacloud.io/api/likes/post/${post?.id}`
        : `https://paace-f178cafcae7b.nevacloud.io/api/unlikes/post/${post?.id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
      },
    });
    if (response?.success) {
      toast({
        title: !post?.is_like_post ? "Like Success" : "Unlike Success",
        description: response?.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      router.reload();
    } else {
      toast({
        title: !post?.is_like_post ? "Like Failed" : "Unlike Failed",
        description: response?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }
  return (
    <>
      <ScrollShadow
        hideScrollBar
        className="p-5 md:py-10 md:px-5 sm:border-r-1 flex flex-col gap-[16px] max-h-screen"
      >
        {myDataPost && myDataPost.length === 0 ? (
          <div>
            <p>Post is still empty</p>
          </div>
        ) : allPost?.data?.length === 0 ? (
          <div>
            <p>Post is still empty</p>
          </div>
        ) : myDataPost && !myDataPost ? (
          new Array(5)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="h-[136px] rounded-[8px]"
              ></Skeleton>
            ))
        ) : !allPost?.data ? (
          new Array(5)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="h-[136px] rounded-[8px]"
              ></Skeleton>
            ))
        ) : myDataPost && myDataPost.length > 0 ? (
          myDataPost.map((post) => {
            return (
              <section
                key={post?.id}
                className="post-card bg-white max-h-screen"
              >
                <Card className="py-3 px-2">
                  <section className="profile flex justify-between mx-4 ">
                    <div className="flex items-center gap-4">
                      <Avatar name={post?.user?.name} size="md" />
                      <div className="user-detail">
                        <p className="font-medium text-lg">
                          {post?.user?.name} {post?.is_own_post && "(You)"}
                        </p>
                        <p className="text-md">{post?.user?.email}</p>
                        <p className="text-sm">
                          {convertDate(post?.created_at)}{" "}
                          <span
                            className={
                              post?.created_at !== post?.updated_at
                                ? "font-medium bg-slate-200 px-1"
                                : ""
                            }
                          >
                            {post?.created_at !== post?.updated_at && "Edited"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Dropdown>
                      <DropdownTrigger>
                        <div
                          className={
                            post?.is_own_post
                              ? "cursor-pointer mt-3  h-[20px] w-[10px]"
                              : "hidden"
                          }
                        >
                          <IconKebab className="rotate-90" />
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions" className="">
                        <DropdownItem
                          key="edit"
                          onPress={() => handleEdit(post?.id)}
                        >
                          Edit post
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          onPress={() => handleDeleteModal(post?.id)}
                        >
                          Delete post
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </section>
                  <section>
                    <p className="m-4">{post?.description}</p>
                  </section>
                  <section className="flex justify-between gap-3">
                    <Button
                      className="w-1/2"
                      startContent={
                        <IconLike
                          islike={post?.is_like_post ? "#ff0000" : ""}
                        />
                      }
                      size="md"
                      onPress={() => handleLikePost(post)}
                    >
                      {post?.likes_count} Like
                    </Button>
                    <Button
                      className="w-1/2"
                      startContent={<IconChat />}
                      size="md"
                      onPress={() => handleReplies(post?.id)}
                    >
                      {post?.replies_count} Replies
                    </Button>
                  </section>
                </Card>
              </section>
            );
          })
        ) : (
          allPost?.data?.map((post) => {
            return (
              <section
                key={post?.id}
                className="post-card bg-white max-h-screen"
              >
                <Card className="py-3 px-2">
                  <section className="profile flex justify-between mx-4 ">
                    <div className="flex items-center gap-4">
                      <Avatar name={post?.user?.name} size="md" />
                      <div className="user-detail">
                        <p className="font-medium text-lg">
                          {post?.user?.name} {post?.is_own_post && "(You)"}
                        </p>
                        <p className="text-md">{post?.user?.email}</p>
                        <p className="text-sm">
                          {convertDate(post?.created_at)}{" "}
                          <span
                            className={
                              post?.created_at !== post?.updated_at
                                ? "font-medium bg-slate-200 px-1"
                                : ""
                            }
                          >
                            {post?.created_at !== post?.updated_at && "Edited"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Dropdown>
                      <DropdownTrigger>
                        <div
                          className={
                            post?.is_own_post
                              ? "cursor-pointer mt-3  h-[20px] w-[10px]"
                              : "hidden"
                          }
                        >
                          <IconKebab className="rotate-90" />
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions" className="">
                        <DropdownItem
                          key="edit"
                          onPress={() => handleEdit(post?.id)}
                        >
                          Edit post
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          onPress={() => handleDeleteModal(post?.id)}
                        >
                          Delete post
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </section>
                  <section>
                    <p className="m-4">{post?.description}</p>
                  </section>
                  <section className="flex justify-between gap-3">
                    <Button
                      className="w-1/2"
                      startContent={
                        <IconLike
                          islike={post?.is_like_post ? "#ff0000" : ""}
                        />
                      }
                      size="md"
                      onPress={() => handleLikePost(post)}
                    >
                      {post?.likes_count} Like
                    </Button>
                    <Button
                      className="w-1/2"
                      startContent={<IconChat />}
                      size="md"
                      onPress={() => handleReplies(post?.id)}
                    >
                      {post?.replies_count} Replies
                    </Button>
                  </section>
                </Card>
              </section>
            );
          })
        )}

        {/* Edit Modal */}
        <Modal
          className="overflow-hidden h-[80%]"
          isOpen={isOpenEdit}
          onOpenChange={onOpenChangeEdit}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Post
                </ModalHeader>
                <Post
                  url={`post/update/${post?.id}`}
                  method="PATCH"
                  button="Reply"
                  placeholder={post?.description}
                  value={post?.description}
                />
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete Post
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure wanna delete this post?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => handleDelete(post?.id)}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Replies modal */}
        <Modal
          className="overflow-hidden h-[80%]"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Replies Post
                </ModalHeader>
                <Post
                  url={`replies/post/${idPost}`}
                  button="Reply"
                  placeholder="reply post ..."
                />
                <ScrollShadow
                  hideScrollBar
                  className="p-5 md:py-4 md:px-1 sm:border-r-1 flex flex-col gap-[16px]"
                >
                  <ModalBody className="p-0">
                    {replies?.length === 0 ? (
                      <div className="mx-auto mt-5 mb-5">
                        <IconRepliesNull className="mx-auto" />
                        <p>Komentar masih kosong</p>
                      </div>
                    ) : !replies ? (
                      new Array(3)
                        .fill(null)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            className="mx-auto h-[90px] w-[90%] rounded-[8px]"
                          ></Skeleton>
                        ))
                    ) : (
                      replies?.map((reply) => (
                        <Card className="py-[6px] mx-5 mb-2">
                          <section className="profile flex justify-between mx-4 ">
                            <div className="mt-1">
                              <Chip
                                className="pl-0 font-medium text-md"
                                size="md"
                              >
                                <Avatar
                                  className="mr-1"
                                  name={reply?.user?.name}
                                  size="xs"
                                />
                                {reply?.user?.name}{" "}
                                {reply?.is_own_reply && "(You)"}
                              </Chip>
                              <div className="user-detail mt-1">
                                <p className="text-sm">
                                  {convertDate(reply?.created_at)}
                                </p>
                              </div>
                            </div>
                          </section>
                          <section>
                            <p className="m-4">{reply?.description}</p>
                          </section>
                        </Card>
                      ))
                    )}
                  </ModalBody>
                </ScrollShadow>
              </>
            )}
          </ModalContent>
        </Modal>
      </ScrollShadow>
    </>
  );
}
