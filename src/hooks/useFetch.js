import { useEffect, useState } from "react"

const useFetch = (url) => {
    const [files, setFiles] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            console.log('FETCHING from',url)
            try{
                let res = await fetch(url)
                const json = await res.json();
                setFiles(json)
            }
            catch(e){
                console.log('useFetch Error',)
            }
        };
        fetchData()
    },[url])
    return files;
}

export default useFetch;