// Import Dependencies
import PropTypes from "prop-types";
import { Label, Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";

// Local Imports
import { Button } from "components/ui";
import { colors } from "../../data";

// ----------------------------------------------------------------------

export function ColorField({ fieldProps }) {
  return (
    <RadioGroup {...fieldProps}>
      <Label>Task Color:</Label>
      <div className="mt-2 flex gap-2 lg:mt-3.5">
        {colors.map((color) => (
          <Radio
            as={Button}
            isIcon
            key={color}
            value={color}
            color={color}
            className={({ checked }) =>
              clsx(
                "size-5 rounded-full ring-this ring-offset-2 ring-offset-white dark:ring-offset-dark-700",
                checked && "ring-2",
              )
            }
          />
        ))}
      </div>
    </RadioGroup>
  );
}

ColorField.propTypes = {
  fieldProps: PropTypes.object,
};
