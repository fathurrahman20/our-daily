import { useQueries } from "@/hooks/useQueries";
import Layout from "@/layout";
import { Avatar } from "@chakra-ui/react";
import { Card, Chip, ScrollShadow } from "@nextui-org/react";
import Cookies from "js-cookie";

export default function NotificationPages() {
  const { data: notif } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/notifications",
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

  return (
    <Layout metaTitle="Home">
      <div className="mx-auto max-w-xl max-h-screen bg-white">
        <ScrollShadow
          hideScrollBar
          className="p-5 md:py-10 md:px-5 sm:border-r-1 flex flex-col gap-[16px] max-h-screen"
        >
          {notif?.data?.map((item) => (
            <Card className="pl-3 pt-3 pb-10">
              <section className="profile">
                <div className="flex gap-4">
                  <Chip className="pl-0 font-medium text-md" size="md">
                    <Avatar className="mr-1" name={item.user?.name} size="xs" />
                    {item.user?.name}
                  </Chip>
                  <p className="">
                    {item.remark === "like"
                      ? "like your post"
                      : "reply your post"}
                    , {convertDate(item?.created_at)}
                  </p>
                </div>
              </section>
            </Card>
          ))}
        </ScrollShadow>
      </div>
    </Layout>
  );
}
