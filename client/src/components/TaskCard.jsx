function TaskCard({ task, onDelete, onEdit, onToggleComplete }) {
  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div
      className={`rounded-xl shadow-md p-5 border transition ${
        task.completed ? "bg-gray-100 opacity-70" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start">

        <div className="flex items-start gap-3">

          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
            className="w-5 h-5 mt-1"
          />

          <div>

            <h2
              className={`text-xl font-semibold ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              📌 {task.taskName}
            </h2>

            <p
              className={`mt-3 ${
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-600"
              }`}
            >
              {task.description}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              📅 {task.deadline}
            </p>

          </div>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

      </div>

      <div className="flex justify-end gap-3 mt-5">

        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          ✏ Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          🗑 Delete
        </button>

      </div>
    </div>
  );
}

export default TaskCard;