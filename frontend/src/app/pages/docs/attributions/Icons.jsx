const icons = [
  {
    label: "Heroicons",
    url: "https://heroicons.com/",
  },
  {
    label: "React Icons",
    url: "https://react-icons.github.io/react-icons/",
  },
];

export function Icons() {
  return (
    <section>
      <h3
        id="icons"
        className="mt-10 scroll-mt-20 text-lg font-semibold lg:text-2xl"
        data-heading="Icon"
        data-order="2"
      >
        <a href="#icons">Icon</a>
      </h3>

      <ul className="mt-4 space-y-1.5 text-base">
        {icons.map((icon) => (
          <li key={icon.label}>
            <a
              className="text-primary-600 hover:underline dark:text-primary-400"
              href={icon.url}
            >
              {icon.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
