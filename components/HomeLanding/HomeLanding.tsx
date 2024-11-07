"use client";
import React, { useState, useEffect, Suspense, useRef, Fragment } from "react";
import useThemeMode from "@/tool/useThemeMode/useThemeMode";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { baseurl } from "@/tool/BaseURL/BaseURL";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import Image from "next/image";
import $ from "jquery";
import { useCartStore, ZustandProps } from "./store/useHomeLanding";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import AOS from "aos";
import "aos/dist/aos.css";

export default function HomeLanding() {
  const [count, setCount] = useState(1);

  // Register Service worker
  const url = process.env.NODE_ENV === "development" ? "" : "/Lamborghini";
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swURL = `${url}/sw.js`;
      const swScope = `${url}/`;

      (async () => {
        try {
          const registerSW = await navigator.serviceWorker.register(swURL, {
            scope: swScope,
          });

          if (registerSW.installing) {
            console.log("installing");
            registerSW.installing?.addEventListener("statechange", (e) => {
              const target = e.target as ServiceWorker;
              if (target.state === "activated") {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            });
          }

          if (registerSW.active) {
            registerSW.active.postMessage({ type: "CHECK_CACHE_STATUS" });
          }

          // Listen for messages from the service worker
          function handleServiceWorkerMessage(event: MessageEvent) {
            if (event.data && event.data.type === "CACHE_PROGRESS") {
              setCount(event.data.progress);
            } else if (event.data && event.data.type === "CACHE_COMPLETE") {
              setCount(100);
            }
          }

          // Add the event listener for service worker messages
          navigator.serviceWorker.addEventListener(
            "message",
            handleServiceWorkerMessage
          );

          // On component unmount, remove the event listener
          return () => {
            navigator.serviceWorker.removeEventListener(
              "message",
              handleServiceWorkerMessage
            );
          };
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      })();
    }
  }, [url]);

  // Show Hide
  const [isLoadOver, setisLoadOver] = useState<boolean>(false);
  useEffect(() => {
    $("html, body").css({
      overflow: "hidden",
      height: "100%",
    });

    if (count === 100) {
      $("html, body").css({
        overflow: "auto",
        height: "auto",
      });
      setTimeout(() => {
        $("#loading").hide();
        setisLoadOver(true);
      }, 2000);
    }
  }, [count]);

  // Aos Animation
  useEffect(() => {
    if (!isLoadOver) return;

    AOS.init({
      offset: 120, // Reduced offset for smoother snapping
      duration: 800, // Adjust duration as needed
      easing: "ease-in-out",
      delay: 300, // Shorter delay to avoid snap interference
      once: false, // Ensures animation runs only once
    });

    const container = document.getElementById("container");
    container?.addEventListener("scroll", aosObserver);
  }, [isLoadOver]);

  return (
    <div
      id="container"
      className="w-full h-screen flex flex-col overflow-y-scroll snap-y snap-mandatory relative"
    >
      <Loading number={count} />

      {/* Snap Sections with margin to offset from the fixed navbar */}
      {isLoadOver === true && (
        <Fragment>
          {/* Fixed Navigation */}
          <div className="fixed top-0 w-full z-10">
            <Navigation />
          </div>
          <Container3D />
          <CarBlockContainer />
          <Power />
          <Overview />
          <Design />
          <Specifications />
          <SteeringSuspension />
          <Engine />
          <Wheels />
          <Footer lastComponent="Wheels" />
        </Fragment>
      )}
    </div>
  );
}

export const Navigation = () => {
  const { theme, setTheme } = useThemeMode();

  // Detect Mobile
  const [isMobile, setisMobile] = useState<boolean>(false);
  useEffect(() => {
    const mobile = window.matchMedia(
      "(min-width: 320px) and (max-width: 767px)"
    ).matches;
    switch (mobile) {
      case true:
        setisMobile(true);
        break;
      case false:
        setisMobile(false);
        break;

      default:
        break;
    }
  }, []);

  // Oder Data Data

  const { data }: ZustandProps = useCartStore();

  // Data Mobile Navigation
  const mobileNavigation = [
    {
      title: "Design",
      href: "#Design",
    },
    {
      title: "Specifications",
      href: "#Specifications",
    },
    {
      title: "Suspension",
      href: "#SteeringSuspension",
    },
    {
      title: "Engine",
      href: "#Engine",
    },
  ];

  if (isMobile) {
    return (
      <header className="w-full sm:px-[5%] flex justify-between items-center pt-3 pb-12">
        <div className="flex items-center">
          <Image
            src={`${baseurl + "asset/logo.svg"}`}
            width={40}
            height={42}
            alt="logo"
          />
        </div>
        <MobileNavigation
          dataMenu={mobileNavigation}
          title={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-align-right w-[30px] h-[30px]"
            >
              <path d="M21 12H9" />
              <path d="M21 18H7" />
              <path d="M21 6H3" />
            </svg>
          }
          extraButton={
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full bg-[--gold] text-white px-[1rem] py-[.5rem] text-sm font-bold flex flex-row justify-center rounded-[10px]"
            >
              <div className="flex flex-row items-center">
                {theme === "dark" ? (
                  <Fragment>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-sun w-[15px] h-[15px] mr-[5px]"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                    <span>Light</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-moon w-[15px] h-[15px] mr-[5px]"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                    <span>Dark</span>
                  </Fragment>
                )}
              </div>
            </button>
          }
        />
      </header>
    );
  }
  return (
    <header className="container mx-auto lg:px-[3%] md:px-[5%] w-full md:flex sm:hidden flex justify-between items-center xl:px-0 md:p-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <Image
          src={`${baseurl + "asset/logo.svg"}`}
          width={40}
          height={42}
          alt="logo"
        />
      </div>
      <nav className="flex space-x-4 items-center bg-background dark:bg-background lg:ml-20 px-6 py-2 rounded-full">
        {mobileNavigation.map((list, index) => (
          <a
            key={index + list.title}
            href="#Section03"
            className="text-gray-600 hover:text-[--gold] dark:text-white dark:hover:text-[--gold] text-sm font-bold px-[1rem]"
          >
            {list.title}
          </a>
        ))}
      </nav>
      <div className="flex space-x-4 items-center">
        <Dialog
          title={"Order"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-baggage-claim w-[20px] h-[20px] stroke-gray-600 dark:stroke-white"
            >
              <path d="M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2" />
              <path d="M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10" />
              <rect width="13" height="8" x="8" y="6" rx="1" />
              <circle cx="18" cy="20" r="2" />
              <circle cx="9" cy="20" r="2" />
            </svg>
          }
          dataList={data} // replace with [orderData]
          textBTNcolor="white"
          space={false}
        />
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-[--gold] text-white rounded-full px-[1rem] py-[.5rem] text-sm font-bold flex flex-row items-center"
        >
          {theme === "dark" ? (
            <Fragment>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun w-[15px] h-[15px] mr-[5px]"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span>Light</span>
            </Fragment>
          ) : (
            <Fragment>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon w-[15px] h-[15px] mr-[5px]"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dark</span>
            </Fragment>
          )}
        </button>
      </div>
    </header>
  );
};

type MobileNavigationProps = {
  title: string | JSX.Element;
  dataMenu: {
    title: string;
    href: string;
  }[];
  extraButton: JSX.Element;
};
export const MobileNavigation = ({
  title,
  dataMenu,
  extraButton,
}: MobileNavigationProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{title}</SheetTrigger>
      <SheetContent className="w-[100vw] m-0">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="w-full h-fit flex flex-col  items-center">
          <ul className="w-full my-6">
            {dataMenu.map((list, index) => (
              <li
                key={index + list.title}
                className="w-full text-lg hover:text-gray-600 font-bold border-b p-3"
                onClick={() => {
                  setOpen(false);

                  setTimeout(() => {
                    router.push(list.href);
                  }, 1000);
                }}
              >
                {list.title}
              </li>
            ))}
          </ul>
          {extraButton && (
            <div className="w-full absolute bottom-2 left-0 right-0 p-6">
              {extraButton}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

type Loading = {
  number: number;
};
export const Loading = ({ number }: Loading) => {
  return (
    <div
      id="loading"
      className={`w-full h-screen flex justify-center items-center z-49 bg-background `}
    >
      <div className="w-1/3 mx-auto flex flex-col items-center mb-[11vh]">
        <Image
          src={`${baseurl + "asset/logo.svg"}`}
          width={40*3}
          height={42*3}
          alt="logo"
          className="w-[120px] h-[128px] mb-4"
        />
        <h1 className="text-black dark:text-white text-sm font-semibold">
          Loading
        </h1>
        <Progress
          value={number}
          className="w-full bg-white dark:bg-black my-3"
        />
        <h5 className="text-black dark:text-white text-sm font-semibold">
          {number}%
        </h5>
      </div>
    </div>
  );
};

export const CarBlockContainer = () => {
  return (
    <div className="w-full h-screen absolute top-0 left-0 right-0 bottom-0 bg-transparent z-1">
      <div className="w-full h-screen"></div>
      <div className="w-full h-screen flex lg:flex-row md:flex-row sm:flex-col">
        <div className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full"></div>
        <div
          data-aos="fade-left"
          className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full bg-white dark:bg-[#181818]"
        ></div>
      </div>
      <div className="w-full h-screen flex lg:flex-row md:flex-row sm:flex-col-reverse">
        <div
          data-aos="fade-right"
          className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full bg-white dark:bg-[#181818]"
        ></div>
        <div className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full"></div>
      </div>
      <div className="w-full h-screen flex lg:flex-row md:flex-row sm:flex-col">
        <div className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full"></div>
        <div
          data-aos="fade-left"
          className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full bg-white dark:bg-[#181818]"
        ></div>
      </div>
      <div className="w-full h-screen flex lg:flex-row md:flex-row sm:flex-col-reverse">
        <div
          data-aos="fade-right"
          className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full bg-white dark:bg-[#181818]"
        ></div>
        <div className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full"></div>
      </div>
      <div className="w-full h-screen flex lg:flex-row md:flex-row sm:flex-col">
        <div className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full"></div>
        <div
          data-aos="fade-left"
          className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full bg-white dark:bg-[#181818]"
        ></div>
      </div>
      <div className="w-full h-screen flex lg:flex-row md:flex-row sm:flex-col-reverse">
        <div
          data-aos="fade-right"
          className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full bg-white dark:bg-[#181818]"
        ></div>
        <div className="md:w-1/2 md:h-screen sm:h-[50vh] sm:w-full"></div>
      </div>
    </div>
  );
};

export const Power = () => {
  return (
    <div
      id="Power"
      className="section snap-start shrink-0 w-full h-[100dvh] flex flex-col items-center md:container md:mx-auto relative"
    >
      <div className="lg:w-1/3 md:w-1/2 sm:w-[90%] text-center mt-[11vh]">
        <h5 className="text-center text-[--gold] md:text-3xl sm:2xl font-semibold">
          Lamborghini
        </h5>
        <h1 className="text-center md:text-7xl sm:text-5xl font-semibold">
          Centenario
        </h1>
      </div>
      <div className="lg:w-1/3 md:w-1/2 sm:w-full absolute bottom-[5vh]">
        <ul className="w-full flex flex-row flex-wrap md:justify-between sm:justify-center items-center text-center md:my-6 px-8 py-4 md:bg-background md:rounded-full sm:rounded-[10px]">
          <li className="md:w-1/3 sm:w-1/2 sm:mb-4">
            <h1 className="text-[--gold] text-sm font-semibold">POWER</h1>
            <p className="text-sm">770 CV / 566 kW</p>
          </li>
          <li className="md:w-1/3 sm:w-1/2 sm:mb-4">
            <h1 className="text-[--gold] text-sm font-semibold">MAX. SPEED</h1>
            <p className="text-sm">{`>350 km/h`}</p>
          </li>
          <li className="md:w-1/3 sm:w-1/2 sm:mb-4">
            <h1 className="text-[--gold] text-sm font-semibold">0-100 km/h</h1>
            <p className="text-sm">{`<2,9 s`}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const Overview = () => {
  return (
    <div
      id="Overview"
      className="section snap-start shrink-0 w-full h-[100dvh] flex lg:flex-row md:flex-row sm:flex-col items-center md:container z-[2] md:mx-auto sm:px-[5%]"
    >
      <div className="md:w-1/2 sm:w-full sm:h-[50vh]"></div>
      <div
        className="md:w-1/2 sm:w-full md:h-screen sm:h-[50vh] flex justify-center md:items-center text-pretty"
        data-aos="fade-left"
      >
        <div className="md:max-w-[80%] sm:max-h-[50vh] sm:w-full h-fit px-8 my-5 sm:p-0">
          <h1 className="text-[--gold] text-3xl font-semibold mb-6">
            OVERVIEW
          </h1>
          <ScrollArea className="sm:max-h-[30vh] h-fit overflow-y-scroll">
            <p className="text-black dark:text-white mb-5">
              The Lamborghini Centenario exemplifies the innovative design and
              engineering skills of the House of the Raging Bull. The finest
              possible tribute to our founder Ferruccio Lamborghini on the
              centenary of his birth, it is an homage to his vision and the
              future he believed in—a vision that we at Lamborghini still
              embrace.
            </p>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export const Design = () => {
  return (
    <div
      id="Design"
      className="section snap-start shrink-0 w-full h-[100dvh] flex lg:flex-row md:flex-row sm:flex-col-reverse justify-center items-center md:container z-[2] md:mx-auto sm:px-[5%]"
    >
      <div
        data-aos="fade-right"
        className="md:w-1/2 sm:w-full md:h-fit sm:h-[50vh] px-8 my-5 sm:p-0 text-pretty flex md:items-center justify-center"
      >
        <div className="md:max-w-[80%] sm:w-full sm:max-h-[40vh] sm:my-5 h-fit ">
          <h1 className="text-[--gold] text-3xl font-semibold mb-6">DESIGN</h1>
          <ScrollArea className="sm:max-h-[30vh] md:h-fit overflow-y-scroll">
            <p className="text-black dark:text-white mb-5">
              Here are the technical characteristics of the Lamborghini
              Centenario: equipped with a 770 CV aspirated V12 engine springing
              from 0 to 100 km/h in 2.8 seconds, the newly-born Lamborghini car
              has been produced in a limited edition, for a total of 40 models:
              20 Coupés and 20 Roadsters will be delivered to Lamborghini
              collectors and fans starting from 2017.
            </p>
            <p className="text-black dark:text-white mb-5">
              The Centenario has been conceived with the purpose of exploring
              new technological and design opportunities, to look at the future
              through the lens of innovation. One of the most exclusive (and
              sought-after) cars in the whole world.
            </p>
          </ScrollArea>
        </div>
      </div>
      <div className="md:w-1/2 sm:w-full  sm:h-[50vh]"></div>
    </div>
  );
};
export const Specifications = () => {
  return (
    <div
      id="Specifications"
      className="section snap-start shrink-0 w-full h-[100dvh] flex md:flex-row sm:flex-col items-center md:container z-[2] md:mx-auto sm:px-[5%]"
    >
      <div className="md:w-1/2 sm:w-full sm:h-[50vh] "></div>
      <div
        data-aos="fade-left"
        className="md:w-1/2 sm:w-full md:h-screen sm:h-[50vh] px-8 py-5 sm:p-0 flex justify-center md:items-center text-pretty"
      >
        <div className="md:max-w-[80%] sm:w-full sm:max-h-[40vh] sm:my-5 h-fit ">
          <h1 className="text-[--gold] text-3xl font-semibold mb-6">
            SPECIFICATIONS
          </h1>
          <ScrollArea className="w-full md:max-h-[40vh] sm:max-h-[30vh] overflow-y-scroll">
            <ul className="w-full text-sm text-pretty list-disc mb-5">
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  DISPLACEMENT
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  6.498 cm³ (396.5 cu in)
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  MAX. POWER
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  770 CV (566 kW) @ 8.500 rpm
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  MAX. SPEED
                </span>
                <span className="w-1/2 text-black dark:text-white">{`>350 km/h (217 mph)`}</span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  ACCELERATION 0-100 KM/H (0-62 MPH)
                </span>
                <span className="w-1/2 text-black dark:text-white">2,8 s</span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  NUMBER OF CYLINDERS
                </span>
                <span className="w-1/2 text-black dark:text-white">12</span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  TRANSMISSION
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  Electronically controlled all-wheel drive system (Haldex gen.
                  IV) with rear mechanical self-locking differential
                </span>
              </li>
            </ul>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
export const SteeringSuspension = () => {
  return (
    <div
      id="SteeringSuspension"
      className="section snap-start shrink-0 w-full h-[100dvh] flex md:flex-row sm:flex-col-reverse items-center md:container z-[2] md:mx-auto sm:px-[5%]"
    >
      <div
        data-aos="fade-right"
        className="md:w-1/2 sm:w-full md:h-screen sm:h-[50vh] px-8 py-5 sm:p-0 flex md:items-center text-pretty"
      >
        <div className="md:max-w-[80%] sm:w-full sm:max-h-[50vh] sm:my-5 h-fit ">
          <h1 className="text-[--gold] text-3xl font-semibold mb-6">
            STEERING AND SUSPENSION
          </h1>
          <ScrollArea className="w-full md:max-h-[50vh] sm:max-h-[30vh] overflow-y-scroll">
            <ul className="w-full text-sm text-pretty list-disc mb-5">
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-[35%] text-black dark:text-white font-semibold">
                  CONTROL SYSTEMS
                </span>
                <span className="w-[60%] text-black dark:text-white">
                  Electronic Stability Control (ABS e TCS integrated)
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-[35%] text-black dark:text-white font-semibold">
                  SUSPENSION TYPE
                </span>
                <span className="w-[60%] text-black dark:text-white">
                  Push rod magneto-rheologic active front and rear suspension
                  with horizontal dampers and springs
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-[35%] text-black dark:text-white font-semibold">
                  SUSPENSION GEOMETRY
                </span>
                <span className="w-[60%] text-black dark:text-white">
                  Double wishbone fully independent suspension
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-[35%] text-black dark:text-white font-semibold">
                  STEERING TYPE
                </span>
                <span className="w-[60%] text-black dark:text-white">
                  Hydraulic assisted power steering
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-[35%] text-black dark:text-white font-semibold">
                  STEERING SYSTEM
                </span>
                <span className="w-[60%] text-black dark:text-white">
                  LDS (Lamborghini Dynamic Steering) with variable steering
                  ratio; Lamborghini rear-wheel steering system
                </span>
              </li>
            </ul>
          </ScrollArea>
        </div>
      </div>
      <div className="md:w-1/2 sm:w-full sm:h-[50vh]"></div>
    </div>
  );
};
export const Engine = () => {
  return (
    <div
      id="Engine"
      className="section snap-start shrink-0 w-full h-[100dvh] flex md:flex-row sm:flex-col items-center md:container z-[2] md:mx-auto sm:px-[5%]"
    >
      <div className="md:w-1/2 sm:w-full sm:h-[50vh] "></div>
      <div
        data-aos="fade-left"
        className="md:w-1/2 sm:w-full md:h-screen sm:h-[50vh] px-8 py-5 sm:p-0 flex justify-center md:items-center text-pretty"
      >
        <div className="md:max-w-[80%] sm:w-full sm:max-h-[40vh] sm:my-5 h-fit ">
          <h1 className="text-[--gold] text-3xl font-semibold mb-6">ENGINE</h1>
          <ScrollArea className="w-full md:max-h-[50vh] sm:max-h-[30vh] overflow-y-scroll">
            <ul className="w-full text-sm text-pretty list-disc mb-5">
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  TYPE
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  V12, 60°, MPI (Multi Point Injection)
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  DISPLACEMENT
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  6.498 cm³ (396.5 cu in)
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  BORE X STROKE
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  95 mm x 76,4 mm (3.74 x 3.01 in)
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  COMPRESSION RATIO
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  11,8:1 ± 0,2
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  MAX. POWER
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  770 CV (566 kW) @ 8.500 rpm
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  MAX. TORQUE
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  690 Nm (507 lb.-ft.) @ 5.500 rpm
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  WEIGHT-TO-POWER RATIO
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  1,97 kg/CV (4.35 lb/CV)
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  LUBRICATION
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  Dry sump
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  EMISSION CONTROL
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  Euro 6 - LEV 2
                </span>
              </li>
            </ul>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
export const Wheels = () => {
  return (
    <div
      id="Wheels"
      className="section snap-end shrink-0 w-full h-[100dvh] flex md:flex-row sm:flex-col-reverse items-center md:container z-[2] md:mx-auto sm:px-[5%]"
    >
      <div
        data-aos="fade-right"
        className="md:w-1/2 sm:w-full md:h-screen sm:h-[50vh] px-8 py-5 sm:p-0 flex justify-center md:items-center text-pretty"
      >
        <div className="md:max-w-[80%] sm:w-full sm:max-h-[40vh] sm:my-5 h-fit ">
          <h1 className="text-[--gold] text-3xl font-semibold mb-6">WHEELS</h1>
          <ScrollArea className="w-full md:max-h-[50vh] sm:max-h-[30vh] overflow-y-scroll">
            <ul className="w-full text-sm text-pretty list-disc mb-5">
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  RIMS - FRONT
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  {`20'' specific forged rims; 9J x 20 ET17.2`}
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  RIMS - REAR
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  {`21'' specific forged rims; 13J x 21 ET51.7`}
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  TIRES - FRONT
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  255/30 ZR20
                </span>
              </li>
              <li className="w-full flex flex-row justify-between mb-4">
                <span className="w-1/2 text-black dark:text-white font-semibold">
                  TIRES - REAR
                </span>
                <span className="w-1/2 text-black dark:text-white">
                  355/25 ZR21
                </span>
              </li>
            </ul>
          </ScrollArea>
        </div>
      </div>
      <div className="md:w-1/2 sm:w-full "></div>
    </div>
  );
};

type Footer = {
  lastComponent: string;
};
export const Footer = ({ lastComponent }: Footer) => {
  const d = new Date();
  const year = d.getFullYear();

  // Copyright Data
  const copyright = [
    {
      description:
        "1. Lamborghini Logo by worldvectorlogo.com is licensed under https://worldvectorlogo.com/terms-of-use.",
    },
    {
      description:
        "2. Lamborghini Centenario LP-770 Interior SDC - (https://skfb.ly/6Z9tX) by SDC PERFORMANCE™️ is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
    },
  ];

  // Policy Data
  const policy = [
    {
      description: "-- Data not available --",
    },
  ];

  // Show Footer at the end
  useEffect(() => {
    const container = document.getElementById("container");
    const section = document.querySelectorAll(".section");

    container?.addEventListener("scroll", () => {
      section.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          switch (el.id === lastComponent) {
            case true:
              $("#Footer").removeClass("hidden");
              break;
            case false:
              $("#Footer").addClass("hidden");
              break;

            default:
              break;
          }
        }
      });
    });
  }, []);

  return (
    <footer
      id="Footer"
      className="container mx-auto lg:px-[3%] md:px-[5%] w-full p-4 border-t border-gray-200 sticky bottom-0 left-0 right-0 hidden"
    >
      <div className="flex md:flex-row sm:flex-col md:justify-between  md:items-center">
        <p className="text-black dark:text-white sm:text-center sm:mb-2">
          &copy; {year} Lamborghini
        </p>
        <div className="flex flex-row flex-wrap sm:justify-between items-center text-gray-600 sm:text-[14px]">
          <Dialog
            title="Copyright"
            dataList={copyright}
            space={true}
            textBTNcolor="text-black dark:text-white"
          />
          <span className="mx-6 md:block sm:hidden">|</span>
          <Dialog
            title="Privacy Policy"
            dataList={policy}
            textBTNcolor="text-black dark:text-white"
          />
          <span className="mx-6 md:block sm:hidden">|</span>
          <div className="w-fit flex flex-row items-center">
            <a
              href="#"
              className="lg:text-white md:text-black m dark:text-white"
            >
              <i className="facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.29h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.098 2.796.143v3.24h-1.92c-1.507 0-1.8.717-1.8 1.767v2.314h3.59l-.467 3.417h-3.122V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </i>
            </a>

            <a
              href="#"
              className="lg:text-white md:text-black dark:text-white ml-4"
            >
              <i className="youtube ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[24px] h-[24px]"
                >
                  <path d="M23.498 6.186a2.958 2.958 0 0 0-2.081-2.087C19.734 3.5 12 3.5 12 3.5s-7.736 0-9.417.599a2.958 2.958 0 0 0-2.081 2.087C0 7.889 0 12 0 12s0 4.111.502 5.814a2.958 2.958 0 0 0 2.081 2.087C4.264 20.5 12 20.5 12 20.5s7.736 0 9.417-.599a2.958 2.958 0 0 0 2.081-2.087C24 16.111 24 12 24 12s0-4.111-.502-5.814zM9.75 15.568V8.432L15.568 12 9.75 15.568z" />
                </svg>
              </i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

type PositionObject = {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}[];

export const Container3D = () => {
  const carRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationsMapRef = useRef<Map<string, THREE.AnimationAction> | null>(
    new Map()
  );

  // Positions Object
  const positionObject: PositionObject = [
    {
      id: "Power",
      position: { x: 0.2, y: -0.7, z: 8 },
      rotation: { x: 0, y: -0.5, z: 0 },
    },
    {
      id: "Overview",
      position: { x: 0, y: -0.5, z: 11 },
      rotation: { x: 0.1, y: 0, z: 0 },
    },
    {
      id: "Design",
      position: { x: 1.8, y: -0.5, z: 5 },
      rotation: { x: 0.4, y: 0.5, z: 0 },
    },
    {
      id: "Specifications",
      position: { x: -2, y: -0.5, z: 5 },
      rotation: { x: 0.4, y: -0.5, z: 0 },
    },
    {
      id: "SteeringSuspension",
      position: { x: 0.8, y: -0.7, z: 13 },
      rotation: { x: 0, y: -2.4, z: 0 },
    },
    {
      id: "Engine",
      position: { x: -1.8, y: -0.4, z: 10.5 },
      rotation: { x: 0.4, y: 4, z: 0 },
    },
    {
      id: "Wheels",
      position: { x: 1.35, y: -0.5, z: 12 },
      rotation: { x: 0, y: -3, z: 0 },
    },
  ];
  const positionObject_MD_Portrait: PositionObject = [
    {
      id: "Power",
      position: { x: 0.2, y: -0.7, z: 8 },
      rotation: { x: 0, y: -0.5, z: 0 },
    },
    {
      id: "Overview",
      position: { x: 0, y: -0.5, z: 11 },
      rotation: { x: 0.1, y: 0, z: 0 },
    },
    {
      id: "Design",
      position: { x: 1.8, y: -0.5, z: 5 },
      rotation: { x: 0.4, y: 0.5, z: 0 },
    },
    {
      id: "Specifications",
      position: { x: -2, y: -0.5, z: 5 },
      rotation: { x: 0.4, y: -0.5, z: 0 },
    },
    {
      id: "SteeringSuspension",
      position: { x: 0.8, y: -0.7, z: 13 },
      rotation: { x: 0, y: -2.4, z: 0 },
    },
    {
      id: "Engine",
      position: { x: -1.8, y: -0.4, z: 10.5 },
      rotation: { x: 0.4, y: 4, z: 0 },
    },
    {
      id: "Wheels",
      position: { x: 1.35, y: -0.5, z: 12 },
      rotation: { x: 0, y: -3, z: 0 },
    },
  ];
  const positionObject_MD: PositionObject = [
    {
      id: "Power",
      position: { x: 0.2, y: -0.7, z: 8 },
      rotation: { x: 0, y: -0.5, z: 0 },
    },
    {
      id: "Overview",
      position: { x: 0, y: -0.5, z: 11 },
      rotation: { x: 0.1, y: 0, z: 0 },
    },
    {
      id: "Design",
      position: { x: 1.8, y: -0.5, z: 5 },
      rotation: { x: 0.4, y: 0.5, z: 0 },
    },
    {
      id: "Specifications",
      position: { x: -2, y: -0.5, z: 5 },
      rotation: { x: 0.4, y: -0.5, z: 0 },
    },
    {
      id: "SteeringSuspension",
      position: { x: 0.8, y: -0.7, z: 13 },
      rotation: { x: 0, y: -2.4, z: 0 },
    },
    {
      id: "Engine",
      position: { x: -1.8, y: -0.4, z: 10.5 },
      rotation: { x: 0.4, y: 4, z: 0 },
    },
    {
      id: "Wheels",
      position: { x: 1.35, y: -0.5, z: 12 },
      rotation: { x: 0, y: -3, z: 0 },
    },
  ];
  const positionObject_SM: PositionObject = [
    {
      id: "Power",
      position: { x: 0, y: 0.1, z: 4.5 },
      rotation: { x: 1, y: 3.14, z: 0 },
    },
    {
      id: "Overview",
      position: { x: 0, y: 1, z: 8 },
      rotation: { x: 0.5, y: 0, z: 0 },
    },
    {
      id: "Design",
      position: { x: -0.5, y: 0.55, z: 8 },
      rotation: { x: 0.4, y: 1, z: 0 },
    },
    {
      id: "Specifications",
      position: { x: 0, y: 1, z: 7 },
      rotation: { x: 0.4, y: -1, z: 0 },
    },
    {
      id: "SteeringSuspension",
      position: { x: 0.5, y: -0.5, z: 13 },
      rotation: { x: 0.1, y: -2.4, z: 0 },
    },
    {
      id: "Engine",
      position: { x: -1.1, y: 0.1, z: 11 },
      rotation: { x: 0.4, y: 4, z: 0 },
    },
    {
      id: "Wheels",
      position: { x: -0.5, y: 0.5, z: 11 },
      rotation: { x: 0.4, y: 4, z: 0 },
    },
  ];

  const loadModel = async () => {
    const scene = new THREE.Scene();
    const loader = new GLTFLoader();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    let camera: THREE.PerspectiveCamera | undefined;
    let rotationAnimation: GSAPTween | null = null;

    // Existing lights
    const light = new THREE.AmbientLight(0xffffff, 3); // Lower ambient light intensity for more contrast
    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(500, 500, 500);

    // Spot Light
    const spotLight = new THREE.SpotLight(0xffffff, 10);
    spotLight.position.set(100, 1000, 100);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    // Additional lighting for realism
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8); // Main light source, acts like sunlight
    keyLight.position.set(3, 10, 7.5);
    keyLight.castShadow = true;

    const fillLight = new THREE.PointLight(0xffffff, 1); // Softer, diffused light to fill shadows
    fillLight.position.set(-5, 5, 5);

    const backLight = new THREE.DirectionalLight(0xffffff, 10); // Light from behind for edge highlights
    backLight.position.set(-0.5, 10, -5);

    // Screen
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const desktop_portrait = window.matchMedia(
      "(min-width: 1024px) and (orientation:portrait)"
    ).matches;
    const tablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1024px)"
    ).matches;
    const mobile = window.matchMedia(
      "(min-width: 320px) and (max-width: 768px)"
    ).matches;

    const setCamera = async () => {
      // Set Camera
      if (mobile) {
        camera = new THREE.PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 15;
        cameraRef.current = camera;
        return;
      }
      if (tablet) {
        camera = new THREE.PerspectiveCamera(
          39,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 15;
        cameraRef.current = camera;
        return;
      }
      if (desktop_portrait) {
        camera = new THREE.PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 15;
        cameraRef.current = camera;
        return;
      }
      if (desktop) {
        camera = new THREE.PerspectiveCamera(
          25,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 15;
        cameraRef.current = camera;
      }
    };

    setCamera();

    if (camera === undefined) return;
    renderer.domElement.style.zIndex = "-1";
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    const element = document.getElementById("container3D");

    if (element) {
      const childToBeRemoved = element.querySelector("canvas");
      if (childToBeRemoved) element.removeChild(childToBeRemoved);
      element.appendChild(renderer.domElement);
    }

    rendererRef.current = renderer;
    scene.add(light, topLight, spotLight, keyLight, fillLight, backLight);
    topLight.position.set(500, 500, 500);

    loader.load(
      `${baseurl}asset/lamborghini_centenario_lp-770_interior_sdc.glb`,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            (node as THREE.Mesh).castShadow = true;
          }
        });
        carRef.current = model;

        scene.add(carRef.current);

        mixerRef.current = new THREE.AnimationMixer(carRef.current);
        animationsMapRef.current = new Map();

        // Store animations by name for later access
        gltf.animations.forEach((clip) => {
          const action = mixerRef.current!.clipAction(clip);
          animationsMapRef.current?.set(clip.name, action);
        });

        modelMove();
      }
    );

    const animate = () => {
      if (cameraRef.current) {
        requestAnimationFrame(animate);
        renderer.render(scene, cameraRef.current);
        mixerRef.current?.update(0.02);
      }
    };

    animate();

    const modelMove = () => {
      const section = document.querySelectorAll(".section");
      let currentSection: string | undefined = undefined;

      section.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          currentSection = el.id;
        }
      });

      const position3DModel = () => {
        if (mobile) {
          return positionObject_SM[positionActive];
        }
        if (tablet) {
          return positionObject_MD[positionActive];
        }
        if (desktop_portrait) {
          return positionObject_MD_Portrait[positionActive];
        }
        if (desktop) {
          return positionObject[positionActive];
        }
      };

      const positionActive = positionObject.findIndex(
        (elm) => elm.id === currentSection
      );

      if (positionActive >= 0 && carRef.current !== null) {
        const newCordinate = position3DModel();

        console.log(newCordinate);

        gsap.to(carRef.current.position, {
          y: newCordinate?.position.y,
          x: newCordinate?.position.x,
          z: newCordinate?.position.z,
          duration: 1,
          ease: "power1.out",
        });

        gsap.to(carRef.current.rotation, {
          y: newCordinate?.rotation.y,
          x: newCordinate?.rotation.x,
          z: newCordinate?.rotation.z,
          duration: 1,
          ease: "power1.out",
        });

        /** Manual Control Animation By Section ID */
        if (!currentSection) return;

        // Infinite rotation ID Specifications
        if (currentSection === "Specifications") {
          if (!rotationAnimation || !rotationAnimation.isActive()) {
            rotationAnimation = gsap.to(carRef.current.rotation, {
              y: "+=360", // Incremental rotation
              duration: 1000,
              ease: "linear",
              repeat: -1, // Infinite repeat
            });
          } else {
            rotationAnimation.resume();
          }
        } else {
          if (rotationAnimation) rotationAnimation.pause();
        }

        // Example: play a specific animation clip based on section ID
        if (
          currentSection === "Design" ||
          currentSection === "SteeringSuspension"
        ) {
          const action = animationsMapRef.current?.get("Animation");
          if (action) {
            action.reset();
            action.setLoop(THREE.LoopOnce, 0); // Play once, no looping
            action.clampWhenFinished = true; // Stop at the last frame
            action.play();
          }
        } else {
          const action = animationsMapRef.current?.get("Animation");
          if (action) action.reset().stop();
        }
      }
    };

    // Throttled scroll handler
    const container = document.getElementById("container");
    if (!container) {
      console.log("Not Snap");
    }
    const handleScroll = () => {
      requestAnimationFrame(() => {
        modelMove();
      });
    };

    container?.addEventListener("scroll", handleScroll);

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);

      resizeTimeout.current = setTimeout(() => {
        if (cameraRef.current && rendererRef.current) {
          console.log("Resize");
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        }
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  };

  useEffect(() => {
    setTimeout(() => {
      loadModel();
    }, 1000);
  }, [
    positionObject,
    positionObject_MD_Portrait,
    positionObject_MD,
    positionObject_SM,
  ]);

  return (
    <div
      id="container3D"
      className="fixed inset-0 z-[-1] pointer-events-none"
    ></div>
  );
};

type DialogProps = {
  title?: string | JSX.Element;
  icon?: JSX.Element;
  dataList: {
    name?: string;
    description: string;
    total?: number;
    payment?: string;
  }[];
  textBTNcolor?: string;
  space?: boolean;
};

export const Dialog = ({
  dataList,
  title,
  icon,
  textBTNcolor,
  space,
}: DialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span
          className={
            textBTNcolor
              ? `${textBTNcolor} cursor-pointer`
              : "text-gray-600 cursor-pointer"
          }
        >
          {" "}
          {icon ? icon : title}
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex-wrap overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row items-center">
            {title ? (
              <Fragment>
                <span className="mr-[5px]">{icon}</span>
                <span>{title}</span>
              </Fragment>
            ) : (
              "Dialog"
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col text-wrap ">
            <Suspense>
              {dataList.map((list, index) => (
                <span
                  key={index + list.description}
                  className={[
                    "max-max-w-[80%] h-fit text-pretty ",
                    !space ? "" : "mb-3",
                  ].join(" ")}
                >
                  {list.description}
                </span>
              ))}
            </Suspense>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Create an Intersection Observer to trigger AOS manually
export const aosObserver = () => {
  const section = document.querySelectorAll(".section");
  let currentSection: string | undefined = undefined;
  section.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2) {
      currentSection = el.id;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger AOS refresh when section is visible
          AOS.refresh();
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the section is in view
    }
  );

  if (currentSection) {
    const element: NodeListOf<Element> = document.querySelectorAll(
      `#${currentSection}`
    );
    if (!element) return;
    observer.observe(element[0]);
  }
};
