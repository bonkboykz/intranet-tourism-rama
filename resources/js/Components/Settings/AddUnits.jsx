import React, { useState, useEffect } from "react";
import { useCsrf } from "@/composables";

const AddUnits = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editingUnitName, setEditingUnitName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const csrfToken = useCsrf();

  const fetchDepartments = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const departmentData = data.data.data.map((department) => ({
        id: department.id,
        name: department.name
      }));

      setDepartments((prevDepartments) => {
        const allDepartments = [...prevDepartments, ...departmentData];
        return allDepartments.sort((a, b) => a.name.localeCompare(b.name));
      });

      if (data.data.next_page_url) {
        fetchDepartments(data.data.next_page_url);
      } else {
        setIsLoadingDepartments(false); 
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoadingDepartments(false); 
    }
  };

  const fetchUnits = async (url) => {
    let allUnits = [];
    let hasMorePages = true;
    setIsLoadingUnits(true); 

    try {
      while (hasMorePages) {
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const unitData = data.data.map((unit) => ({
          id: unit.id,
          name: unit.name,
        }));

        allUnits = [...allUnits, ...unitData];

        if (data.next_page_url) {
          const urlObj = new URL(data.next_page_url);
          const params = new URLSearchParams(urlObj.search);
          params.set("department_id", selectedDepartmentId);
          url = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
        } else {
          hasMorePages = false;
        }
      }
      setUnits(allUnits.sort((a, b) => a.name.localeCompare(b.name)));
      setIsLoadingUnits(false);
    } catch (error) {
      console.error("Error fetching units:", error);
      setIsLoadingUnits(false); 
    }
  };

  useEffect(() => {
    fetchDepartments("/api/department/departments");
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchUnits(`/api/department/business_units?department_id=${selectedDepartmentId}&page=1`);
    }
  }, [selectedDepartmentId]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const createUnit = () => {
    if (newUnit.trim() === "" || !selectedDepartmentId) return;
  
    fetch("/api/department/business_units", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        name: newUnit,
        department_id: selectedDepartmentId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setUnits((prevUnits) => {
            const allUnits = [...prevUnits, data.data];
            return allUnits.sort((a, b) => a.name.localeCompare(b.name));
          });
          setNewUnit("");
          setIsPopupOpen(false);
          showMessage("success", "New unit added successfully.");
        } else {
          throw new Error("Failed to add new unit.");
        }
      })
      .catch((error) => {
        showMessage("error", error.message);
      });
  };

  const editUnit = (id, name) => {
    setEditingUnitId(id);
    setEditingUnitName(name);
  };

  const saveUnit = () => {
    if (editingUnitName.trim() === "") return;

    fetch(`/api/department/business_units/${editingUnitId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ name: editingUnitName }),
    })
      .then((response) => {
        if (response.status === 204) {
          return null;
        }
        return response.json();
      })
      .then(() => {
        setUnits((prevUnits) =>
          prevUnits.map((unit) =>
            unit.id === editingUnitId ? { ...unit, name: editingUnitName } : unit
          )
        );
        setEditingUnitId(null);
        setEditingUnitName("");
        showMessage("success", "Unit edited successfully.");
      })
      .catch((error) => {
        showMessage("error", `Failed to edit unit. ${error.message}`);
      });
  };

  return (
    <div className="container p-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Units</h1>
          <p className="text-gray-600">
            Select a department to view and manage its business units.
          </p>
        </div>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
          disabled={!selectedDepartmentId}
        >
          Add New Unit
        </button>
      </div>

      {/* Department Selection */}
      <div className="mb-6">
        <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-700">
          Select Department
        </label>
        {isLoadingDepartments ? (
          <div className="flex items-center justify-center h-64 max-w-[1050px]">
            <div className="w-16 h-16 border-b-2 border-gray-900 max-w-[1050px] rounded-full animate-spin"></div>
          </div>
        ) : (
          <select
            id="department"
            value={selectedDepartmentId}
            onChange={(e) => setSelectedDepartmentId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select a Department --</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-green-100 rounded-lg flex items-center justify-start py-4 px-8 ${
              message.type === "success" ? "font-bold text-lg bg-green-100 text-green-800  " : "font-bold text-lg bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* Units Table */}
      {selectedDepartmentId && (
        <>
          {isLoadingUnits ? (
            <div className="flex items-center justify-center h-64 max-w-[1050px]">
              <div className="w-16 h-16 border-b-2 border-gray-900 max-w-[1050px] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <table className="min-w-full mt-2 leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-sm font-semibold text-left text-gray-500 uppercase bg-white">
                      Name
                    </th>
                    <th className="px-5 py-3 bg-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit) => (
                    <tr key={unit.id}>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        {editingUnitId === unit.id ? (
                          <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={editingUnitName}
                            onChange={(e) => setEditingUnitName(e.target.value)}
                          />
                        ) : (
                          <span>{unit.name}</span>
                        )}
                      </td>
                      <td className="px-5 py-5 text-sm text-right bg-white border-b border-gray-200">
                        {editingUnitId === unit.id ? (
                          <button
                            onClick={saveUnit}
                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => editUnit(unit.id, unit.name)}
                            className="mr-4 text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Popup for adding a new unit */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Unit</h2>
            </div>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Unit Name"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 text-gray-500 bg-white border-2 border-gray-500 rounded-full hover:bg-gray-500 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={createUnit}
                className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-700"
                disabled={!selectedDepartmentId}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUnits;
