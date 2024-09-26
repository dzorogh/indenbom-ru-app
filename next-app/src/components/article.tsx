import {MDXRemote} from "next-mdx-remote/rsc";

export const Article = ({content}: { content: string }) => {
    return (
        <div>
            <MDXRemote source={content} />
        </div>
    )
};
