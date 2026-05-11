```jsx
import { FilePond } from "components/shared/form/Filepond";

const Circle = () => {
  return (
    <div className="flex max-w-xl items-end gap-4">
      <FilePond
        className="label-icon w-28"
        stylePanelAspectRatio="1:1"
        stylePanelLayout="compact circle"
        labelIdle={`<svg xmlns='http://www.w3.org/2000/svg' class='size-8 text-gray-300 dark:text-dark-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'/>
  </svg>`}
      />
      <FilePond
        className="label-icon w-24"
        stylePanelAspectRatio="1:1"
        stylePanelLayout="compact circle"
        labelIdle={`<svg xmlns='http://www.w3.org/2000/svg' class='size-8 text-gray-300 dark:text-dark-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'/>
  </svg>`}
      />
      <FilePond
        className="label-icon w-20"
        filled
        bordered={false}
        stylePanelAspectRatio="1:1"
        stylePanelLayout="compact circle"
        labelIdle={`<svg xmlns='http://www.w3.org/2000/svg' class='size-8 text-gray-300 dark:text-dark-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'/>
  </svg>`}
      />
    </div>
  );
};

export { Circle };
```