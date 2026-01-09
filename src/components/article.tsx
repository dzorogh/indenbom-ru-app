import {MDXRemote} from "next-mdx-remote/rsc";
import {SerializeOptions} from "next-mdx-remote/dist/types";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import {AppLink} from "@/components/app-link";

export const Article = ({content}: { content: string }) => {
    const components = {
        h1: (props) => <h2
            className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"  {...props} />,
        h2: (props) => <h2
            className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"  {...props} />,
        p: (props) => <p className="leading-7 [&:not(:first-child)]:mt-6"  {...props} />,
        a: (props) => <AppLink {...props} />
    }

    const options = {
        mdxOptions: {
            format: 'md',
            rehypePlugins: [
                rehypeExternalLinks,
            ],
            remarkPlugins: [
                remarkGfm
            ]
        }
    } as SerializeOptions;

    return (
        <div className="max-w-prose break-words">
            <MDXRemote options={options} source={content} components={components}/>
        </div>
    )
};
