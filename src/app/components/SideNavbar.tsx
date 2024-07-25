import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
      <div className="flex items-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer">
        {icon && <div className="text-2xl text-gray-400 mr-3">{icon}</div>}
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-70 w-64 h-screen pt-90 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-white shadow-2xl`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col justify-center px-5 pb-4 overflow-y-auto">
        <div className="flex items-center py-4">
          <img src="/images/img.png" alt="Veterinary Logo" className="w-10 h-10 mr-3" />
          <div className="text-blue-500 text-2xl font-bold">Veterinary</div>
        </div>
        <div className="py-4 text-sm text-gray-500">MENU</div>
        <ul className="space-y-2 font-medium">
          <NavItem href="/Dashboard" icon={<MdOutlineSpaceDashboard />} label="Dashboard" />
          <Disclosure as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                  <span className="flex items-center">
                    <span>Gestion de stock</span>
                  </span>
                  <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="pl-4 space-y-2">
                  <NavItem href="/listemedicament" icon={<AiFillMedicineBox />} label="Médicament" />
                  <NavItem href="/listematerielconsommable" icon={<GiDogBowl />} label="Matériel Consommable" />
                  <NavItem href="/listeproduitalimentaire" icon={<GiChickenLeg />} label="Produit Alimentaire" />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                  <span className="flex items-center">
                    <span>Gestion clientèle</span>
                  </span>
                  <GiHamburgerMenu className={`w-5 h-5 text-gray-400 ${open ? 'transform rotate-90' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className="pl-4 space-y-2">
                  <NavItem href="/listeclient" icon={<BsFillFileTextFill />} label="Clients" />
                  <NavItem href="/gestion d'animal" icon={<BsFillFileTextFill />} label="Animals" />
                  <NavItem href="/historique-client" icon={<BsFillFileTextFill />} label="Historique des Clients" />
                  <NavItem href="/historique-animal" icon={<BsFillFileTextFill />} label="Historique des Animaux" />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100">
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
                <Disclosure.Button className="flex items-center justify-between w-full p-2 rounded-lg text-gray-500 hover:bg-gray-100">
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
          <div className="py-4 text-sm text-gray-500">OTHERS</div>
          <NavItem href="/" icon={<MdOutlineLogout />} label="Logout" onClick={handleLogout} />
        </ul>
      </div>
    </aside>
  );
};

export default SideNavbar;
