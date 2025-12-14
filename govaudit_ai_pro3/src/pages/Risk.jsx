export default function Risk() {
  const data = JSON.parse(localStorage.getItem("analysis"));

  if (!data) return <p>No risk analysis yet.</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>

      <p className="text-lg">
        Risk Score:{" "}
        <span className="font-bold text-red-600">
          {data.risk.score}
        </span>
      </p>

      {data.risk.flags.length === 0 ? (
        <p className="text-green-600 mt-2">No risk flags</p>
      ) : (
        <ul className="mt-2 list-disc ml-6">
          {data.risk.flags.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
