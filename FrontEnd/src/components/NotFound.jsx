import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    const handleRedirect = () =>{
        navigate('/');
    }
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white">
            {/* Dynamic background effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-black to-zinc-900 opacity-80"
                style={{
                    backgroundPosition: `${mousePosition.x / 50}px ${mousePosition.y / 50}px`
                }}
            />

            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

            {/* Radial spotlight effect */}
            <div
                className="absolute pointer-events-none"
                style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    width: '800px',
                    height: '800px',
                    marginLeft: '-400px',
                    marginTop: '-400px',
                    background: 'radial-gradient(circle, rgba(52,52,64,0.15) 0%, rgba(0,0,0,0) 70%)',
                    transform: 'translate(0, 0)'
                }}
            />

            {/* Main content container */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 py-16">
                {/* "404" hero text with custom styling */}
                <div className="relative">
                    <h1 className="text-9xl font-black tracking-tighter text-zinc-900">
                        404
                    </h1>
                    <h1 className="absolute inset-0 text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-900">
                        404
                    </h1>
                    <h1 className="absolute inset-0 text-9xl font-black tracking-tighter text-transparent" style={{
                        textShadow: '1px 1px 2px rgba(255,255,255,0.05)',
                        transform: 'translate(1px, 1px)'
                    }}>
                        404
                    </h1>
                </div>

                {/* Horizontal line with glowing effect */}
                <div className="relative w-full h-px my-8">
                    <div className="absolute top-0 left-0 w-full h-px bg-zinc-800"></div>
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-zinc-700 blur-sm"></div>
                </div>

                {/* Page title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="mt-6 text-zinc-400 text-center max-w-md">
                    The page you're looking for doesn't exist or has been moved to another location.
                </p>

                {/* CTA button with advanced hover effects */}
                <div className="mt-10 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                    <button
                        className="relative flex items-center cursor-pointer px-8 py-4 bg-zinc-900 rounded-lg border border-zinc-800 text-white font-medium transition-all duration-300"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={handleRedirect}
                    >
                        <span>Return to Homepage</span>
                        <svg className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>
                </div>

                {/* Footer element */}
                <div className="mt-16 flex items-center space-x-1.5">
                    <span className="w-8 h-px bg-zinc-800"></span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="w-8 h-px bg-zinc-800"></span>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
