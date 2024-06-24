import { Avatar } from "./BlogCards"

export const Appbar = () =>{
    return <div className="border-b flex justify-between px-10 py-2">
        <div className="flex justify-center flex-col">
            Medium-blog
        </div>
        <div>
            <Avatar name="Harshit" />
        </div>
    </div>
}