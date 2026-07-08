import React from "react";

type Props = {
  value: string;
  clampLines?: number; // optional (default 2)
};

const LongTextCell: React.FC<Props> = ({ value, clampLines = 2 }) => {
  const [open, setOpen] = React.useState(false);

  const strValue = value == null ? "" : String(value);
  const hasValue = strValue.trim().length > 0;

  return (
    <>
      {/* Preview Text */}
      <p
        className={`overflow-hidden text-ellipsis`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: clampLines,
          WebkitBoxOrient: "vertical",
        }}
      >
        {hasValue ? strValue : "-"}
      </p>

      {/* View More Button */}
      {hasValue && strValue.length > 100 && (
        <button
          className="text-blue-500 cursor-pointer text-xs mt-1"
          onClick={() => setOpen(true)}
        >
          View More
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 max-w-3xl w-full mx-4 rounded-lg shadow-lg">
            
            <h3 className="text-lg font-semibold mb-2">
              Full Content
            </h3>

            <div className="max-h-[60vh] overflow-y-auto">
              <p className="whitespace-pre-wrap">
                {strValue}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 cursor-pointer bg-ciq-primary text-white rounded"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default LongTextCell;