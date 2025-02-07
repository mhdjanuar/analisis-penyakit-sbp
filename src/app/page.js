"use client";
import { useState, useEffect } from "react";

export default function GejalaPage() {
  const [search, setSearch] = useState("");
  const [gejalaList, setGejalaList] = useState([]);
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    async function fetchGejala() {
      try {
        const res = await fetch("/api/gejala");
        const data = await res.json();
        setGejalaList(data);
      } catch (error) {
        console.error("Gagal mengambil data gejala:", error);
      }
    }

    fetchGejala();
  }, []);

  const filteredGejala = gejalaList.filter((gejala) =>
    gejala.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleGejala = (gejala) => {
    setSelectedGejala((prev) =>
      prev.includes(gejala)
        ? prev.filter((item) => item !== gejala)
        : [...prev, gejala]
    );
  };

  const handleSubmit = async () => {
    if (selectedGejala.length === 0) return;

    // Ambil ID dari gejala yang dipilih
    const selectedIds = gejalaList
      .filter((gejala) => selectedGejala.includes(gejala.name))
      .map((gejala) => gejala.id);

    try {
      const res = await fetch(
        `/api/analisis?symptoms=${selectedIds.join(",")}`
      );
      const data = await res.json();
      setAnalysisResult(data);
      setShowResult(true);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    }
  };

  const handleReset = () => {
    setSelectedGejala([]);
    setShowResult(false);
    setAnalysisResult(null);
    setSearch("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Masukkan Gejala Anda
        </h2>

        <input
          type="text"
          placeholder="Cari gejala..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="border-t border-gray-300 mb-4"></div>

        <div className="space-y-3 max-h-40 overflow-y-auto">
          {filteredGejala.map((gejala) => (
            <label
              key={gejala.id}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <input
                type="checkbox"
                checked={selectedGejala.includes(gejala.name)}
                onChange={() => toggleGejala(gejala.name)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className="text-gray-700">{gejala.name}</span>
            </label>
          ))}
        </div>

        <div className="border-t border-gray-300 mt-4"></div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className={`flex-1 text-lg py-2 rounded-lg ${
              selectedGejala.length === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition`}
            disabled={selectedGejala.length === 0}
          >
            Lanjutkan
          </button>
          <button
            onClick={handleReset}
            className="flex-1 text-lg py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>

        {/* Hasil Analisis */}
        {showResult && analysisResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Hasil Analisis:
            </h3>
            {analysisResult.name ? (
              <>
                <p className="text-gray-700">
                  Penyakit: <b>{analysisResult.name}</b>
                </p>
                <p className="text-gray-700">
                  Solusi: <b>{analysisResult.solution}</b>
                </p>
              </>
            ) : (
              <p className="text-gray-700">Tidak ada diagnosis yang cocok.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
