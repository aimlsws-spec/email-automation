// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Table, Tag, THead, TBody, Th, Tr, Td } from "components/ui";

// ----------------------------------------------------------------------

const cols = ["Name", "SKU", "Price", "Quantity", "Discount", "Total"];

export function SubRowComponent({ row, cardWidth }) {
  return (
    <div
      className="sticky border-b border-b-gray-200 bg-gray-50 pb-4 pt-3 dark:border-b-dark-500 dark:bg-dark-750 ltr:left-0 rtl:right-0"
      style={{ maxWidth: cardWidth }}
    >
      <p className="mt-1 px-4 font-medium text-gray-800 dark:text-dark-100 sm:px-5 lg:ltr:ml-14 rtl:rtl:mr-14">
        Customer orders:
      </p>

      <div className="mt-1 overflow-x-auto overscroll-x-contain px-4 sm:px-5 lg:ltr:ml-14 rtl:rtl:mr-14">
        <Table
          hoverable
          className="w-full text-left text-xs-plus rtl:text-right [&_.table-td]:py-2"
        >
          <THead>
            <Tr className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500">
              {cols.map((title, index) => (
                <Th
                  key={index}
                  className="py-2 font-semibold uppercase text-gray-800 first:px-0 last:px-0 dark:text-dark-100"
                >
                  {title}
                </Th>
              ))}
            </Tr>
          </THead>
          <TBody>
            {row.original.products.map((tr) => (
              <Tr
                key={tr.sku}
                className="border-y border-transparent border-b-gray-200 dark:border-b-dark-500"
              >
                <Td className="px-0 font-medium ltr:rounded-l-lg rtl:rounded-r-lg">
                  <div className="flex items-center space-x-2 ">
                    <div className="size-8">
                      <img
                        src={tr.image}
                        alt={tr.name}
                        className="h-full w-full rounded-sm object-cover object-center"
                      />
                    </div>
                    <span>{tr.name}</span>
                  </div>
                </Td>
                <Td>{tr.sku}</Td>
                <Td>{tr.price}</Td>
                <Td>{tr.qty}</Td>
                <Td>{tr.discount}</Td>
                <Td className="px-0 font-medium text-gray-800 dark:text-dark-100 ltr:rounded-r-lg rtl:rounded-l-lg">
                  {tr.total}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <div className="flex justify-end px-4 sm:px-5">
        <div className="mt-4 w-full max-w-xs text-end">
          <Table className="w-full [&_.table-td]:px-0 [&_.table-td]:py-1">
            <TBody>
              <Tr>
                <Td>Summary :</Td>
                <Td>
                  <span className="font-medium text-gray-800 dark:text-dark-100">
                    ${row.original.subtotal}
                  </span>
                </Td>
              </Tr>
              <Tr>
                <Td>Delivery fee :</Td>
                <Td>
                  <span className="font-medium text-gray-800 dark:text-dark-100">
                    ${row.original.delivery_fee}
                  </span>
                </Td>
              </Tr>
              <Tr>
                <Td>Tax :</Td>
                <Td>
                  <span className="font-medium text-gray-800 dark:text-dark-100">
                    ${row.original.tax}
                  </span>
                </Td>
              </Tr>
              <Tr className="text-lg text-primary-600 dark:text-primary-400">
                <Td>Total :</Td>
                <Td>
                  <span className="font-medium">
                    ${row.original.total_amount_due}
                  </span>
                </Td>
              </Tr>
            </TBody>
          </Table>
          <div className="mt-2 flex justify-end gap-1.5">
            <Tag component="button" className="min-w-[4rem]">
              Invoice
            </Tag>
            <Tag component="button" color="primary" className="min-w-[4rem]">
              View
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
}

SubRowComponent.propTypes = {
  row: PropTypes.object,
  cardWidth: PropTypes.number,
};
