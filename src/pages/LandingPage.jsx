import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa6"; 

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center items-center text-center px-6">
      <section className="max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">Kavios Pix</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A simple and elegant place to store, view, and manage your favorite
          memories. Upload your photos, organize albums, and relive every moment
          — beautifully.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/albums"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
          >
            View Albums
          </Link>

          <a
            href="https://github.com/ravipatelctf/frontend-kavios-pix"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center gap-1 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition"
          >
            <FaGithub size={20} />
            View Github
          </a>
        </div>
      </section>

      <footer className="mt-16 text-gray-400 text-sm">
        Built with ❤️ by <a target="_blank" href="https://github.com/ravipatelctf" className="font-bold">ravipatelctf</a>
      </footer>
    </main>
  );
}
