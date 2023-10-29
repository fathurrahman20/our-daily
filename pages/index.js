import Post from "@/components/post";
import PostCard from "@/components/post-card";
import { useQueries } from "@/hooks/useQueries";
import Layout from "@/layout";
import { ScrollShadow, Skeleton } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Home() {
  const [isPost, setIsPost] = useState(false);

  return (
    <Layout metaTitle="Home">
      <div className="mx-auto max-w-xl max-h-screen bg-white">
        <Post setIsPost={setIsPost} />
        <PostCard isPost={isPost} />
      </div>
    </Layout>
  );
}
