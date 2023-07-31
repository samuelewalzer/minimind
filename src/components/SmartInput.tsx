import { useState } from "react"

export default function SmartInput(props) {
    const [smartInput, setSmartInput] = useState({
        name: "",
        prob: Number,
        subtasks: [],
    })

    function handleChange(e) {
        setSmartInput({
            ...smartInput,
            [e.target.id]: e.target.value,
        });
    }

    return (
        <input
          type="text"
          id="name"
          className="input input__lg"
          autoComplete="off"
          placeholder="SmartInput"
          value={smartInput.name}
          onChange={handleChange}
        />
    )
}