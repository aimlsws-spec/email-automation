// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";

export function Params({ params }) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium text-gray-800 dark:text-dark-100">
        Parameters
      </h2>

      <div className="hide-scrollbar min-w-full overflow-x-auto">
        <Table className="w-full min-w-[540px] text-left rtl:text-right">
          <THead>
            <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
              <Th className="px-0 font-semibold uppercase text-gray-800 dark:text-dark-100">
                Parameter
              </Th>
              <Th className="font-semibold uppercase text-gray-800 dark:text-dark-100">
                Default
              </Th>
              <Th className="px-0 font-semibold uppercase text-gray-800 dark:text-dark-100">
                Description
              </Th>
            </Tr>
          </THead>
          <TBody>
            {params.map((tr, i) => (
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
                <Td className="w-2/3 whitespace-normal px-0">
                  <div className="inline-code">
                    <code className="before:content-['`'] after:content-['`']">
                      {tr.type}
                    </code>
                  </div>
                  <div className="mt-1 min-w-80 max-w-xl text-balance">
                    {tr.description}
                  </div>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

Params.propTypes = {
  params: PropTypes.array,
};
