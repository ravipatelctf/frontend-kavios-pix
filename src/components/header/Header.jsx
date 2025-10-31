// src/components/header/Header.jsx

import { Link } from "react-router-dom";
import { AuthAction } from "./AuthAction";
import { HeaderProvider, useHeaderContext } from "./HeaderContext";
import { NAV_LINKS } from "./constants";
import { HamburgerToggleButton } from "./HamburgerToggleButton";


function NavLinks() {
  return (

    <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
      {NAV_LINKS.map(({ to, label }) => (
        <Link key={to} to={to} className="hover:text-indigo-600 transition-colors">
          {label}
        </Link>
      ))}
    </div>

  );
}

function MobileDropdownMenu() {
  const {  menuOpen } = useHeaderContext();
  return (

    <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${menuOpen ? "max-h-96" : "max-h-0"}`}>
      <div className="flex flex-col space-y-3 pb-3 text-gray-700 font-medium">
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} className="hover:text-indigo-600 transition-colors">
            {label}
          </Link>
        ))}
        <div className="border-t border-gray-200 pt-3">
          <AuthAction variant="link" />
        </div>
      </div>
    </div>

  );
}

function BrandLogo() {
  return (

    <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"> KaviosPix </Link>
    
  );
}

function AuthButtons() {
  return (

    <div className="hidden md:flex items-center gap-3">
      <AuthAction variant="primary" />
    </div>

  );
}

export function Header() {
  return (

    <HeaderProvider>
      <header className="shadow-sm border-b border-gray-200 bg-white">
        <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <BrandLogo />
            <NavLinks />
            <AuthButtons />
            <HamburgerToggleButton />
          </div>
          <MobileDropdownMenu />
        </nav>
      </header>
    </HeaderProvider>

  );
}
