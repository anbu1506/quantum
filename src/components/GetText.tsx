import { useQueueContext } from "../context/context";
import { Preview } from "./Preview";

export const GetText = () => {
  const { text } = useQueueContext();
  return (
    <div className="pt-20 text-white bg-slate-950">
      {text.length === 0 ? (
        <div className="text-center">No text received</div>
      ) : null}
      {text.map((t, idx) => {
        return (
          <div key={idx}>
            <Preview text={t}></Preview>
          </div>
        );
      })}
    </div>
  );
};
