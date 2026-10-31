import Link from "next/link";
import { Search, Home, Briefcase, GraduationCap, Bus, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | School Market",
  description: "The page you are looking for could not be found on School Market.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Badge & Visual 404 */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-emerald-600/20 rounded-full blur-xl animate-pulse" />
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold shadow-sm">
            <span>Error 404</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Page Not Found</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Lost in the Nexus?
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          We couldn&apos;t find the educational resource, vacancy, or page you were looking for. It might have been moved, expired, or temporarily unavailable.
        </p>

        {/* Quick Search Action */}
        <div className="max-w-md mx-auto mb-10">
          <form action="/jobs" method="GET" className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search teaching jobs, subjects, or schools..."
              className="w-full pl-11 pr-28 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Destination Quick Links Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-left">
          <Link
            href="/jobs"
            className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Teaching Jobs</p>
              <p className="text-xs text-gray-500">Explore openings</p>
            </div>
          </Link>

          <Link
            href="/teachers"
            className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Teachers</p>
              <p className="text-xs text-gray-500">Discover educators</p>
            </div>
          </Link>

          <Link
            href="/buses"
            className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">School Buses</p>
              <p className="text-xs text-gray-500">Vehicle listings</p>
            </div>
          </Link>

          <Link
            href="/"
            className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 group-hover:text-gray-900 transition-colors">Homepage</p>
              <p className="text-xs text-gray-500">Return home</p>
            </div>
          </Link>
        </div>

        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Market Home</span>
        </Link>
      </div>
    </div>
  );
}
