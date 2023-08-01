import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        //calling the function
        handleResize();
        //adding an eventListener
        window.addEventListener("resize", handleResize);

        //useEffect cleanup function
        return () =>  window.removeEventListener("resize", handleResize);

    }, [])

    return windowSize;
}

export default useWindowSize;