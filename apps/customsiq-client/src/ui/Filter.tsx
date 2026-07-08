import { IoFilterSharp } from "react-icons/io5";


const HeaderWithFilter = ({ title }: { title: string }) => {


  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <span>{title}</span>
      <IoFilterSharp className="text-gray-800 text-xs hover:text-gray-600" />
    </div>
  );
};

export default HeaderWithFilter