import type { PODetail, Product } from "../../types";

interface ProductsListProps {
  products: PODetail[];
}

export default function ProductsList({ products }: ProductsListProps) {
  const totalQty = products.reduce(
    (acc, p) => acc + (parseFloat(p.QTY) || 0),
    0,
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3">
        <h3 className="text-white font-bold text-sm">Products</h3>
      </div>

      {/* Product list */}
      <div className="p-4 flex flex-col gap-3 flex-1 overflow-auto">
        {products.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No products</p>
        ) : (
          products.map((p, index) => (
            <div key={index} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1 py-2.5 rounded w-[125px]">
                    {p.PRODUCT_CODE}
                  </span>
                  <span className="text-sm font-semibold text-blue-700 text-[11px]">
                    {p.PRODUCT_NAME}
                  </span>
                </div>
                {/* <p className="text-xs text-gray-500 mt-0.5">{p.PRODUCT_NAME}</p> */}
              </div>
              <span className="text-sm font-bold text-blue-700 whitespace-nowrap">
                {Number(p.QTY).toLocaleString()} {p.UNIT}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {products.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 text-right">
          <span className="text-sm font-bold text-blue-700">
            Total Qty : {totalQty.toLocaleString()} {products[0].UNIT}
          </span>
        </div>
      )}
    </div>
  );
}
