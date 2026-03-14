import Link from "next/link";

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-white border-t border-gray-200 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-2xl font-extrabold text-blue-600">ViewIL</span>
            <span className="text-sm text-gray-500">לייצר יותר, טוב יותר</span>
          </div>

          {/* Nav links */}
          <nav>
            <ul className="flex gap-6 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  בית
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-blue-600 transition-colors">
                  תמחור
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  צור קשר
                </Link>
              </li>
              <li>
                <Link href="/tos" className="hover:text-blue-600 transition-colors">
                  תנאי שימוש
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  פרטיות
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-sm text-gray-500">נבנה בישראל 🇮🇱</p>
          <p className="text-xs text-gray-400">© 2026 ViewIL. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
