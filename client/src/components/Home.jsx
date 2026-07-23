import {useEffect} from "react";
import api from "../sservices/api";

function Home() {
    useEffect(()=> {
        console.log(api.defaults.baseURL);
    }, []);

    return (
        <h1>Home Page</h1>
    );
}

export default Home;