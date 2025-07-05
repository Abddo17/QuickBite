import React from 'react';


const Loader = () => {
    return (
        <div className=' h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900 '>
            <div className="relative z-1 w-[300px] h-[30px] flex items-center justify-center    ">
                <div className="circle_t " />
                <div className="circle_t" />
                <div className="circle_t" />
                <div className="shadow" />
                <div className="shadow" />
                <div className="shadow" />
            </div>
        </div>
    );
}



export default Loader;
