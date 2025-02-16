import { useState } from "react";
import { testAI } from "@/lib/fileParser";

export default function TestAI() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    await testAI(inputValue);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="w-full">
        <h2>Test AI:</h2>
        <input
          className="w-full border-2 border-red-500"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
