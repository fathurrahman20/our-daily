import { createContext } from "react";
import Cookies from "js-cookie";
import { useQueries } from "@/hooks/useQueries";

export const UserContext = createContext();

export function UserContextProvider({ children, ...props }) {
  const { data: userData } = useQueries({
    prefixUrl: "https://paace-f178cafcae7b.nevacloud.io/api/user/me",
    headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
  });

  return (
    <UserContext.Provider value={userData?.data || null} {...props}>
      {children}
    </UserContext.Provider>
  );
}
