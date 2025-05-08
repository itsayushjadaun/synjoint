
import { Link } from "react-router-dom";

interface NavItem {
  name: string;
  href: string;
  ref?: React.RefObject<HTMLAnchorElement>;
}

interface NavLinksProps {
  menuItems: NavItem[];
}

const NavLinks = ({ menuItems }: NavLinksProps) => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          ref={item.ref as React.RefObject<HTMLAnchorElement>}
          className="text-gray-800 dark:text-gray-200 hover:text-synjoint-blue dark:hover:text-synjoint-lightblue transition-colors duration-200 font-medium text-sm animate-link flex items-center gap-1"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
