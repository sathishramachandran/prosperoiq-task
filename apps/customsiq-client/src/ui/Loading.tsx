import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div>
      <div className=" flex h-32 flex-col  border-card-line ">
        <div className="p-4 flex flex-auto flex-col justify-center items-center">
          <div className="flex justify-center">
            <div
              className="animate-spin inline-block size-15 border-3 border-current border-t-transparent rounded-[999px] text-ciq-primary"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
