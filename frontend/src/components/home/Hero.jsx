import React from 'react';

const Hero = () => {
    return (
        <div className='h-[75vh] flex flex-col lg:flex-row'>
            <div className='mt-10 px-4 w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center'>
                <h1 className='text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left'>
                    Discover Your Next<br />Great Read
                </h1>
                <p className='mt-4 text-xl text-zinc-300 text-center lg:text-left'>
                    Uncover captivating stories, enriching knowledge, 
                    and endless inspiration in our curated collection of books
                </p>
                <div className='mt-8'>
                    <button className='text-xl lg:text-2xl text-yellow-100 font-semibold border border-yellow-100 px-10 py-3 rounded-full hover:bg-zinc-800 transition-all duration-300'>
                        Discover Books
                    </button>
                </div>
            </div>
            <div className='w-full lg:w-3/6 h-auto flex items-center justify-center mt-8 lg:mt-0 px-4'>
                <img className='w-full max-w-xs lg:max-w-full h-48 lg:h-[75vh] object-cover rounded-lg' src="./hero.png" alt="hero" />
            </div>
        </div>
    );
}

export default Hero;
