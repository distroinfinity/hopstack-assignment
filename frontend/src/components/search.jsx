import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { useMemo } from "react";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const search = async (query) => {
    if (!query) {
      setData([]);
      return;
    }
    setLoading(true);
    // console.log("search query is ", query);
    const notification = toast.loading("Searching...");
    const result = await axios.post(`http://localhost:3000/`, { query });
    if (result.status === 200) {
      console.log(result.data?.data);
      setData(result.data?.data);
      setQuery("");
      toast.success("Result Found", { id: notification });
    } else {
      toast.error("Error :(", { id: notification });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    // console.log("Debounced call", e.target.value);
    search(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 800);
  });
  return (
    <div>
      <div className="flex h-screen w-screen space-y-10 flex-col items-center py-20">
        <div className="flex space-x-4 items-center">
          <input
            className="focus:outline-none rounded-lg p-2 bg-gray-100"
            onChange={debouncedResults}
            placeholder="Type any food item"
            disabled={loading ? "disabled" : ""}
          />
        </div>
        <h3 className="text-3xl text-center">Results</h3>
        {data.length == 0 && (
          <h4>No food item found, please search something :)</h4>
        )}

        {data.length > 0 && (
          <table class="max-w-7xl w-full mx-4">
            <thead class="bg-white border-b">
              <tr>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  #
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Food Name
                </th>
                <th
                  scope="col"
                  class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Calories
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((dt, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 == 0 ? "bg-gray-100" : "bg-white"
                  }  border-b`}
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {idx + 1}
                  </td>
                  <td class="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    {dt?.foodName.charAt(0).toUpperCase() +
                      dt?.foodName.slice(1)}
                  </td>
                  <td class="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    {dt.calories} cal
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
