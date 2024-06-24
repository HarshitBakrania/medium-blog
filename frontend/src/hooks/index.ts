import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Blog {

        "content": string,
        "title": string,
        "id": string,
        "author": {
            "name": string
        }
}

export const useBlog = ({ id }: { id : string}) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/post/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(reponse =>{
                setBlog(reponse.data.posts);
                setLoading(false);
            })
    }, [blog]);

    return{
        loading,
        blog
    }
}

export const useBlogs = () =>{
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/post/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(reponse =>{
                setBlogs(reponse.data.posts);
                setLoading(false);
            })
    }, []);

    return{
        loading,
        blogs
    }
}
