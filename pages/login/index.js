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
    email: "",
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

  const handleLogin = async () => {
    if (payload.email.length === 0 || payload.password.length === 0) {
      return toast({
        title: "Login Gagal",
        description: "Email dan Password wajib diisi",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    const response = await mutate({
      url: "https://paace-f178cafcae7b.nevacloud.io/api/login",
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
      //   alert("Emaildan Password salah");
      toast({
        title: "Login Gagal",
        description: "Email dan Password tidak sesuai",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      Cookies.set("user_token", response?.data?.token, {
        expires: new Date(response?.data?.expires_at),
        path: "/",
      });
      toast({
        title: "Login Berhasil",
        description: "Anda akan dialihkan ke halaman home",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        router.push("/");
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
          <Button size="md" color="primary" onClick={handleLogin}>
            Sign In
          </Button>
          <p className="mt-3">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium">
              Register here
            </Link>
          </p>
        </CardBody>
      </Card>
    </Flex>
  );
}
