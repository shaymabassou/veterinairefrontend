// components/SideNavbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Assurez-vous d'importer useRouter correctement depuis next/router
import { GiHamburgerMenu, GiDogBowl, GiChickenLeg } from 'react-icons/gi';
import { Disclosure } from '@headlessui/react';
import { MdOutlineSpaceDashboard, MdOutlineLogout } from 'react-icons/md';
import { AiFillMedicineBox, AiOutlineFileText } from 'react-icons/ai';
import { RiBillLine } from 'react-icons/ri';
import { BsFillFileTextFill } from 'react-icons/bs';

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavItem = ({ href, icon, label }) => (
    <Link href={href} passHref>
      <div className="flex items-center p-2 rounded-lg text-white hover:bg-blue-700 cursor-pointer">
        {icon && <div className="text-2xl text-gray-400 mr-3">{icon}</div>}
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-70 w-64 h-screen pt-90 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-gray-500 border-r border-gray-700 shadow-2xl`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-center px-5 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <NavItem href="/Dashboard" icon={<MdOutlineSpaceDashboard />} label="Dashboard" />
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-blue-700">
                    <span className="flex items-center">
                      <span>Gestion de stock</span>
                    </span>
                    <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pl-4 space-y-2">
                    <NavItem href="/listemedicament" icon={<AiFillMedicineBox />} label="Médicament" />
                    <NavItem href="/stock/materiel-consommable" icon={<GiDogBowl />} label="Matériel Consommable" />
                    <NavItem href="/stock/produit-alimentaire" icon={<GiChickenLeg />} label="Produit Alimentaire" />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-blue-700">
                    <span className="flex items-center">
                      <span>Gestion clientèle</span>
                    </span>
                    <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pl-4 space-y-2">
                    <NavItem href="/clients" icon={<BsFillFileTextFill />} label="Clients" />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-blue-700">
                    <span className="flex items-center">
                      <span>Gestion d'animal</span>
                    </span>
                    <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pl-4 space-y-2">
                    <NavItem href="/animals" icon={<BsFillFileTextFill />} label="Animals" />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-blue-700">
                    <span className="flex items-center">
                      <span>Ordonnance</span>
                    </span>
                    <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pl-4 space-y-2">
                    <NavItem href="/prescriptions" icon={<AiOutlineFileText />} label="Ordonnances" />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-blue-700">
                    <span className="flex items-center">
                      <span>Facturation</span>
                    </span>
                    <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                  </Disclosure.Button>
                  <Disclosure.Panel className="pl-4 space-y-2">
                    <NavItem href="/billing" icon={<RiBillLine />} label="Factures" />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <NavItem href="/" icon={<MdOutlineLogout />} label="Logout" onClick={handleLogout} />
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideNavbar;
