import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";

import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import StatsCard from "../components/StatsCard";
import ProgressCard from "../components/ProgressCard";
import AIInsights from "../components/AIInsights";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import SmartPlanner from "../components/SmartPlanner";
import ProductivityAnalytics from "../components/ProductivityAnalytics";
import VoiceAssistant from "../components/VoiceAssistant";
import QuirkyAlert from "../components/QuirkyAlert";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  
  // Explicit tracking node mapping for Copilot context state injection
  const [activeAnalysisTask, setActiveAnalysisTask] = useState(null);

  const loadTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);

      // Re-sync the active analysis task if it exists in the freshly pulled array
      if (activeAnalysisTask) {
        const updated = taskList.find((t) => t.id === activeAnalysisTask.id);
        if (updated) setActiveAnalysisTask(updated);
      }
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
      if (activeAnalysisTask?.id === id) setActiveAnalysisTask(null);
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
    }
  };

const handleAnalyze = async (task) => {
  try {
    setLoadingTaskId(task.id);
    setActiveAnalysisTask(task);
    
    // 🛠️ Passing both the heading and description fields together here
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        task: task.taskName,
        description: task.description || "" 
      }),
    });
    const data = await response.json();
    
    if (data.success) {
      const freshAiText = data.data || data.aiSuggestions || data.aiSuggestion;
      
      const updatedTask = { 
        ...task, 
        aiSuggestions: freshAiText,
        aiSuggestion: freshAiText
      };

      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );

      setActiveAnalysisTask(updatedTask);

      await updateDoc(doc(db, "tasks", task.id), {
        aiSuggestions: freshAiText,
        aiSuggestion: freshAiText
      });
      
    } else {
      alert(`⚠️ Backend Processing Error: ${data.message || "Unknown error encountered"}`);
    }
  } catch (error) {
    console.error("Analysis Connection Drop:", error);
    alert("❌ Network Error: Could not connect to the backend server.");
  } finally {
    setLoadingTaskId(null);
  }
};

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  let displayedTasks = [...tasks].filter((task) =>
    task.taskName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filter !== "All") {
    if (filter === "Completed") displayedTasks = displayedTasks.filter((t) => t.completed);
    else if (filter === "Pending") displayedTasks = displayedTasks.filter((t) => !t.completed);
    else displayedTasks = displayedTasks.filter((t) => t.priority === filter);
  }

  if (sortBy === "Deadline") {
    displayedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (sortBy === "Priority") {
    const weights = { High: 3, Medium: 2, Low: 1 };
    displayedTasks.sort((a, b) => weights[b.priority] - weights[a.priority]);
  } else if (sortBy === "Oldest") {
    displayedTasks.reverse();
  } else {
    displayedTasks.sort((a, b) => b.id.localeCompare(a.id));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100">
      
      <header className="border-b border-slate-200/70 bg-white/85 backdrop-blur-md sticky top-0 z-40 px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shadow-sm">
            ⏳
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">Last-Minute Life Saver</h1>
            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Studio Architecture Environment</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-md shadow-sm transition-all active:scale-[0.98]"
        >
          + Create Task
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Symmetrical KPI Matrix Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCard title="Active Tasks" value={total} subtitle="Total database records" color="text-indigo-600" />
          <StatsCard title="Pending Review" value={pending} subtitle="Awaiting pipeline nodes" color="text-amber-600" />
          <StatsCard title="Completed Items" value={completed} subtitle="Verified execution states" color="text-emerald-600" />
        </div>

        {/* Dynamic Structural Grid - Using items-stretch to sync layout baselines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column Sidebar Array Stack */}
          <div className="lg:col-span-4 flex flex-col space-y-4 justify-start">
            <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
              <ProgressCard progress={progress} />
            </div>
            <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
              <ProductivityAnalytics tasks={tasks} />
            </div>
            <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
              <UpcomingDeadlines tasks={tasks} />
            </div>
            <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
              <SmartPlanner tasks={tasks} />
            </div>
          </div>

          {/* Right Main Focus Operations Panel Grid */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Dynamic Copilot Insights Hub Block Wrapper */}
            <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
              <AIInsights 
  selectedTask={activeAnalysisTask} 
  tasks={tasks} 
  loadingTaskId={loadingTaskId} 
/>
            </div>

            {/* Clean Light Filter Tool Options Matrix */}
            <div className="bg-white border border-slate-200/70 p-3.5 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Filter workspace pipeline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-[10px] font-black tracking-wider uppercase bg-slate-50 border border-slate-200 text-slate-500 rounded-md px-2 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-[10px] font-black tracking-wider uppercase bg-slate-50 border border-slate-200 text-slate-500 rounded-md px-2 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="Newest">Sort: Newest</option>
                  <option value="Oldest">Sort: Oldest</option>
                  <option value="Deadline">Sort: Deadline</option>
                  <option value="Priority">Sort: Priority</option>
                </select>
              </div>
            </div>

            {/* Scroll-Bounded Task Collection Feed Container */}
            <div className="space-y-2.5 flex-1 flex flex-col">
              <h3 className="text-[10px] font-black tracking-wider text-slate-400 uppercase pl-1">
                Live Pipeline Feed Stream
              </h3>

              {displayedTasks.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-400 text-xs font-medium flex-1 flex items-center justify-center">
                  No operational task metrics currently match workspace filters.
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin flex-1">
                  {displayedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onToggleComplete={handleToggleComplete}
                      onAnalyze={handleAnalyze}
                      isLoading={loadingTaskId === task.id}
                      isCurrentAnalysis={activeAnalysisTask?.id === task.id}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <VoiceAssistant onRefreshTasks={loadTasks} />
      <QuirkyAlert tasks={tasks} />

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
    </div>
  );
}

export default Dashboard;