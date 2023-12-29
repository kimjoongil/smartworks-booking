"use client";
import Link from "next/link";
import Image from "next/image";
import Container from "../Container";
import { usePathname } from "next/navigation";
import { SafeUser } from "@/types";
import UserMenu from "./UserMenu";
import DateTimeClock from "../DateTimeClock";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {

  const pathname = usePathname();  
  const isDisplayPage = pathname.startsWith("/displays/");

  return (
    <>
      {!isDisplayPage ? (
        <div className="relative h-[60px] mx-auto z-20">
          <div className="fixed w-full bg-slate-800 z-1 shadow-sm">
            <Container>
              <div className="flex w-full">
                <nav className="navbar flex w-full my-auto p-3 border-b border-b-slate-700 justify-between">
                  <Link href="/">
                    <Image
                      src="/images/asone_logo_white.svg"
                      width={150}
                      height={40}
                      priority
                      alt={"ASONE"}
                    />
                  </Link>
                  <UserMenu currentUser={currentUser} />
                </nav>
              </div>
            </Container>
          </div>
        </div>
      ) : (        
        ""
      )}
    </>
  );
};

export default Navbar;
