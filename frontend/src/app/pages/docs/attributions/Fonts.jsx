const fonts = [
  {
    label: "Inter",
    url: "https://fonts.google.com/specimen/Inter",
  },
];

export function Fonts() {
  return (
    <section>
      <h3
        id="fonts"
        className="mt-10 scroll-mt-20 text-lg font-semibold lg:text-2xl"
        data-heading="Fonts"
        data-order="2"
      >
        <a href="#fonts">Fonts</a>
      </h3>

      <ul className="mt-4 space-y-1.5 text-base">
        {fonts.map((font) => (
          <li key={font.label}>
            <a
              className="text-primary-600 hover:underline dark:text-primary-400"
              href={font.url}
            >
              {font.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
