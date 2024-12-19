import Dropdown from "./Dropdown";
import { ReactComponent as Icon } from "./dots.svg";
import "./index.css";

function MathFunction({ functionName, setOutput, nextFunction, index }) {
  const toSnakeCase = (title) =>
    title.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w_]/g, "");

  return (
    <div className="relative">
      <div className="border-2 border-[#DFDFDF] p-5 m-5 rounded-[15px] h-[251px] w-[235px]">
        <div className="flex gap-2.5">
          <div className="mt-3">
            <Icon width={12} height={7} />
          </div>
          <div className="text-[#A5A5A5] text-[14px] font-semibold">
            {functionName}
          </div>
        </div>
        <div className="mt-3">
          <label className="text-[#252525] font-medium text-[12px]">Equation</label>
        </div>
        <input
          type="text"
          className="border border-[#D3D3D3] px-2 py-1 rounded-lg w-[195px] h-[23px] focus:outline-none focus:border-blue-500"
          onChange={ev => {
            setOutput((prev) => ({
              ...prev,
              [index]: ev.target.value,
            }))
          }}
        />
        <div className="mt-2">
          <label className="text-[#252525] font-medium text-[12px]">
            Next Function
          </label>
        </div>
        <Dropdown value={`function${nextFunction}`} />
        <div className="w-full h-full flex justify-between mt-10 container ">
          <div className="h-full w-full flex gap-1">
            <div
              id={`${toSnakeCase(functionName)}_input`}
              className="w-[15px] h-[15px] border-[3px] border-[#D3D3D3] rounded-full flex justify-center items-center">
              <div className="w-[5px] h-[5px] rounded-full bg-blue-600"></div>
            </div>
            <div className="-mt-0.5 text-[#585757] font-medium text-[12px]">input</div>
          </div>
          <div className="h-full flex gap-1">
            <div className="-mt-0.5 text-[#585757] font-medium text-[12px]">output</div>
            <div
              id={`${toSnakeCase(functionName)}_output`}
              className="w-[15px] h-[15px] border-[3px] border-[#D3D3D3] rounded-full flex justify-center items-center">
              <div className="w-[5px] h-[5px] rounded-full bg-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MathFunction;
