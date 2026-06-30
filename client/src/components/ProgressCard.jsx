function ProgressCard({ progress }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-5">
        📈 Today's Progress
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-5">

        <div
          className="bg-green-500 h-5 rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <p className="mt-4 font-semibold">
        {progress}% Completed
      </p>

    </div>
  );
}

export default ProgressCard;