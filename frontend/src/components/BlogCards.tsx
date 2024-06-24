import { Link } from "react-router-dom"

interface BlogCardProps {
    authorName: string,
    title: string,
    content: string,
    publishedDate: string,
    id: string

}

export const BlogCard = ({ authorName, title, content, publishedDate, id}: BlogCardProps) =>{
    return <Link to={`/blog/${id}`}>
        <div className=" p-5 border-b border-slate-300 pb-4 w-screen max-w-lg cursor-pointer">
            <div className="flex">
                <div>
                    <Avatar name={authorName}/>
                </div>
                <div className="pl-2 pt-2">
                    {authorName} | 
                </div>
                <div className="font-normal pl-2 pt-2 text-slate-400">
                    {publishedDate}
                </div>
            </div>
            <div className="text-3xl font-bold pt-3">
                {title}
            </div>
            <div className="font-normal text-slate-700 pt-1">
                {content.slice(0,100) + "..."}
            </div>
            <div className="text-slate-500 pt-6">
                {`${Math.ceil(content.length / 100)} minute(s) read`}
            </div>
        </div>
    </Link>
}

export function Avatar({ name }: { name: string }){
    return <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
    <span className="font-medium text-gray-600 dark:text-gray-300">{name[0]}</span>
    </div>
}