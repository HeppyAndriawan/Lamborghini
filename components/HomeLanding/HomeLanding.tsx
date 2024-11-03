"use client";
import React, { useState, useEffect, Suspense, useRef, Fragment } from "react";
import useThemeMode from "@/tool/useThemeMode/useThemeMode";
import useScrollSnap from "@/tool/useScrollSnap/useScrollSnap";
import { baseurl } from "@/tool/BaseURL/BaseURL";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";

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

export default function HomeLanding() {
  const containerRef: React.RefObject<HTMLElement> = React.createRef();
  const [bind, unbind] = useScrollSnap(
    containerRef,
    { snapDestinationY: "90%" },
    () => console.log("snapped")
  );

  return (
    <div className="w-full flex flex-col bg-background">
      <div className="container mx-auto">
        <Navigation />
        <main className="flex-grow" ref={containerRef}>
          <Power/>
          <Overview/>
          <Design/>
          <Specifications/>
          <Container3D />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export const Navigation = () => {
  const { theme, setTheme } = useThemeMode();

  // Detect Mobile
  const [isMobile, setisMobile] = useState<boolean>(false);
  useEffect(() => {
    const mobile = window.matchMedia(
      "(min-width: 320px) and (max-width: 768px)"
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
  type OrderData = {
    name: string;
    description: string;
    total: number;
    payment: string;
  }[];

  const [orderData, setorderData] = useState<OrderData>([]);

  // Data Mobile Navigation
  const mobileNavigation = [
    {
      title: "Power",
      href: "/",
    },
    {
      title: "Overview",
      href: "#Overview",
    },
    {
      title: "Design",
      href: "#Design",
    },
    {
      title: "Specifications",
      href: "#Specifications",
    },
  ];

  if (isMobile) {
    return (
      <header className="w-full flex justify-between items-center pt-3 pb-12">
        <div className="flex items-center">
          <h1 className="text-xl text-[--gold] font-bold">Centenario</h1>
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
              className="w-full bg-black dark:bg-[--gold] text-white px-[1rem] py-[.5rem] text-sm font-bold flex flex-row items-center"
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
          }
        />
      </header>
    );
  }
  return (
    <header className="w-full md:flex sm:hidden justify-between items-center lg:px-0 md:p-4 ">
      <div className="flex items-center">
        <h1 className="text-xl text-[--gold] font-bold">Centenario</h1>
      </div>
      <nav className="flex space-x-4 items-center">
        <a
          href="#Section03"
          className="text-gray-600 hover:text-[--gold] dark:text-white dark:hover:text-[--gold] text-sm font-bold px-[1rem]"
        >
          Power
        </a>
        <a
          href="#Section04"
          className="text-gray-600 hover:text-[--gold] dark:text-white dark:hover:text-[--gold] text-sm font-bold px-[1rem]"
        >
          Overview
        </a>
        <a
          href="#Section04"
          className="text-gray-600 hover:text-[--gold] dark:text-white dark:hover:text-[--gold] text-sm font-bold px-[1rem]"
        >
          Design
        </a>
        <a
          href="#Section04"
          className="text-gray-600 hover:text-[--gold] dark:text-white dark:hover:text-[--gold] text-sm font-bold px-[1rem]"
        >
          Specifications
        </a>
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
              className="lucide lucide-baggage-claim w-[20px] h-[20px]"
            >
              <path d="M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2" />
              <path d="M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10" />
              <rect width="13" height="8" x="8" y="6" rx="1" />
              <circle cx="18" cy="20" r="2" />
              <circle cx="9" cy="20" r="2" />
            </svg>
          }
          dataList={orderData}
          textBTNcolor="white"
          space={false}
        />
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-black dark:bg-[--gold] text-white rounded-full px-[1rem] py-[.5rem] text-sm font-bold flex flex-row items-center"
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

export const Power = ()=>{
  return(
    <div className="section w-full h-screen">Power</div>
  )
}
export const Overview = ()=>{
  return(
    <div className="section w-full h-screen">Overview</div>
  )
}
export const Design = ()=>{
  return(
    <div className="section w-full h-screen">Design</div>
  )
}
export const Specifications = ()=>{
  return(
    <div className="section w-full h-screen">Specifications</div>
  )
}

export const Container3D = () => {
  const birdRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const loadModel = async () => {
    const scene = new THREE.Scene();
    const loader = new GLTFLoader();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    const topLight = new THREE.DirectionalLight(0xffffff, 1.3);
    let camera: THREE.PerspectiveCamera;

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

    // Positions Object
    const positionObject = [
      {
        id: "Section01",
        position: { x: 2.5, y: 0.2, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section02",
        position: { x: -3, y: 0, z: 0 },
        rotation: { x: 1, y: -0.5, z: 0 },
      },
      {
        id: "Section03",
        position: { x: 2.7, y: 0, z: 0 },
        rotation: { x: 0, y: 1, z: 0 },
      },
      {
        id: "Section04",
        position: { x: 1, y: -1, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section05",
        position: { x: 2.5, y: 0.5, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
    ];
    const positionObject_MD_Portrait = [
      {
        id: "Section01",
        position: { x: 1.5, y: 3, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section02",
        position: { x: -2, y: 0.5, z: 0 },
        rotation: { x: 1, y: -0.5, z: 0 },
      },
      {
        id: "Section03",
        position: { x: 1.7, y: 1, z: 0 },
        rotation: { x: 0, y: 1, z: 0 },
      },
      {
        id: "Section04",
        position: { x: 1, y: -0.5, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section05",
        position: { x: 1.5, y: 1, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
    ];
    const positionObject_MD = [
      {
        id: "Section01",
        position: { x: 1.5, y: 3, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section02",
        position: { x: -2, y: 0.5, z: 0 },
        rotation: { x: 1, y: -0.5, z: 0 },
      },
      {
        id: "Section03",
        position: { x: 1.7, y: 1, z: 0 },
        rotation: { x: 0, y: 1, z: 0 },
      },
      {
        id: "Section04",
        position: { x: 1, y: -0.5, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section05",
        position: { x: 1.5, y: 1, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
    ];
    const positionObject_SM = [
      {
        id: "Section01",
        position: { x: 0, y: -2, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section02",
        position: { x: 0, y: -4, z: 0 },
        rotation: { x: -1, y: 3, z: 1 },
      },
      {
        id: "Section03",
        position: { x: 0, y: -3, z: 0 },
        rotation: { x: 0, y: 1.5, z: 0 },
      },
      {
        id: "Section04",
        position: { x: 1.5, y: -1, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
      {
        id: "Section05",
        position: { x: 1.5, y: 0.5, z: 0 },
        rotation: { x: 0, y: -1, z: 0 },
      },
    ];

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
    renderer.setSize(window.innerWidth, window.innerHeight);
    const element = document.getElementById("container3D");
    if (element) element.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    scene.add(ambientLight, topLight);
    topLight.position.set(500, 500, 500);

    loader.load(
      `${baseurl}asset/lamborghini_centenario_lp-770_interior_sdc.glb`,
      (gltf) => {
        birdRef.current = gltf.scene;
        scene.add(birdRef.current);

        mixerRef.current = new THREE.AnimationMixer(birdRef.current);
        mixerRef.current.clipAction(gltf.animations[0]).play();
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

      if (positionActive >= 0 && birdRef.current !== null) {
        const newCordinate = position3DModel();

        gsap.to(birdRef.current.position, {
          y: newCordinate?.position.y,
          x: newCordinate?.position.x,
          z: newCordinate?.position.z,
          duration: 1,
          ease: "power1.out",
        });

        gsap.to(birdRef.current.rotation, {
          y: newCordinate?.rotation.y,
          x: newCordinate?.rotation.x,
          z: newCordinate?.rotation.z,
          duration: 1,
          ease: "power1.out",
        });
      }
    };

    // Throttled scroll handler
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
          modelMove();
          isScrolling = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        if (cameraRef.current && rendererRef.current) {
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
    loadModel();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      id="container3D"
      className="fixed inset-0 z-50 pointer-events-none"
    ></div>
  );
};

export const Footer = () => {
  const d = new Date();
  const year = d.getFullYear();

  // Copyright Data
  const copyright = [
    {
      description:
        "1. LowPoly humming-bird animated (https://skfb.ly/o9YBx) by alexi.smnd is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).",
    },
  ];

  // Policy Data
  const policy = [
    {
      description: "-- Data not available --",
    },
  ];

  return (
    <footer className="w-full p-4 border-t border-gray-200">
      <div className="flex md:flex-row sm:flex-col md:justify-between  md:items-center">
        <p className="text-gray-600 sm:text-center sm:mb-2">
          &copy; {year} Future Project
        </p>
        <div className="flex flex-row flex-wrap sm:justify-between items-center text-gray-600 sm:text-[14px]">
          <Dialog title="Copyright" dataList={copyright} space={true} />
          <span className="mx-6 md:block sm:hidden">|</span>
          <Dialog title="Privacy Policy" dataList={policy} />
          <span className="mx-6 md:block sm:hidden">|</span>
          <div className="w-fit flex flex-row items-center">
            <a href="#" className="text-gray-600">
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

            <a href="#" className="text-gray-600 ml-4">
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
                    "max-w-[90%] text-pretty ",
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
