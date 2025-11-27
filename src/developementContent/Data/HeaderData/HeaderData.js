import { FiGrid } from "react-icons/fi";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";
import { PiTagSimple } from "react-icons/pi";

export const HeaderData = [
  {
    id: 1,
    name: "Dashboard",
    href: "/user",
  },
  {
    id: 2,
    name: "My Cases",
    href: "/user/my-cases",
  },
  {
    id: 3,
    name: "Support Center",
    href: "/user/support-center",
  },
];


export const StaffHeaderData = [
  {
    id: 1,
    name: "Dashboard",
    href: "/",
    icon: <FiGrid size={24} />,
  },
  {
    id: 2,
    name: "Case Management",
    href: "/case-management",
    icon: <FaRegFolderClosed size={24}  />,
  },
  {
    id: 3,
    name: "User Management",
    href: "/user-management",
    icon: <FaRegUser size={24} />,
  },
];


export const StaffToolsData = [
  {
    id: 1,
    name: "KPI Tracking",
    href: "/audit-tracking",
    icon: <FiPieChart size={24}  />,
  },
  {
    id: 2,
    name: "Document Management",
    href: "/document-management",
    icon: <IoDocumentTextOutline size={24}  />,
  },
  {
    id: 3,
    name: "Support",
    href: "/support",
    icon: <BsQuestionCircle size={24}  />,
  }
];

export const financesData = [
  {
    id: 1,
    name: "Jurisdiction Management",
    href: "/audit-tracking",
    icon: <PiTagSimple size={24}  />,
  },
]