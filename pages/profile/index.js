import Post from "@/components/post";
import PostCard from "@/components/post-card";
import ProfileCard from "@/components/profile-card";
import { useQueries } from "@/hooks/useQueries";
import Layout from "@/layout";
import { ScrollShadow, Skeleton } from "@nextui-org/react";
import Cookies from "js-cookie";

export default function Profile() {
  const { data: myPost } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/posts?type=me",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    },
  });

  const { data: myData } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/user/me",
    headers: {
      Authorization: `Bearer ${Cookies.get("user_token")}`,
    },
  });

  const dataPost = myPost?.data.filter((item) => item.is_own_post);

  return (
    <Layout metaTitle="Home">
      <div className="mx-auto max-w-xl max-h-screen bg-white">
        <ScrollShadow
          hideScrollBar
          className="p-5 md:py-4 md:px-5 sm:border-r-1 flex flex-col gap-[16px] max-h-screen"
        >
          <ProfileCard
            name={myData?.data?.name}
            email={myData?.data?.email}
            hobby={myData?.data?.hobby}
            dob={myData?.data?.dob}
            phone={myData?.data?.phone}
          />
          <Post />
          {!myPost ? (
            new Array(5)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[136px] rounded-[8px]"
                ></Skeleton>
              ))
          ) : dataPost.length === 0 ? (
            <div>
              <p>Post is still empty</p>
            </div>
          ) : (
            <PostCard myDataPost={dataPost} />
          )}
        </ScrollShadow>
      </div>
    </Layout>
  );
}
