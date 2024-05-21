import {
  IconArmchair,
  IconArmchair2,
  IconBook,
  IconChartArea,
  IconChefHat,
  IconChevronDown,
  IconChevronRight,
  IconCommand,
  IconDeviceTablet,
  IconDevices,
  IconFileInvoice,
  IconFriends,
  IconInfoSquareRounded,
  IconLayoutDashboard,
  IconLifebuoy,
  IconLogout,
  IconPrinter,
  IconReceiptTax,
  IconSearch,
  IconToolsKitchen3,
  IconUser,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { Fragment, useEffect, useState } from "react";
import { iconStroke } from "../config/config";
import AvatarImg from "../assets/avatar.png";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "../controllers/auth.controller";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";
import { SCOPES } from "../config/scopes";

export default function AppBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        btnShowSearchModal();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const user = getUserDetailsInLocalStorage();
  const { role: userRole, scope } = user;
  const userScopes = scope?.split(",");

  const btnLogout = async () => {
    try {
      toast.loading("Please wait...");
      const response = await signOut();
      if (response.status == 200) {
        toast.dismiss();
        toast.success(response.data.message);
        navigate("/", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong! Try later!";
      console.error(error);
      toast.dismiss();
      toast.error(message);
    }
  };

  const btnShowSearchModal = () => {
    document.getElementById("search-modal").showModal();
  };

  const searchItems = [
    {
      title: "Dashboard",
      description: "",
      icon: <IconLayoutDashboard stroke={iconStroke} />,
      link: "/dashboard/home",
      scopes: [SCOPES.DASHBOARD]
    },
    {
      title: "POS - Point of Sale",
      description: "",
      icon: <IconDeviceTablet stroke={iconStroke} />,
      link: "/dashboard/pos",
      scopes: [SCOPES.POS]
    },
    {
      title: "Kitchen",
      description: "",
      icon: <IconChefHat stroke={iconStroke} />,
      link: "/dashboard/kitchen",
      scopes: [SCOPES.KITCHEN, SCOPES.KITCHEN_DISPLAY]
    },
    {
      title: "Orders",
      description: "",
      icon: <IconToolsKitchen3 stroke={iconStroke} />,
      link: "/dashboard/orders",
      scopes: [SCOPES.POS, SCOPES.ORDERS, SCOPES.ORDER_STATUS, SCOPES.ORDER_STATUS_DISPLAY]
    },
    {
      title: "Reservations",
      description: "",
      icon: <IconArmchair2 stroke={iconStroke} />,
      link: "/dashboard/reservation",
      scopes: [SCOPES.RESERVATIONS, SCOPES.VIEW_RESERVATIONS, SCOPES.MANAGE_RESERVATIONS]
    },
    {
      title: "Customers",
      description: "",
      icon: <IconFriends stroke={iconStroke} />,
      link: "/dashboard/customers",
      scopes: [SCOPES.CUSTOMERS, SCOPES.VIEW_CUSTOMERS, SCOPES.MANAGE_CUSTOMERS]
    },
    {
      title: "Invoices",
      description: "",
      icon: <IconFileInvoice stroke={iconStroke} />,
      link: "/dashboard/invoices",
      scopes: [SCOPES.INVOICES]
    },
    {
      title: "Users",
      description: "",
      icon: <IconUsersGroup stroke={iconStroke} />,
      link: "/dashboard/users",
      scopes: [SCOPES.SETTINGS]
    },
    {
      title: "Reports",
      description: "",
      icon: <IconChartArea stroke={iconStroke} />,
      link: "/dashboard/reports",
      scopes: [SCOPES.REPORTS]
    },
    {
      title: "Store Settings",
      description: "",
      icon: <IconInfoSquareRounded stroke={iconStroke} />,
      link: "/dashboard/settings",
      scopes: [SCOPES.SETTINGS]
    },
    {
      title: "Print Settings",
      description: "",
      icon: <IconPrinter stroke={iconStroke} />,
      link: "/dashboard/settings/print-settings",
      scopes: [SCOPES.SETTINGS]
    },
    {
      title: "Store Tables",
      description: "",
      icon: <IconArmchair2 stroke={iconStroke} />,
      link: "/dashboard/settings/tables",
      scopes: [SCOPES.SETTINGS]
    },
    {
      title: "Menu Items",
      description: "",
      icon: <IconBook stroke={iconStroke} />,
      link: "/dashboard/settings/menu-items",
      scopes: [SCOPES.SETTINGS]
    },
    {
      title: "Tax Setup",
      description: "",
      icon: <IconReceiptTax stroke={iconStroke} />,
      link: "/dashboard/settings/tax-setup",
      scopes: [SCOPES.SETTINGS]
    },
    {
      title: "Devices",
      description: "",
      icon: <IconDevices stroke={iconStroke} />,
      link: "/dashboard/devices",
      scopes: []
    },
    {
      title: "Profile",
      description: "",
      icon: <IconUser stroke={iconStroke} />,
      link: "/dashboard/profile",
      scopes: []
    },
    {
      title: "Support",
      description: "",
      icon: <IconLifebuoy stroke={iconStroke} />,
      link: "/dashboard/contact-support",
      scopes: []
    }
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-resolute-border-light w-full bg-white">
        {/* search */}
        <button
          onClick={btnShowSearchModal}
          className="bg-gray-100 text-gray-400  rounded-full flex items-center px-3 py-2 gap-2"
        >
          <IconSearch stroke={iconStroke} />
          <div
            type="text"
            className="bg-transparent outline-none text-start w-48 md:flex items-center justify-between hidden"
            placeholder="Search"
          >
            <p>Search</p>
            <div className="flex items-center gap-2">
              <div className="kbd kbd-sm"><IconCommand stroke={iconStroke} size={20}/></div>
              <div className="kbd kbd-sm">K</div>

            </div>
          </div>
        </button>
        {/* search */}

        {/* profile */}
        <Menu as="div" className="relative inline-block text-left z-50">
          <div>
            <Menu.Button className="text-sm bg-gray-100 hover:bg-gray/30 transition text-resolute-text rounded-full flex items-center gap-0 md:gap-2">
              <img
                src={AvatarImg}
                alt="avatar"
                className="w-10 h-10 rounded-full p-1"
              />
              <p className="font-medium hidden md:block">{user.name}</p>
              <IconChevronDown stroke={iconStroke} className="mr-1" size={18} />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/dashboard/profile"
                      className={`${
                        active
                          ? "bg-gray-100 text-resolute-text"
                          : "text-resolute-text"
                      } group flex gap-2 w-full items-center rounded-2xl px-3 py-2 text-sm`}
                    >
                      <IconUser stroke={iconStroke} />
                      Profile
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/dashboard/devices"
                      className={`${
                        active
                          ? "bg-gray-100 text-resolute-text"
                          : "text-resolute-text"
                      } group flex gap-2 w-full items-center rounded-2xl px-3 py-2 text-sm`}
                    >
                      <IconDevices stroke={iconStroke} />
                      My Devices
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/dashboard/contact-support"
                      className={`${
                        active
                          ? "bg-gray-100 text-resolute-text"
                          : "text-resolute-text"
                      } group flex gap-2 w-full items-center rounded-2xl px-3 py-2 text-sm`}
                    >
                      <IconLifebuoy stroke={iconStroke} />
                      Support
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={btnLogout}
                      className={`${
                        active ? "bg-red-100 text-red-400" : "text-red-400"
                      } group flex gap-2 w-full items-center rounded-2xl px-3 py-2 text-sm`}
                    >
                      <IconLogout stroke={iconStroke} />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        {/* profile */}
      </div>

      <dialog id="search-modal" className="modal">
        <div className="modal-box max-h-96 relative">
          <div className="flex items-center justify-between gap-4 sticky top-0">
            <input type="search" className="input input-bordered w-full" placeholder="Search" autoFocus value={search} onChange={e=>setSearch(e.target.value)} />

            <div>
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn text-slate-500 btn-circle"><IconX stroke={iconStroke} /></button>
              </form>
            </div>
          </div>

          <div className="my-4">
            <form method="dialog">
            {
              searchItems
              .filter((navItem)=>{
                const requiredScopes = navItem.scopes;
                if(userRole == "admin") {
                  return true;
                }

                if(requiredScopes.length == 0) {
                  return true;
                }
    
                return requiredScopes.some((scope)=>userScopes.includes(scope));
              })
              .filter((item)=>item.title.toLowerCase().includes(search.trim().toLowerCase())).map((item, index)=>{
                return <button onClick={()=>navigate(item.link)} key={index} className="w-full flex items-center gap-2 px-4 py-3 mb-2 transition hover:bg-gray-100 active:scale-90 focus:bg-gray-100 rounded-2xl justify-between">
                  <div>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-start">
                    <p>{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <div>
                    <IconChevronRight stroke={iconStroke} />
                  </div>
                </button>
              })
            }
            </form>
          </div>

          <p className="py-4 text-sm text-center text-slate-500">
            Press ESC key or click X button to close
          </p>
        </div>
      </dialog>
    </>
  );
}
