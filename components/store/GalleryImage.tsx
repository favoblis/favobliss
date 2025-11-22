import Image from "next/image";

const images = [
  {
    href: "/",
    src: "/assets/gallery/gallery-3.jpg",
    srcSet:
      "/assets/gallery/1.jpeg 1x, /assets/gallery/1.jpeg 2x",
    alt: "Mixer Grinder",
    width: 300,
    height: 400,
  },
  {
    href: "/",
    src: "/assets/gallery/2.jpeg",
    srcSet:
      "/assets/gallery/2.jpeg 1x, /assets/gallery/2.jpeg 2x",
    alt: "BoAt Speaker",
    width: 600,
    height: 600,
  },
  {
    href: "/",
    src: "/assets/gallery/3.jpeg",
    srcSet:
      "/assets/gallery/3.jpeg 1x, /assets/gallery/3.jpeg 2x",
    alt: "Fashionable Watches",
    width: 300,
    height: 400,
  },
  {
    href: "/",
    src: "/assets/gallery/4.jpeg",
    srcSet:
      "/assets/gallery/5.jpeg 1x, /assets/gallery/5.jpeg 2x",
    alt: "Mixer Grinder",
    width: 300,
    height: 400,
  },
];

const Gallery = () => {
  return (
    <div className="w-full max-w-full mx-auto p-4 py-0">
      <div className="sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {images.map((img, index) => (
          <a
            key={index}
            href={img.href}
            className="block overflow-hidden rounded-lg shadow-md bg-white transition-transform duration-300 flex-shrink-0 w-[36%] sm:w-auto snap-start mr-3 sm:mr-0"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 36vw, (max-width: 1024px) 50vw, 25vw"
                className="object-fill"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
