```jsx
const Extended = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <div
        role="alert"
        className="this:success overflow-hidden rounded-lg bg-white"
      >
        <div className="flex bg-this-darker/10">
          <div className="w-1.5 shrink-0 bg-this"></div>
          <div className="px-4 py-3">
            <h2 className="text-lg font-semibold uppercase text-this-darker">
              Success
            </h2>
            <p className="mt-2 text-this-darker">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam
              illum quidem, quae aut hic et sint consequuntur. Molestias,
              facere. Perspiciatis quibusdam consequuntur non optio, recusandae
              totam repellendus et aliquam sit ut distinctio eligendi impedit
              maxime facilis autem reprehenderit nulla dolore?
            </p>
          </div>
        </div>
      </div>
      <div
        role="alert"
        className="this:warning overflow-hidden rounded-lg bg-white"
      >
        <div className="flex bg-this-darker/10">
          <div className="w-1.5 shrink-0 bg-this"></div>
          <div className="px-4 py-3">
            <h2 className="text-lg font-semibold uppercase text-this-darker">
              Warning
            </h2>
            <p className="mt-2 text-this-darker">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam
              illum quidem, quae aut hic et sint consequuntur. Molestias,
              facere. Perspiciatis quibusdam consequuntur non optio, recusandae
              totam repellendus et aliquam sit ut distinctio eligendi impedit
              maxime facilis autem reprehenderit nulla dolore?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Extended };
```