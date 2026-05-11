// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

// ----------------------------------------------------------------------

const cols = ["Prop", "Default", "Description"];

export function ComponentProps({ properties }) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium text-gray-800 dark:text-dark-100">
        Component API
      </h2>

      {properties.map((comp, i) => (
        <div className="mt-4" key={i}>
          <h4 className="text-lg font-medium">{comp.componentName}</h4>
          <p>{comp.desc}</p>
          <div className="hide-scrollbar min-w-full overflow-x-auto">
            <Table className="w-full min-w-[540px] text-left rtl:text-right">
              <THead>
                <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
                  {cols.map((title, index) => (
                    <Th
                      key={index}
                      className="px-0 font-semibold uppercase text-gray-800 dark:text-dark-100"
                    >
                      {title}
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                {comp.props.map((tr, i) => (
                  <Tr
                    key={i}
                    className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
                  >
                    <Td className="w-2/12 shrink-0 px-0">
                      <code className="text-gray-800 before:content-['`'] after:content-['`'] dark:text-dark-100">
                        {tr.name}
                      </code>
                    </Td>
                    <Td className="w-2/12 shrink-0">
                      <code className="text-gray-800 before:content-['`'] after:content-['`'] dark:text-dark-100">
                        {tr.default !== undefined && tr.default !== ""
                          ? typeof tr.default === "boolean"
                            ? tr.default.toString()
                            : tr.default
                          : "—"}
                      </code>
                    </Td>
                    <Td className="w-2/3 px-0 whitespace-normal">
                      <div className="inline-code">
                        <code className="before:content-['`'] after:content-['`']">
                          {tr.type}
                        </code>
                      </div>
                      <div className="mt-1 min-w-80 max-w-xl text-balance">{tr.description}</div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}

ComponentProps.propTypes = {
  properties: PropTypes.array,
};
