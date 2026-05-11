// Import Dependencies
import { Link } from "react-router";

// Local Imports
import ReviewIllustration from "assets/illustrations/review.svg?react";
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export function UnderReview() {
  const theme = useThemeContext();
  return (
    <div className="h-full text-center">
      <ReviewIllustration
        className="mx-auto h-auto w-56 sm:w-64"
        style={{
          "--primary": theme.primaryColorScheme[600],
          "--darker": theme.darkColorScheme[600],
        }}
      />
      <p className="mt-6 pt-4 text-xl font-semibold text-gray-800 dark:text-dark-50">
        We have received your form submission
      </p>
      <p className="mx-auto mt-2 max-w-(--breakpoint-lg) text-balance sm:px-5">
        Thank you for submitting the form. We have received your personal data
        and we will verify it as soon as possible. If you have any questions or
        concerns, please contact us at support@universalkyc.com.
      </p>
      <Button
        color="primary"
        className="mt-8 w-full px-10 sm:w-auto"
        to="/"
        component={Link}
      >
        Go To Home
      </Button>
    </div>
  );
}
