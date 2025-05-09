import Link from "next/link";

export default function Page() {
    return(
        <div className="flex flex-col mx-auto items-center space-y-12 text-xl">
            <h1 className="text-2xl">Pragmatica is committed to helping you with any issues you may face.</h1>
            <div className="text-center">
                <h1>For any urgent inquiries, contact us at:</h1>
                <h1><b>admin@pragmatica.ca</b></h1>
            </div>
            <div>
                <h1>If you would like to speak with us, schedule a meeting at your convenience:</h1>
                <Link 
                className="flex py-4 my-6 justify-center bg-blue-500 hover:bg-blue-400 rounded-xl"
                href="https://calendly.com/thomas-pragmatica/30min"
                >
                    <div className="text-white">
                        <h1>Schedule a Meeting</h1>
                    </div>
                </Link>
            </div>
            <div>
                <h1>If you would like to request any new data or other features, please feel free to contact us and ask!</h1>
            </div>
        </div>
    );
}