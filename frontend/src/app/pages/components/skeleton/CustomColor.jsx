import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

const CustomSkeleton = (props) => {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();

  return (
    <Skeleton
      style={{
        "--sk-color": isDark ? darkColorScheme[700] : lightColorScheme[300],
      }}
      {...props}
    />
  );
};

const CustomColor = () => {
  return (
    <div className="max-w-md">
      <div className="flex flex-col border border-gray-150 dark:border-dark-600">
        <div className="flex space-x-5 px-5 py-4 ">
          <CustomSkeleton className="size-16 rounded-full" />
          <div className="flex flex-1 flex-col justify-between py-2">
            <CustomSkeleton className="h-3 w-full rounded-sm" />
            <CustomSkeleton className="h-3 w-full rounded-sm" />
          </div>
        </div>
        <CustomSkeleton className="h-48 w-full" />
        <div className="w-full px-6 py-4">
          <CustomSkeleton className="h-3 w-full rounded-sm" />
          <CustomSkeleton className="mt-4 h-3 w-8/12 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export { CustomColor };
