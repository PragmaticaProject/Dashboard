export default function Page() {
    const sections = [
        { title: "Accounts Data", href: "/internal/account/", color: "bg-blue-500", hoverColor: "hover:bg-blue-400", icon: "👤" },
        { title: "Usage Information", href: "/internal/usage/", color: "bg-green-500", hoverColor: "hover:bg-green-400", icon: "📊" },
        { title: "Performance Data", href: "/internal/performance/", color: "bg-purple-500", hoverColor: "hover:bg-purple-400", icon: "⚡" },
        { title: "Retention Metrics", href: "/internal/retention/", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-400", icon: "📈" },
        { title: "Financial Data", href: "/internal/financial/", color: "bg-red-500", hoverColor: "hover:bg-red-400", icon: "💰" },
        { title: "Logs", href: "/internal/log/", color: "bg-gray-500", hoverColor: "hover:bg-gray-400", icon: "📜" },
    ];

    return (
        <div className="flex flex-col items-center space-y-8 p-6 h-screen">
            <h1 className="text-4xl font-bold text-gray-800">Internal Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-screen-lg">
                {sections.map((section, index) => (
                    <a
                        key={index}
                        href={section.href}
                        className={`flex flex-col items-center justify-center p-8 rounded-lg shadow-md text-white transition-shadow duration-300 ${section.color} ${section.hoverColor}`}
                        style={{ height: "200px" }}
                    >
                        <div className="text-6xl">{section.icon}</div>
                        <h2 className="mt-4 text-xl font-semibold">{section.title}</h2>
                    </a>
                ))}
            </div>
        </div>
    );
}
