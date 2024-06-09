import React, { useState } from "react";
import * as math from "mathjs";

const Compute = () => {
  const [equation, setEquation] = useState("");
  const [xl, setXl] = useState(0);
  const [xr, setXr] = useState(0);
  const [x0, setX0] = useState(0);
  const [precision, setPrecision] = useState(0);
  const [method, setMethod] = useState("Bisection");
  const [roundOff, setRoundOff] = useState(2);
  const [results, setResults] = useState([]);

  const compute = () => {
    let iteration = 0;
    let xlVal = parseFloat(xl);
    let xrVal = parseFloat(xr);
    let x0Val = parseFloat(x0);
    let lastTwoYmValues = [];
    let iterate = [];

    if (method === "Newton") {
      let relError = precision + 1;
      let lastRelError = "";

      while (iteration < 100) {
        iteration++;
        let fx = evaluate(equation, x0Val);
        let primefx = evaluateDerivative(equation, x0Val);

        let newx = x0Val - fx / primefx;

        if (iteration === 1) {
          lastRelError = "";
        } else {
          lastRelError = relError;
        }

        relError = Math.abs((newx - x0Val) / newx);

        iterate.push({
          iteration: iteration,
          x0: x0Val,
          newx: newx,
          fx: fx,
          primefx: primefx,
          relError: lastRelError,
        });

        if (Math.abs(fx) <= 0.0) {
          iterate.push({
            iteration: iteration,
            x0: x0Val,
            newx: newx,
            fx: 0,
            primefx: primefx,
            relError: 0,
          });
          break;
        }

        x0Val = newx;
      }
    } else {
      while (iteration < 100) {
        iteration++;

        let yl = evaluate(equation, xlVal);
        let yr = evaluate(equation, xrVal);

        let xm;
        if (method === "Bisection") {
          xm = (xlVal + xrVal) / 2;
        } else if (method === "Falsi") {
          xm = xlVal + (xrVal - xlVal) * (yl / (yl - yr));
        }
        let ym = evaluate(equation, xm);

        iterate.push({
          iteration: iteration,
          xl: xlVal,
          xr: xrVal,
          xm: xm,
          yl: yl,
          yr: yr,
          ym: ym,
        });

        lastTwoYmValues.push(ym);
        if (lastTwoYmValues.length > 2) {
          lastTwoYmValues.shift();
        }

        if (
          Math.abs(ym) <= precision &&
          Math.abs(lastTwoYmValues[1] - lastTwoYmValues[0]) < precision
        ) {
          break;
        }

        if (ym === 0.0) {
          iterate.push({
            iteration: iteration,
            xl: xlVal,
            xr: xrVal,
            xm: xm,
            yl: yl,
            yr: yr,
            ym: ym,
          });
          break;
        } else if (ym * yl < 0) {
          xrVal = xm;
        } else {
          xlVal = xm;
        }
      }
    }

    setResults(iterate);
  };

  const evaluate = (expression, x) => {
    return math.evaluate(expression.replace(/x/g, `(${x})`));
  };

  const evaluateDerivative = (expression, x) => {
    const derivative = math.derivative(expression, "x");
    return derivative.evaluate({ x: x });
  };

  const formatNumber = (number, decimals) => {
    return parseFloat(number.toFixed(decimals)).toString();
  };

  return (
    <>
      <div className="w-full flex bg-[#181818] justify-center items-center">
        <div className="py-5 px-7">
          <form>
            <div className="grid gap-6 mb-6 w-[720px]">
              <div>
                <label className="text-white text-xl block pb-2 font-bold">
                  Equation
                </label>
                <input
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  className="rounded-md text-xl font-bold px-3 w-full h-14"
                  placeholder="x^2 + 2*x"
                ></input>
              </div>
              {method !== "Newton" ? (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-white text-md block pb-2 font-semibold">
                      X<sub>L</sub>
                    </label>
                    <input
                      value={xl}
                      type="number"
                      onChange={(e) => setXl(parseFloat(e.target.value))}
                      className="rounded-md text-xm font-bold px-3 w-full h-10"
                      placeholder="1"
                    ></input>
                  </div>
                  <div>
                    <label className="text-white text-md block pb-2 font-semibold">
                      X<sub>R</sub>
                    </label>
                    <input
                      value={xr}
                      type="number"
                      onChange={(e) => setXr(parseFloat(e.target.value))}
                      className="rounded-md text-xm font-bold px-3 w-full h-10"
                      placeholder="2"
                    ></input>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-white text-md block pb-2 font-semibold">
                    X<sub>0</sub>
                  </label>
                  <input
                    value={x0}
                    type="number"
                    onChange={(e) => setX0(parseFloat(e.target.value))}
                    className="rounded-md text-xm font-bold px-3 w-full h-10"
                    placeholder="1"
                  ></input>
                </div>
              )}
              <div className="grid grid-cols-3 gap-6">
                {method !== "Newton" && (
                  <div>
                    <label className="text-white text-md block pb-2 font-semibold">
                      Precision
                    </label>
                    <input
                      value={precision}
                      type="number"
                      onChange={(e) => setPrecision(parseFloat(e.target.value))}
                      className="rounded-md text-xm font-bold px-3 w-full h-10"
                      placeholder="0.1"
                    ></input>
                  </div>
                )}
                <div>
                  <label className="text-white text-md block pb-2 font-semibold">
                    Round off
                  </label>
                  <select
                    value={roundOff}
                    onChange={(e) => setRoundOff(parseInt(e.target.value))}
                    className="rounded-md text-xm font-md px-3 w-full h-10"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label className="text-white text-md block pb-2 font-semibold">
                    Methods
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="rounded-md text-xm font-md px-3 w-full h-10"
                  >
                    <option value="Bisection">Bisection</option>
                    <option value="Falsi">False Position</option>
                    <option value="Newton">Newton Raphson</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevents form submission
                compute(); // Call the compute function
              }}
              className="h-10 w-28 rounded-lg bg-white hover:bg-slate-400 font-bold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-white text-xl font-bold mb-4">Results</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Iteration</th>
                {method !== "Newton" ? (
                  <>
                    <th className="px-4 py-2">XL</th>
                    <th className="px-4 py-2">XM</th>
                    <th className="px-4 py-2">XR</th>
                    <th className="px-4 py-2">YL</th>
                    <th className="px-4 py-2">YM</th>
                    <th className="px-4 py-2">YR</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2">X</th>
                    <th className="px-4 py-2">f(X)</th>
                    <th className="px-4 py-2">f'(X)</th>
                    <th className="px-4 py-2">Relative Error</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.iteration}</td>
                  {method !== "Newton" ? (
                    <>
                      <td className="border px-4 py-2">
                        {formatNumber(item.xl, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.xm, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.xr, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.yl, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.ym, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.yr, roundOff)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2">
                        {formatNumber(item.x0, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.fx, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.primefx, roundOff)}
                      </td>
                      <td className="border px-4 py-2">
                        {formatNumber(item.relError * 100, roundOff)}%
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Compute;
