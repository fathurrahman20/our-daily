import { Avatar } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

export default function ProfileCard({ name, email, hobby, dob, phone }) {
  return (
    <div className="max-w-2xl bg-white px-5 pt-3">
      <Card className="w-full mx-auto">
        <CardHeader className="flex flex-col">
          <Avatar name={name} size="md" />
          <p className="text-small text-default-500">{name}</p>
        </CardHeader>
        <Divider />
        <CardBody>
          <section className="flex justify-between">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm">{email}</p>
            </div>
            <div>
              <p className="font-medium">Hobby</p>
              <p className="text-sm">{hobby || "-"}</p>
            </div>
            <div>
              <p className="font-medium">Date of Borth</p>
              <p className="text-sm">{dob || "-"}</p>
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm">{phone || "-"}</p>
            </div>
          </section>
        </CardBody>
      </Card>
    </div>
  );
}
