import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

function TaskForm({
  onClose,
  onTaskAdded,
  editingTask,
}) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.taskName);
      setDescription(editingTask.description);
      setDeadline(editingTask.deadline);
      setPriority(editingTask.priority);
    }
  }, [editingTask]);

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      alert("Please enter a task name.");
      return;
    }

    try {
      if (editingTask) {
        await updateDoc(doc(db, "tasks", editingTask.id), {
          taskName,
          description,
          deadline,
          priority,
        });

        alert("Task Updated!");
      } else {
        await addDoc(collection(db, "tasks"), {
          taskName,
          description,
          deadline,
          priority,
          completed: false,
          createdAt: new Date(),
        });

        alert("Task Added!");
      }

      onTaskAdded();
      onClose();

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white w-[450px] rounded-xl shadow-xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3"
            rows="4"
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg"
          >
            {editingTask ? "Update Task" : "Save Task"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default TaskForm;