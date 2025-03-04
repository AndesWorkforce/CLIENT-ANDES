import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo-andes.png";
import bgImage from "../../../../public/fondo-landing.png";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat w-full h-full relative">
      {/* Imagen de fondo con blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage.src}
          alt="Fondo"
          fill
          sizes="100vw"
          className="object-fill blur-lg brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Contenedor principal - sin justify-center en móvil */}
      <div className="flex-1 flex flex-col w-full z-10 justify-center items-center md:px-8">
        {/* Nuevo contenedor para el botón y la card */}
        <div className="relative w-full max-w-6xl mx-auto">
          {/* Botón de volver con posición absolute */}
          <div className="hidden lg:block absolute top-0 left-10 -translate-x-16 -translate-y-8">
            <Link href="/" className="inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* Trazo negro (detrás) */}
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Trazo azul (encima) */}
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#0097B2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Contenedor responsive */}
          <div className="w-full max-w-md mx-auto md:w-auto md:my-6 lg:flex lg:items-stretch lg:h-[80%] lg:max-w-6xl lg:w-full lg:mx-auto lg:shadow-xl lg:rounded-3xl lg:overflow-hidden relative">
            {/* Panel izquierdo (formulario) */}
            <div className="flex flex-col justify-between bg-[#FCFEFF] shadow-lg w-full min-h-[500px] p-[36px] rounded-lg my-4 lg:my-0 lg:shadow-none lg:w-[60%] lg:rounded-none">
              {/* Estructura del header - versión móvil */}
              <div className="mb-6 lg:hidden">
                <div className="flex items-center">
                  <Link href="/" className="text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0097B2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </Link>
                  <div className="flex-1 text-center">
                    <Image
                      src={logo}
                      alt="Andes Workforce"
                      width={120}
                      height={40}
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Estructura del header - versión desktop */}
              <div className="hidden lg:flex lg:flex-col lg:mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-[600] text-[18px] text-black">
                    Crear una cuenta nueva
                  </h2>
                  <Image
                    src={logo}
                    alt="Andes Workforce"
                    width={120}
                    height={40}
                  />
                </div>
              </div>

              {/* Formulario */}
              <RegisterForm />
            </div>

            {/* Panel derecho (imagen) - solo visible en lg y superiores */}
            <div className="hidden lg:block lg:w-[100%] lg:relative bg-[#0097B2] overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src={bgImage.src}
                  alt="Ilustración de login"
                  fill
                  sizes="100vw"
                  className="object-fill brightness-75"
                  priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
