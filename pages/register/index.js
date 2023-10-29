import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { Flex, useToast } from "@chakra-ui/react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    hobby: "",
    password: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { mutate } = useMutation();
  const toast = useToast();
  const router = useRouter();

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (payload?.email === "") return false;

    return validateEmail(payload?.email) ? false : true;
  }, [payload?.email]);

  const handleRegister = async () => {
    if (
      payload.name.length === 0 ||
      payload.email.length === 0 ||
      payload.password.length === 0
    ) {
      return toast({
        title: "Pendaftaran Gagal",
        description: "Nama, Email dan Password wajib diisi",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: top,
      });
    }
    const response = await mutate({
      url: "https://paace-f178cafcae7b.nevacloud.io/api/register",
      payload,
    });

    if (isInvalid) {
      return toast({
        title: "Format Email Salah",
        description: "Mohon masukkan email dengan benar ",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    if (!response.success) {
      toast({
        title: "Register Gagal",
        description: "Kayanya email sudah didaftarkan nih",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: response?.message,
        description: "Anda akan dialihkan ke halaman login",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  };
  return (
    <Flex
      className="items-center h-screen"
      alignItems="center"
      justifyContent="center"
    >
      <Card className="w-[500px]">
        <CardHeader>
          <p className="text-md font-medium text-center">
            Our Daily | Sign in to Your Account
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            label="Name"
            isRequired
            variant="bordered"
            placeholder="Enter your name"
            onChange={(event) =>
              setPayload({ ...payload, name: event.target.value })
            }
            value={payload?.name}
            type="text"
            className="w-full my-3"
          />
          <Input
            isRequired
            value={payload?.email}
            type="email"
            label="Email"
            variant="bordered"
            placeholder="Enter Your email"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : ""}
            errorMessage={isInvalid && "Please enter a valid email"}
            onChange={(event) =>
              setPayload({ ...payload, email: event.target.value })
            }
            className="w-full"
          />
          <Input
            label="DoB"
            variant="bordered"
            placeholder=""
            onChange={(event) =>
              setPayload({ ...payload, dob: event.target.value })
            }
            value={payload?.dob}
            type="date"
            className="w-full my-3"
          />
          <Input
            label="Phone"
            variant="bordered"
            placeholder="Enter your phone"
            onChange={(event) =>
              setPayload({ ...payload, phone: event.target.value })
            }
            value={payload?.phone}
            type="text"
            className="w-full my-3"
          />
          <Input
            label="Hobby"
            variant="bordered"
            placeholder="Enter your hobby"
            onChange={(event) =>
              setPayload({ ...payload, hobby: event.target.value })
            }
            value={payload?.hobby}
            type="text"
            className="w-full my-3"
          />
          <Input
            label="Password"
            isRequired
            variant="bordered"
            placeholder="Enter your password"
            onChange={(event) =>
              setPayload({ ...payload, password: event.target.value })
            }
            value={payload?.password}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="w-full my-3"
          />
          <Button size="md" color="primary" onClick={handleRegister}>
            Sign Up
          </Button>
          <p className="mt-3">
            Have an account?{" "}
            <Link href="/login" className="font-medium">
              Login here
            </Link>
          </p>
        </CardBody>
      </Card>
    </Flex>
  );
}
