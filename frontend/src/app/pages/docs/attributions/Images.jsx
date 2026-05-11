const images = [
  {
    label: "Unsplash",
    url: "https://unsplash.com/",
  },
  {
    label: "Freepik",
    url: "https://www.freepik.com/",
  },
  {
    label: "Storyset",
    url: "https://storyset.com/",
  },
];

export function Images() {
  return (
    <section>
      <h3
        id="images"
        className="mt-10 scroll-mt-20 text-lg font-semibold lg:text-2xl"
        data-heading="Images"
        data-order="2"
      >
        <a href="#images">Images</a>
      </h3>

      <ul className="space-y-1.5 text-base mt-4">
        {images.map((image) => (
          <li key={image.label}>
            <a
              className="text-primary-600 hover:underline dark:text-primary-400"
              href={image.url}
            >
              {image.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
