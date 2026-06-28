import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));

      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteDoc(doc(db, "tasks", id));
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
      });

      loadTasks();
    } catch (error) {
      console.error(error);
      alert("Unable to update task.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold">
        👋 Welcome!
      </h1>

      <p className="text-gray-600 mt-2">
        Your AI Productivity Companion
      </p>

      <button
        onClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        + Add Task
      </button>

      {showForm && (
        <TaskForm
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onTaskAdded={loadTasks}
          editingTask={editingTask}
        />
      )}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-5">
          Today's Tasks
        </h2>

        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">
            No tasks yet.
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;