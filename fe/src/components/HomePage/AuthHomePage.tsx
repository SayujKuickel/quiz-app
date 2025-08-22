import axios from "axios";
import { useEffect, useState } from "react";
import MyInformation from "../../MyInformation";

export interface IAuthUserList {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  __v: number;
}

function AuthHomePage() {
  const [users, setUsers] = useState<IAuthUserList[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    async function fetchData() {
      axios
        .get("http://localhost:3000/users/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const userList: IAuthUserList[] = response?.data?.users || [];
          setUsers(userList);
        })
        .catch((error) => {
          console.log("error => ", error);
          const errors = error?.response?.data?.message || "An error occurred";
          alert(errors);
        });
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-primary drop-shadow-lg">
        User List
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user, index) => {
          return (
            <div
              key={index}
              className="neo-card p-6 rounded-lg bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              <MyInformation
                id={user?._id}
                name={user?.name}
                email={user?.email}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AuthHomePage;
